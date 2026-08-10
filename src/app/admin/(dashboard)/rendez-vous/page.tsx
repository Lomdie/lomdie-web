import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ExternalLink, Search } from "lucide-react";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "@/lib/actions/admin-bookings";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Rendez-vous" };

type SearchParams = { q?: string; status?: string; period?: string; type?: string };

const statusLabels: Record<string, string> = {
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

const typeLabels: Record<string, string> = {
  discovery: "Appel découverte",
  post_payment: "Après paiement",
};

async function getBookings(filters: SearchParams) {
  const supabase = await createAuthedServerClient();
  let query = supabase
    .from("calendly_bookings")
    .select("id, candidate_id, scheduled_at, end_at, meeting_link, status, booking_type, title, attendee_name, attendee_email, attendee_phone, reschedule_link, cancellation_link, notes")
    .order("scheduled_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("booking_type", filters.type);
  if (filters.period === "upcoming") query = query.gte("scheduled_at", new Date().toISOString());
  if (filters.period === "past") query = query.lt("scheduled_at", new Date().toISOString());
  if (filters.q?.trim()) {
    const term = filters.q.trim();
    query = query.or(`attendee_name.ilike.%${term}%,attendee_email.ilike.%${term}%,attendee_phone.ilike.%${term}%,title.ilike.%${term}%`);
  }

  const { data, error } = await query.limit(250);
  return { bookings: data ?? [], error: error?.message ?? null };
}

export default async function AdminRendezVousPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = await searchParams;
  const { bookings, error } = await getBookings(filters);
  const hasFilters = Boolean(filters.q || filters.status || filters.period || filters.type);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Rendez-vous
          <HelpTooltip text="Les appels découverte et les rendez-vous après paiement réservés sur Cal.com apparaissent automatiquement ici. Vous pouvez rechercher un contact, filtrer les rendez-vous et mettre à jour leur suivi interne." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookings.length} rendez-vous affiché{bookings.length > 1 ? "s" : ""}.
        </p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-[1fr_170px_170px_170px_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input name="q" defaultValue={filters.q} placeholder="Nom, e-mail ou téléphone…" className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-3 text-sm" />
        </label>
        <select name="type" defaultValue={filters.type ?? ""} className="h-10 rounded-lg border border-border bg-white px-3 text-sm">
          <option value="">Tous les types</option>
          <option value="discovery">Appel découverte</option>
          <option value="post_payment">Après paiement</option>
        </select>
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded-lg border border-border bg-white px-3 text-sm">
          <option value="">Tous les statuts</option>
          <option value="confirmed">Confirmés</option>
          <option value="completed">Terminés</option>
          <option value="cancelled">Annulés</option>
        </select>
        <select name="period" defaultValue={filters.period ?? ""} className="h-10 rounded-lg border border-border bg-white px-3 text-sm">
          <option value="">Toutes les dates</option>
          <option value="upcoming">À venir</option>
          <option value="past">Passés</option>
        </select>
        <button className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Filtrer</button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm">Impossible de charger les rendez-vous.</div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">{hasFilters ? "Aucun rendez-vous ne correspond à ces filtres." : "Aucun rendez-vous enregistré pour le moment."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left">
              <tr><th className="p-4">Date</th><th className="p-4">Type</th><th className="p-4">Contact</th><th className="p-4">Rendez-vous</th><th className="p-4">Statut</th><th className="p-4">Actions</th></tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border/70 last:border-0">
                  <td className="whitespace-nowrap p-4">
                    <div className="font-medium">{new Date(booking.scheduled_at).toLocaleDateString("fr-FR", { dateStyle: "medium" })}</div>
                    <div className="text-muted-foreground">{new Date(booking.scheduled_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}{booking.end_at ? ` – ${new Date(booking.end_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : ""}</div>
                  </td>
                  <td className="whitespace-nowrap p-4 font-medium">{typeLabels[booking.booking_type] ?? booking.booking_type}</td>
                  <td className="p-4"><div className="font-medium">{booking.attendee_name}</div><div className="text-muted-foreground">{booking.attendee_email}</div><div className="text-muted-foreground">{booking.attendee_phone}</div>{booking.candidate_id ? <Link href={`/admin/candidatures/${booking.candidate_id}`} className="mt-1 inline-block text-primary hover:underline">Voir la candidature</Link> : null}</td>
                  <td className="max-w-72 p-4"><div>{booking.title}</div>{booking.notes ? <div className="mt-1 line-clamp-2 text-muted-foreground">{booking.notes}</div> : null}</td>
                  <td className="p-4">
                    <form action={updateBookingStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={booking.id} />
                      <select name="status" defaultValue={booking.status} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
                        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                      <button className="rounded-lg border border-border px-3 py-2 hover:bg-secondary">OK</button>
                    </form>
                  </td>
                  <td className="p-4"><div className="flex flex-wrap gap-2">{booking.meeting_link ? <a href={booking.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 hover:bg-secondary">Rejoindre <ExternalLink className="h-3.5 w-3.5" /></a> : null}{booking.reschedule_link ? <a href={booking.reschedule_link} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-2 hover:bg-secondary">Reprogrammer</a> : null}{booking.cancellation_link ? <a href={booking.cancellation_link} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-2 hover:bg-secondary">Annuler</a> : null}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
