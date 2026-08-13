"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { candidateStatuses } from "@/lib/candidate-status";
import {
  CANDIDATE_PHOTO_BUCKET,
  candidateThumbnailPath,
  createCandidateThumbnail,
} from "@/lib/candidate-photo";

const updateSchema = z.object({
  candidateId: z.string().uuid(),
  status: z.enum(candidateStatuses),
  adminNotes: z.string().trim().max(4000).optional(),
  isPubliclyListed: z.coerce.boolean(),
  city: z.string().trim().max(120).optional(),
  occupation: z.string().trim().max(120).optional(),
  birthDate: z.string().trim().optional(),
  isPaid: z.coerce.boolean(),
});

const editableCandidateFields = [
  "first_name", "last_name", "email", "phone", "gender", "birth_date", "country", "city",
  "years_in_country", "marital_status", "children_count", "tribe", "religion",
  "sensitive_data_consent", "height_cm", "occupation", "single_duration", "hobbies",
  "personality", "search_age_range", "search_marital_status", "search_max_children",
  "search_height_range", "search_tribe", "search_religion", "search_body_type",
  "search_qualities", "offer_tier", "is_publicly_listed", "is_paid", "motivation", "admin_notes",
  "airtable_age", "eligibility_score", "meeting_notes", "key_decisions", "status", "application_date",
] as const;

const requiredTextFields = new Set(["first_name", "last_name", "phone"]);
const numberFields = new Set([
  "years_in_country", "children_count", "height_cm", "search_max_children", "airtable_age", "eligibility_score",
]);
const booleanFields = new Set(["sensitive_data_consent", "is_publicly_listed", "is_paid"]);
const arrayFields = new Set(["search_marital_status", "search_body_type"]);
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const inlineUpdateSchema = z.object({
  candidateId: z.string().uuid(),
  field: z.enum(editableCandidateFields),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()]),
});

const createInlineSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  gender: z.enum(["homme", "femme"]),
  email: z.string().trim().max(254),
  phone: z.string().trim().max(40),
});

export interface CandidateMutationResult {
  ok: boolean;
  message: string;
  candidateId?: string;
}

function normalizeInlineValue(field: (typeof editableCandidateFields)[number], rawValue: unknown) {
  if (booleanFields.has(field)) return rawValue === true || rawValue === "true";
  if (numberFields.has(field)) {
    if (rawValue === "" || rawValue === null) return null;
    const number = Number(rawValue);
    if (!Number.isFinite(number)) throw new Error("Nombre invalide.");
    return number;
  }
  if (arrayFields.has(field)) {
    const values = Array.isArray(rawValue)
      ? rawValue.map(String).map((item) => item.trim()).filter(Boolean)
      : String(rawValue ?? "").split(",").map((item) => item.trim()).filter(Boolean);
    if (field === "search_marital_status" && values.some((value) => !["celibataire", "divorce", "veuf"].includes(value))) {
      throw new Error("Situation recherchée invalide.");
    }
    if (field === "search_body_type" && values.some((value) => !["mince", "moyenne", "athletique", "embonpoint"].includes(value))) {
      throw new Error("Carrure invalide.");
    }
    return values;
  }
  const value = String(rawValue ?? "").trim();
  if (requiredTextFields.has(field) && !value) throw new Error("Ce champ est obligatoire.");
  if (field === "email" && value && !z.string().email().safeParse(value).success) {
    throw new Error("Adresse e-mail invalide.");
  }
  if (field === "gender" && !["homme", "femme"].includes(value)) throw new Error("Genre invalide.");
  if (field === "marital_status" && value && !["celibataire", "divorce", "veuf"].includes(value)) throw new Error("Situation invalide.");
  if (field === "offer_tier" && value && !["reseau", "signature", "hunter"].includes(value)) throw new Error("Offre invalide.");
  if (field === "status" && !candidateStatuses.includes(value as (typeof candidateStatuses)[number])) throw new Error("Statut invalide.");
  return value || null;
}

export async function updateCandidateCell(input: {
  candidateId: string;
  field: (typeof editableCandidateFields)[number];
  value: string | number | boolean | string[] | null;
}): Promise<CandidateMutationResult> {
  const parsed = inlineUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Modification invalide." };

  let value: unknown;
  try {
    value = normalizeInlineValue(parsed.data.field, parsed.data.value);
    if (parsed.data.field === "email" && value === null) {
      value = `candidat-${parsed.data.candidateId}@lomdie-sans-email.invalid`;
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Valeur invalide." };
  }

  const supabase = await createAuthedServerClient();
  const { data, error } = await supabase
    .from("candidates")
    .update({ [parsed.data.field]: value })
    .eq("id", parsed.data.candidateId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("updateCandidateCell: update failed", error);
    return { ok: false, message: "La modification a échoué." };
  }

  revalidatePath(`/admin/candidatures/${parsed.data.candidateId}`);
  revalidatePath("/admin/candidatures");
  updateTag("public-profiles");
  return { ok: true, message: "Enregistré." };
}

export async function createCandidateInline(input: {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
}): Promise<CandidateMutationResult> {
  const parsed = createInlineSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Prénom, nom et genre sont obligatoires." };

  const technicalId = crypto.randomUUID();
  const email = parsed.data.email || `candidat-${technicalId}@lomdie-sans-email.invalid`;
  if (parsed.data.email && !z.string().email().safeParse(parsed.data.email).success) {
    return { ok: false, message: "Adresse e-mail invalide." };
  }

  const supabase = await createAuthedServerClient();
  const { data, error } = await supabase
    .from("candidates")
    .insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      gender: parsed.data.gender,
      email,
      phone: parsed.data.phone,
      status: "en_qualification",
    })
    .select("id")
    .single();

  if (error) {
    console.error("createCandidateInline: insert failed", error);
    return { ok: false, message: "La création a échoué." };
  }

  revalidatePath("/admin/candidatures");
  return { ok: true, message: "Candidature créée.", candidateId: data.id };
}

export async function deleteCandidateInline(candidateId: string): Promise<CandidateMutationResult> {
  const parsedId = z.string().uuid().safeParse(candidateId);
  if (!parsedId.success) return { ok: false, message: "Candidature invalide." };

  const supabase = await createAuthedServerClient();
  const { data: candidate, error: readError } = await supabase
    .from("candidates")
    .select("photo_urls")
    .eq("id", parsedId.data)
    .maybeSingle();
  if (readError || !candidate) return { ok: false, message: "Candidature introuvable." };

  const { error } = await supabase.from("candidates").delete().eq("id", parsedId.data);
  if (error) {
    console.error("deleteCandidateInline: delete failed", error);
    return { ok: false, message: "La suppression a échoué." };
  }

  if (candidate.photo_urls?.length) {
    const storedPaths = candidate.photo_urls.flatMap((path: string) => [path, candidateThumbnailPath(path)]);
    const { error: storageError } = await supabase.storage
      .from(CANDIDATE_PHOTO_BUCKET)
      .remove(storedPaths);
    if (storageError) console.error("deleteCandidateInline: photo cleanup failed", storageError);
  }

  revalidatePath("/admin/candidatures");
  updateTag("public-profiles");
  return { ok: true, message: "Candidature supprimée." };
}

export async function addCandidatePhoto(formData: FormData): Promise<CandidateMutationResult> {
  const parsedId = z.string().uuid().safeParse(formData.get("candidateId"));
  const photo = formData.get("photo");
  if (!parsedId.success || !(photo instanceof File) || photo.size === 0) {
    return { ok: false, message: "Photo invalide." };
  }
  if (photo.size > MAX_PHOTO_SIZE) return { ok: false, message: "La photo ne doit pas dépasser 8 Mo." };
  if (!ALLOWED_PHOTO_TYPES.has(photo.type)) return { ok: false, message: "Formats acceptés : JPG, PNG ou WebP." };

  const supabase = await createAuthedServerClient();
  const { data: candidate, error: readError } = await supabase
    .from("candidates").select("photo_urls").eq("id", parsedId.data).maybeSingle();
  if (readError || !candidate) return { ok: false, message: "Candidature introuvable." };

  const extension = photo.type === "image/jpeg" ? "jpg" : photo.type.split("/")[1];
  const path = `${parsedId.data}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(CANDIDATE_PHOTO_BUCKET).upload(path, photo, { contentType: photo.type });
  if (uploadError) return { ok: false, message: "L’envoi de la photo a échoué." };

  try {
    const thumbnail = await createCandidateThumbnail(await photo.arrayBuffer());
    const { error: thumbnailError } = await supabase.storage
      .from(CANDIDATE_PHOTO_BUCKET)
      .upload(candidateThumbnailPath(path), thumbnail, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: true,
      });
    if (thumbnailError) console.error("addCandidatePhoto: thumbnail upload failed", thumbnailError);
  } catch (thumbnailError) {
    console.error("addCandidatePhoto: thumbnail generation failed", thumbnailError);
  }

  const { error } = await supabase.from("candidates")
    .update({ photo_urls: [...(candidate.photo_urls ?? []), path] }).eq("id", parsedId.data);
  if (error) {
    await supabase.storage.from(CANDIDATE_PHOTO_BUCKET).remove([path, candidateThumbnailPath(path)]);
    return { ok: false, message: "La photo n’a pas pu être enregistrée." };
  }
  revalidatePath(`/admin/candidatures/${parsedId.data}`);
  revalidatePath("/admin/candidatures");
  return { ok: true, message: "Photo ajoutée." };
}

export async function removeCandidatePhoto(input: { candidateId: string; path: string }): Promise<CandidateMutationResult> {
  const parsed = z.object({ candidateId: z.string().uuid(), path: z.string().min(1).max(500) }).safeParse(input);
  if (!parsed.success) return { ok: false, message: "Photo invalide." };
  const supabase = await createAuthedServerClient();
  const { data: candidate, error: readError } = await supabase
    .from("candidates").select("photo_urls").eq("id", parsed.data.candidateId).maybeSingle();
  if (readError || !candidate || !(candidate.photo_urls ?? []).includes(parsed.data.path)) {
    return { ok: false, message: "Photo introuvable." };
  }
  const nextPaths = (candidate.photo_urls ?? []).filter((path: string) => path !== parsed.data.path);
  const { error } = await supabase.from("candidates").update({ photo_urls: nextPaths }).eq("id", parsed.data.candidateId);
  if (error) return { ok: false, message: "La suppression a échoué." };
  const { error: storageError } = await supabase.storage
    .from(CANDIDATE_PHOTO_BUCKET)
    .remove([parsed.data.path, candidateThumbnailPath(parsed.data.path)]);
  if (storageError) console.error("removeCandidatePhoto: storage cleanup failed", storageError);
  revalidatePath(`/admin/candidatures/${parsed.data.candidateId}`);
  revalidatePath("/admin/candidatures");
  return { ok: true, message: "Photo supprimée." };
}

export interface UpdateCandidateState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function updateCandidate(
  _prevState: UpdateCandidateState,
  formData: FormData
): Promise<UpdateCandidateState> {
  const parsed = updateSchema.safeParse({
    candidateId: formData.get("candidateId"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes"),
    isPubliclyListed: formData.get("isPubliclyListed") === "on",
    city: formData.get("city"),
    occupation: formData.get("occupation"),
    birthDate: formData.get("birthDate"),
    isPaid: formData.get("isPaid") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: "Champs invalides." };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase
    .from("candidates")
    .update({
      status: parsed.data.status,
      admin_notes: parsed.data.adminNotes || null,
      is_publicly_listed: parsed.data.isPubliclyListed,
      city: parsed.data.city || null,
      occupation: parsed.data.occupation || null,
      birth_date: parsed.data.birthDate || null,
      is_paid: parsed.data.isPaid,
    })
    .eq("id", parsed.data.candidateId);

  if (error) {
    console.error("updateCandidate: update failed", error);
    return { status: "error", message: "La mise à jour a échoué." };
  }

  revalidatePath(`/admin/candidatures/${parsed.data.candidateId}`);
  revalidatePath("/admin/candidatures");
  updateTag("public-profiles");

  return { status: "success", message: "Modifications enregistrées." };
}
