"use client";

import { deleteBooking } from "@/lib/actions/admin-bookings";

export function DeleteBookingButton({ id, prospectId }: { id: string; prospectId?: string }) {
  return (
    <form action={deleteBooking}>
      <input type="hidden" name="id" value={id} />
      {prospectId ? <input type="hidden" name="prospectId" value={prospectId} /> : null}
      <button
        className="rounded-lg border border-destructive/30 px-3 py-2 text-destructive hover:bg-destructive/5"
        onClick={(event) => {
          if (!window.confirm("Supprimer définitivement cette ligne et les données de prospect associées ?")) {
            event.preventDefault();
          }
        }}
      >
        Supprimer
      </button>
    </form>
  );
}
