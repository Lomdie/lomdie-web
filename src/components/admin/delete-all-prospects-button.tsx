"use client";

import { useState, useTransition } from "react";
import { deleteAllProspects } from "@/lib/actions/admin-bookings";

export function DeleteAllProspectsButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        className="h-10 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50"
        onClick={() => {
          if (!window.confirm("Supprimer définitivement toutes les lignes de la page Prospects ?")) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteAllProspects();
            if (!result.ok) setError(result.message);
          });
        }}
      >
        {isPending ? "Suppression…" : "Tout supprimer"}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
