"use server";

import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendDossierConfirmationEmail } from "@/lib/email";
import {
  CANDIDATE_PHOTO_BUCKET,
  candidateThumbnailPath,
  createCandidateThumbnail,
} from "@/lib/candidate-photo";

const dossierSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis"),
  lastName: z.string().trim().min(1, "Le nom est requis"),
  gender: z.enum(["homme", "femme"], { message: "Merci de préciser le genre" }),
  birthDate: z.string().trim().optional(),
  country: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Adresse email invalide"),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide"),
  yearsInCountry: z.coerce.number().int().min(0).optional(),
  maritalStatus: z.enum(["celibataire", "divorce", "veuf"]).optional(),
  childrenCount: z.coerce.number().int().min(0).optional(),
  tribe: z.string().trim().max(120).optional(),
  religion: z.string().trim().max(120).optional(),
  heightCm: z.coerce.number().int().min(100).max(230).optional(),
  occupation: z.string().trim().max(120).optional(),
  singleDuration: z.string().trim().max(120).optional(),
  hobbies: z.string().trim().max(2000).optional(),
  personality: z.string().trim().max(2000).optional(),
  searchAgeRange: z.string().trim().max(40).optional(),
  searchMaritalStatus: z.array(z.string()).optional(),
  searchMaxChildren: z.coerce.number().int().min(0).optional(),
  searchHeightRange: z.string().trim().max(40).optional(),
  searchTribe: z.string().trim().max(120).optional(),
  searchReligion: z.string().trim().max(120).optional(),
  searchBodyType: z.array(z.enum(["mince", "moyenne", "athletique", "embonpoint"])).optional(),
  searchQualities: z.string().trim().max(2000).optional(),
  sensitiveDataConsent: z.literal(true, {
    message: "Le consentement pour vos données sensibles est requis",
  }),
});

export interface DossierFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  canBook?: boolean;
}

const MAX_PHOTO_SIZE = 1.5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadPhoto(
  supabase: ReturnType<typeof createServiceRoleClient>,
  file: File,
  label: string
): Promise<{ path?: string; error?: string }> {
  if (file.size > MAX_PHOTO_SIZE) {
    return { error: `La photo "${label}" est encore trop volumineuse après optimisation.` };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { error: `Formats acceptés pour la photo "${label}" : JPG, PNG, WebP.` };
  }

  const extension = file.type.split("/")[1];
  const path = `${crypto.randomUUID()}-${label}.${extension}`;

  const { error } = await supabase.storage
    .from(CANDIDATE_PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error("uploadPhoto failed", error);
    return { error: `L'envoi de la photo "${label}" a échoué.` };
  }

  try {
    const thumbnail = await createCandidateThumbnail(await file.arrayBuffer());
    const { error: thumbnailError } = await supabase.storage
      .from(CANDIDATE_PHOTO_BUCKET)
      .upload(candidateThumbnailPath(path), thumbnail, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: true,
      });
    if (thumbnailError) console.error("uploadPhoto: thumbnail upload failed", thumbnailError);
  } catch (thumbnailError) {
    console.error("uploadPhoto: thumbnail generation failed", thumbnailError);
  }

  return { path };
}

export async function submitDossierCandidature(
  _prevState: DossierFormState,
  formData: FormData
): Promise<DossierFormState> {
  const parsed = dossierSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    gender: formData.get("gender"),
    birthDate: formData.get("birthDate") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone"),
    yearsInCountry: formData.get("yearsInCountry") || undefined,
    maritalStatus: formData.get("maritalStatus") || undefined,
    childrenCount: formData.get("childrenCount") || undefined,
    tribe: formData.get("tribe") || undefined,
    religion: formData.get("religion") || undefined,
    heightCm: formData.get("heightCm") || undefined,
    occupation: formData.get("occupation") || undefined,
    singleDuration: formData.get("singleDuration") || undefined,
    hobbies: formData.get("hobbies") || undefined,
    personality: formData.get("personality") || undefined,
    searchAgeRange: formData.get("searchAgeRange") || undefined,
    searchMaritalStatus: formData.getAll("searchMaritalStatus"),
    searchMaxChildren: formData.get("searchMaxChildren") || undefined,
    searchHeightRange: formData.get("searchHeightRange") || undefined,
    searchTribe: formData.get("searchTribe") || undefined,
    searchReligion: formData.get("searchReligion") || undefined,
    searchBodyType: formData.getAll("searchBodyType"),
    searchQualities: formData.get("searchQualities") || undefined,
    sensitiveDataConsent: formData.get("sensitiveDataConsent") === "on" ? true : undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Merci de corriger les champs indiqués." };
  }

  const supabase = createServiceRoleClient();

  const photoPortrait = formData.get("photoPortrait");
  const photoFull = formData.get("photoFull");
  const fieldErrors: Record<string, string> = {};

  if (!(photoPortrait instanceof File) || photoPortrait.size === 0) {
    fieldErrors.photoPortrait = "La photo portrait est requise.";
  }
  if (!(photoFull instanceof File) || photoFull.size === 0) {
    fieldErrors.photoFull = "La photo entière est requise.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, message: "Merci d'ajouter vos deux photos." };
  }

  const photoPaths: string[] = [];

  if (photoPortrait instanceof File) {
    const { path, error } = await uploadPhoto(supabase, photoPortrait, "portrait");
    if (error) return { status: "error", message: error };
    if (path) photoPaths.push(path);
  }
  if (photoFull instanceof File) {
    const { path, error } = await uploadPhoto(supabase, photoFull, "entiere");
    if (error) return { status: "error", message: error };
    if (path) photoPaths.push(path);
  }

  const record = {
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    gender: parsed.data.gender,
    birth_date: parsed.data.birthDate || null,
    country: parsed.data.country || null,
    city: parsed.data.city || null,
    email: parsed.data.email,
    phone: parsed.data.phone,
    years_in_country: parsed.data.yearsInCountry ?? null,
    marital_status: parsed.data.maritalStatus || null,
    children_count: parsed.data.childrenCount ?? null,
    tribe: parsed.data.tribe || null,
    religion: parsed.data.religion || null,
    sensitive_data_consent: true,
    height_cm: parsed.data.heightCm ?? null,
    occupation: parsed.data.occupation || null,
    single_duration: parsed.data.singleDuration || null,
    hobbies: parsed.data.hobbies || null,
    personality: parsed.data.personality || null,
    search_age_range: parsed.data.searchAgeRange || null,
    search_marital_status: parsed.data.searchMaritalStatus?.length
      ? parsed.data.searchMaritalStatus
      : null,
    search_max_children: parsed.data.searchMaxChildren ?? null,
    search_height_range: parsed.data.searchHeightRange || null,
    search_tribe: parsed.data.searchTribe || null,
    search_religion: parsed.data.searchReligion || null,
    search_body_type: parsed.data.searchBodyType?.length ? parsed.data.searchBodyType : null,
    search_qualities: parsed.data.searchQualities || null,
  };

  const { data: existing } = await supabase
    .from("candidates")
    .select("id, photo_urls, status, is_paid")
    .ilike("email", parsed.data.email)
    .maybeSingle();

  const mergedPhotoPaths = [...(existing?.photo_urls ?? []), ...photoPaths];

  if (existing) {
    const { error } = await supabase
      .from("candidates")
      .update({
        ...record,
        photo_urls: mergedPhotoPaths,
        status: existing.status === "nouvelle_candidature" ? "en_qualification" : existing.status,
      })
      .eq("id", existing.id);

    if (error) {
      console.error("submitDossierCandidature: update failed", error);
      return { status: "error", message: "Une erreur est survenue. Merci de réessayer." };
    }
  } else {
    const { error } = await supabase.from("candidates").insert({
      ...record,
      photo_urls: photoPaths,
      status: "en_qualification",
    });

    if (error) {
      console.error("submitDossierCandidature: insert failed", error);
      return { status: "error", message: "Une erreur est survenue. Merci de réessayer." };
    }
  }

  await sendDossierConfirmationEmail(parsed.data.email, parsed.data.firstName);

  return {
    status: "success",
    canBook: existing?.is_paid === true,
    message: existing?.is_paid
      ? "Votre dossier a bien été reçu. La prise de rendez-vous est maintenant obligatoire pour finaliser votre candidature."
      : "Votre dossier a bien été reçu. Charlène l'examine et revient vers vous rapidement.",
  };
}
