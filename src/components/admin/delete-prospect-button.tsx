"use client";

import { deleteProspect } from "@/lib/actions/admin-bookings";

export function DeleteProspectButton({ id }: { id: string }) {
  return (
    <form action={deleteProspect}>
      <input type="hidden" name="id" value={id} />
      <button
        className="rounded-lg border border-destructive/30 px-3 py-2 text-destructive hover:bg-destructive/5"
        onClick={(event) => {
          if (!window.confirm("Supprimer définitivement ce prospect sans rendez-vous ?")) {
            event.preventDefault();
          }
        }}
      >
        Supprimer
      </button>
    </form>
  );
}
