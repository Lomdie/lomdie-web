"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { candidateStatuses } from "@/lib/candidate-status";

const updateSchema = z.object({
  candidateId: z.string().uuid(),
  status: z.enum(candidateStatuses),
  adminNotes: z.string().trim().max(4000).optional(),
  isPubliclyListed: z.coerce.boolean(),
  city: z.string().trim().max(120).optional(),
  occupation: z.string().trim().max(120).optional(),
  birthDate: z.string().trim().optional(),
});

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
