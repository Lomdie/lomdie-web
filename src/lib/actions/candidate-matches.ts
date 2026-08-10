"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { candidateMatchStatuses } from "@/lib/candidate-match-status";

export interface CandidateMatchResult { ok: boolean; message: string }

const createSchema = z.object({
  candidateId: z.string().uuid(),
  otherCandidateId: z.string().uuid(),
  status: z.enum(candidateMatchStatuses),
});

function refreshCandidates(a?: string, b?: string) {
  revalidatePath("/admin/candidatures");
  if (a) revalidatePath(`/admin/candidatures/${a}`);
  if (b) revalidatePath(`/admin/candidatures/${b}`);
}

export async function createCandidateMatch(input: z.input<typeof createSchema>): Promise<CandidateMatchResult> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success || parsed.data.candidateId === parsed.data.otherCandidateId) {
    return { ok: false, message: "Choisissez deux personnes différentes." };
  }
  const [candidateAId, candidateBId] = [parsed.data.candidateId, parsed.data.otherCandidateId].sort();
  const supabase = await createAuthedServerClient();
  const { error } = await supabase.from("candidate_matches").insert({
    candidate_a_id: candidateAId,
    candidate_b_id: candidateBId,
    status: parsed.data.status,
  });
  if (error?.code === "23505") return { ok: false, message: "Cette mise en relation existe déjà." };
  if (error) {
    console.error("createCandidateMatch failed", error);
    return { ok: false, message: "La mise en relation a échoué." };
  }
  refreshCandidates(candidateAId, candidateBId);
  return { ok: true, message: "Mise en relation créée." };
}

export async function updateCandidateMatch(input: { id: string; status: string }): Promise<CandidateMatchResult> {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(candidateMatchStatuses) }).safeParse(input);
  if (!parsed.success) return { ok: false, message: "Statut invalide." };
  const supabase = await createAuthedServerClient();
  const { data, error } = await supabase.from("candidate_matches")
    .update({ status: parsed.data.status }).eq("id", parsed.data.id)
    .select("candidate_a_id, candidate_b_id").maybeSingle();
  if (error || !data) return { ok: false, message: "La mise à jour a échoué." };
  refreshCandidates(data.candidate_a_id, data.candidate_b_id);
  return { ok: true, message: "Statut enregistré." };
}

export async function deleteCandidateMatch(id: string): Promise<CandidateMatchResult> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return { ok: false, message: "Mise en relation invalide." };
  const supabase = await createAuthedServerClient();
  const { data, error } = await supabase.from("candidate_matches").delete().eq("id", parsedId.data)
    .select("candidate_a_id, candidate_b_id").maybeSingle();
  if (error || !data) return { ok: false, message: "La suppression a échoué." };
  refreshCandidates(data.candidate_a_id, data.candidate_b_id);
  return { ok: true, message: "Mise en relation supprimée." };
}
