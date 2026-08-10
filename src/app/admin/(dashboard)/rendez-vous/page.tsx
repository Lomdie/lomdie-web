import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ExternalLink, Search } from "lucide-react";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "@/lib/actions/admin-bookings";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Prospects" };

type SearchParams = { q?: string; status?: string; period?: string; type?: string };

type Prospect = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone: string;
  motivation: string | null;
  application_date: string;
};

type Booking = {
  id: string;
  candidate_id: string | null;
  scheduled_at: string;
  end_at: string | null;
  meeting_link: string | null;
  status: string;
  booking_type: string;
  title: string | null;
  attendee_name: string | null;
  attendee_email: string | null;
  attendee_phone: string | null;
  reschedule_link: string | null;
  cancellation_link: string | null;
  notes: string | null;
};

type AdminBookingRow = Booking & {
  prospect: Prospect | null;
  isProspectOnly: boolean;
  referenceDate: string;
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

const typeLabels: Record<string, string> = {
  discovery: "Appel découverte",
  post_payment: "Après paiement",
};

async function getRows(filters: SearchParams) {
  const supabase = await createAuthedServerClient();
  const [bookingsResult, prospectsResult] = await Promise.all([
    supabase
      .from("calendly_bookings")
      .select("id, candidate_id, scheduled_at, end_at, meeting_link, status, booking_type, title, attendee_name, attendee_email, attendee_phone, reschedule_link, cancellation_link, notes")
      .order("scheduled_at", { ascending: false })
      .limit(250),
    supabase
      .from("candidates")
      .select("id, first_name, last_name, gender, email, phone, motivation, application_date")
      .eq("status", "nouvelle_candidature")
      .order("application_date", { ascending: false })
      .limit(250),
  ]);

  const prospects = (prospectsResult.data ?? []) as Prospect[];
  const prospectsById = new Map(prospects.map((prospect) => [prospect.id, prospect]));
  const prospectsByEmail = new Map(prospects.map((prospect) => [prospect.email.toLowerCase(), prospect]));
  const bookedProspectIds = new Set<string>();

  const rows: AdminBookingRow[] = ((bookingsResult.data ?? []) as Booking[]).map((booking) => {
    const prospect = (booking.candidate_id ? prospectsById.get(booking.candidate_id) : undefined)
      ?? (booking.attendee_email ? prospectsByEmail.get(booking.attendee_email.toLowerCase()) : undefined)
      ?? null;
    if (prospect) bookedProspectIds.add(prospect.id);
    return { ...booking, prospect, isProspectOnly: false, referenceDate: booking.scheduled_at };
  });

  for (const prospect of prospects) {
    if (bookedProspectIds.has(prospect.id)) continue;
    rows.push({
      id: `prospect-${prospect.id}`,
      candidate_id: prospect.id,
      scheduled_at: prospect.application_date,
      end_at: null,
      meeting_link: null,
      status: "not_booked",
      booking_type: "discovery",
      title: null,
      attendee_name: `${prospect.first_name} ${prospect.last_name}`.trim(),
      attendee_email: prospect.email,
      attendee_phone: prospect.phone,
      reschedule_link: null,
      cancellation_link: null,
      notes: prospect.motivation,
      prospect,
      isProspectOnly: true,
      referenceDate: prospect.application_date,
    });
  }

  const now = Date.now();
  const term = filters.q?.trim().toLocaleLowerCase("fr-FR");
  const filteredRows = rows.filter((row) => {
    if (filters.status && row.status !== filters.status) return false;
    if (filters.type && row.booking_type !== filters.type) return false;
    if (filters.period) {
      if (row.isProspectOnly) return false;
      const scheduled = new Date(row.scheduled_at).getTime();
      if (filters.period === "upcoming" && scheduled < now) return false;
      if (filters.period === "past" && scheduled >= now) return false;
    }
    if (term) {
      const searchable = [row.attendee_name, row.attendee_email, row.attendee_phone, row.title, row.prospect?.gender, row.prospect?.motivation]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("fr-FR");
      if (!searchable.includes(term)) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.referenceDate).getTime() - new Date(a.referenceDate).getTime());

  return {
    rows: filteredRows,
    error: bookingsResult.error?.message ?? prospectsResult.error?.message ?? null,
  };
}

export default async function AdminRendezVousPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = await searchParams;
  const { rows, error } = await getRows(filters);
  const hasFilters = Boolean(filters.q || filters.status || filters.period || filters.type);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Prospects
          <HelpTooltip text="Tous les prospects du formulaire simple apparaissent ici, même sans réservation. Un appel réservé avec la même adresse e-mail est automatiquement rattaché au prospect. Les dossiers détaillés restent dans la page Candidatures." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {rows.length} ligne{rows.length > 1 ? "s" : ""} affichée{rows.length > 1 ? "s" : ""}.
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
          <option value="not_booked">Sans rendez-vous</option>
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
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm">Impossible de charger les prospects et rendez-vous.</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">{hasFilters ? "Aucun résultat ne correspond à ces filtres." : "Aucun prospect pour le moment."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left">
              <tr><th className="p-4">Date</th><th className="p-4">Type</th><th className="p-4">Prospect</th><th className="p-4">Genre</th><th className="p-4">Message / notes</th><th className="p-4">Statut</th><th className="p-4">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border/70 last:border-0">
                  <td className="whitespace-nowrap p-4">
                    <div className="font-medium">{new Date(row.referenceDate).toLocaleDateString("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" })}</div>
                    <div className="text-muted-foreground">{row.isProspectOnly ? "Prospect reçu" : `${new Date(row.scheduled_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}${row.end_at ? ` – ${new Date(row.end_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}` : ""}`}</div>
                  </td>
                  <td className="whitespace-nowrap p-4 font-medium">{typeLabels[row.booking_type] ?? row.booking_type}</td>
                  <td className="p-4">
                    <div className="font-medium">{row.prospect ? `${row.prospect.first_name} ${row.prospect.last_name}` : row.attendee_name}</div>
                    <div className="text-muted-foreground">{row.prospect?.email ?? row.attendee_email}</div>
                    <div className="text-muted-foreground">{row.prospect?.phone ?? row.attendee_phone}</div>
                    {row.candidate_id && !row.prospect ? <Link href={`/admin/candidatures/${row.candidate_id}`} className="mt-1 inline-block text-primary hover:underline">Voir le dossier détaillé</Link> : null}
                  </td>
                  <td className="p-4 capitalize">{row.prospect?.gender || ""}</td>
                  <td className="max-w-80 p-4"><div>{row.title}</div>{(row.prospect?.motivation ?? row.notes) ? <div className="mt-1 whitespace-pre-wrap text-muted-foreground">{row.prospect?.motivation ?? row.notes}</div> : null}</td>
                  <td className="p-4">
                    {row.isProspectOnly ? (
                      <span className="inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">Pas encore réservé</span>
                    ) : (
                      <form action={updateBookingStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={row.id} />
                        <select name="status" defaultValue={row.status} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
                          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <button className="rounded-lg border border-border px-3 py-2 hover:bg-secondary">OK</button>
                      </form>
                    )}
                  </td>
                  <td className="p-4"><div className="flex flex-wrap gap-2">{row.meeting_link ? <a href={row.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 hover:bg-secondary">Rejoindre <ExternalLink className="h-3.5 w-3.5" /></a> : null}{row.reschedule_link ? <a href={row.reschedule_link} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-2 hover:bg-secondary">Reprogrammer</a> : null}{row.cancellation_link ? <a href={row.cancellation_link} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-2 hover:bg-secondary">Annuler</a> : null}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
