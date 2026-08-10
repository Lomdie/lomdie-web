"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCandidateMatch, deleteCandidateMatch, updateCandidateMatch } from "@/lib/actions/candidate-matches";
import { candidateMatchStatuses, candidateMatchStatusLabels, type CandidateMatchStatus } from "@/lib/candidate-match-status";

export interface CandidateOption { id: string; name: string }
export interface CandidateMatchView {
  id: string;
  candidate_a_id: string;
  candidate_b_id: string;
  status: CandidateMatchStatus;
}

export function CandidateMatchCell({
  candidateId, matches, candidates,
}: {
  candidateId: string;
  matches: CandidateMatchView[];
  candidates: CandidateOption[];
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [otherCandidateId, setOtherCandidateId] = useState("");
  const [status, setStatus] = useState<CandidateMatchStatus>("en_discussion");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const nameById = new Map(candidates.map((candidate) => [candidate.id, candidate.name]));
  const relatedIds = new Set(matches.flatMap((match) => [match.candidate_a_id, match.candidate_b_id]));
  const availableCandidates = candidates.filter((candidate) => candidate.id !== candidateId && !relatedIds.has(candidate.id));

  function refresh(result: { ok: boolean; message: string }) {
    setMessage(result.message);
    if (result.ok) {
      setCreating(false);
      setOtherCandidateId("");
      router.refresh();
    }
  }

  return <div className="min-w-64 space-y-2 py-1">
    {matches.map((match) => {
      const otherId = match.candidate_a_id === candidateId ? match.candidate_b_id : match.candidate_a_id;
      return <div key={match.id} className="rounded-lg border border-border/70 bg-background p-2">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/admin/candidatures/${otherId}`} prefetch={false} className="truncate text-sm font-medium text-primary hover:underline">
            {nameById.get(otherId) ?? "Candidat introuvable"}
          </Link>
          <button type="button" disabled={pending} className="rounded p-1 text-destructive hover:bg-destructive/10" aria-label="Supprimer cette mise en relation" onClick={() => {
            if (!window.confirm("Supprimer cette mise en relation et son statut ?")) return;
            startTransition(async () => refresh(await deleteCandidateMatch(match.id)));
          }}><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
        <select
          value={match.status}
          disabled={pending}
          aria-label={`Statut avec ${nameById.get(otherId) ?? "ce candidat"}`}
          className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
          onChange={(event) => {
            const nextStatus = event.target.value as CandidateMatchStatus;
            startTransition(async () => refresh(await updateCandidateMatch({ id: match.id, status: nextStatus })));
          }}
        >
          {candidateMatchStatuses.map((value) => <option key={value} value={value}>{candidateMatchStatusLabels[value]}</option>)}
        </select>
      </div>;
    })}

    {creating ? <div className="rounded-lg border border-primary/30 bg-background p-2">
      <select value={otherCandidateId} onChange={(event) => setOtherCandidateId(event.target.value)} className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs" aria-label="Autre candidat">
        <option value="">Choisir une personne…</option>
        {availableCandidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
      </select>
      <select value={status} onChange={(event) => setStatus(event.target.value as CandidateMatchStatus)} className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs" aria-label="Statut initial">
        {candidateMatchStatuses.map((value) => <option key={value} value={value}>{candidateMatchStatusLabels[value]}</option>)}
      </select>
      <div className="mt-2 flex justify-end gap-1">
        <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}><X className="h-3.5 w-3.5" /> Annuler</Button>
        <Button type="button" size="sm" disabled={!otherCandidateId || pending} onClick={() => startTransition(async () => refresh(await createCandidateMatch({ candidateId, otherCandidateId, status })))}>Associer</Button>
      </div>
    </div> : <Button type="button" variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => setCreating(true)}><Plus className="h-3.5 w-3.5" /> Nouvelle mise en relation</Button>}
    {message && <p className="text-xs text-muted-foreground">{message}</p>}
  </div>;
}
