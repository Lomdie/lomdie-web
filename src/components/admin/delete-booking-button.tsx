"use client";

import { deleteBooking } from "@/lib/actions/admin-bookings";

export function DeleteBookingButton({ id }: { id: string }) {
  return (
    <form action={deleteBooking}>
      <input type="hidden" name="id" value={id} />
      <button
        className="rounded-lg border border-destructive/30 px-3 py-2 text-destructive hover:bg-destructive/5"
        onClick={(event) => {
          if (!window.confirm("Supprimer définitivement ce rendez-vous annulé ?")) event.preventDefault();
        }}
      >
        Supprimer
      </button>
    </form>
  );
}
