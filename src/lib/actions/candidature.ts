"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendCandidatureConfirmationEmail } from "@/lib/email";

const candidatureSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis"),
  lastName: z.string().trim().min(1, "Le nom est requis"),
  gender: z.enum(["homme", "femme"], { message: "Merci de préciser votre genre" }),
  email: z.string().trim().email("Adresse email invalide"),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide"),
  motivation: z.string().trim().max(2000).optional(),
});

export interface CandidatureFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof candidatureSchema>, string>>;
  prospect?: {
    name: string;
    email: string;
    notes?: string;
  };
}

export async function submitCandidature(
  _prevState: CandidatureFormState,
  formData: FormData
): Promise<CandidatureFormState> {
  const parsed = candidatureSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    gender: formData.get("gender"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    motivation: formData.get("motivation"),
  });

  if (!parsed.success) {
    const fieldErrors: CandidatureFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof candidatureSchema>;
      fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Merci de corriger les champs indiqués." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("candidates").insert({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    gender: parsed.data.gender,
    email: parsed.data.email,
    phone: parsed.data.phone,
    motivation: parsed.data.motivation || null,
  });

  if (error) {
    console.error("submitCandidature: insert failed", error);
    return {
      status: "error",
      message: "Une erreur est survenue. Merci de réessayer dans quelques instants.",
    };
  }

  revalidateTag("public-profiles", "minutes");

  await sendCandidatureConfirmationEmail(parsed.data.email, parsed.data.firstName);

  return {
    status: "success",
    message: "Vos informations ont bien été reçues. Choisissez maintenant votre créneau d’appel découverte.",
    prospect: {
      name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      email: parsed.data.email,
      notes: parsed.data.motivation,
    },
  };
}
