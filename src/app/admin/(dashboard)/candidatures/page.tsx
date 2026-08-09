import type { Metadata } from "next";
import Link from "next/link";
import { Users, FileText, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { candidateStatusLabels, type CandidateStatus } from "@/lib/candidate-status";
import { HelpTooltip } from "@/components/admin/help-tooltip";
import { CandidaturesFilters } from "@/components/admin/candidatures-filters";
import { AdminLinkCard } from "@/components/admin/admin-link-card";

export const metadata: Metadata = { title: "Candidatures" };

interface CandidateRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  status: CandidateStatus;
  created_at: string;
}

interface SearchParams {
  q?: string;
  status?: string;
  gender?: string;
  visible?: string;
}

async function getCandidates(filters: SearchParams): Promise<CandidateRow[]> {
  const supabase = await createAuthedServerClient();
  let query = supabase
    .from("candidates")
    .select("id, first_name, last_name, email, phone, gender, status, created_at")
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.gender) {
    query = query.eq("gender", filters.gender);
  }
  if (filters.visible === "yes") {
    query = query.eq("is_publicly_listed", true);
  } else if (filters.visible === "no") {
    query = query.eq("is_publicly_listed", false);
  }
  if (filters.q) {
    const term = filters.q.trim();
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`
    );
  }

  const { data } = await query;
  return data ?? [];
}

export default async function AdminCandidaturesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const candidates = await getCandidates(filters);
  const hasActiveFilters = Boolean(
    filters.q || filters.status || filters.gender || filters.visible
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Candidatures
          <HelpTooltip text="Chaque candidature reçue via le formulaire du site apparaît ici. Cliquez sur un nom pour voir le détail complet, changer son statut, ajouter des notes internes ou décider si son profil apparaît (anonymisé) sur la page « Les profils » du site public. Utilisez les filtres pour retrouver rapidement un profil. Deux liens à envoyer vous-même (ci-dessous, non accessibles depuis le site public) : le dossier détaillé une fois le candidat qualifié, et le lien de prise de rendez-vous une fois son paiement confirmé." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toutes les personnes qui ont postulé depuis le site. Cliquez sur une
          ligne pour voir le détail.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminLinkCard
          icon={<FileText className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />}
          label="Dossier de candidature détaillé (après qualification)"
          path="/dossier-candidature"
        />
        <AdminLinkCard
          icon={<CalendarClock className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />}
          label="Prise de rendez-vous (après paiement)"
          path="/prendre-rendez-vous"
        />
      </div>

      <CandidaturesFilters />

      {candidates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Aucune candidature ne correspond à ces filtres."
              : "Aucune candidature pour le moment. Elles apparaîtront ici dès qu'une personne remplit le formulaire du site."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden sm:table-cell">Genre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Reçue le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/admin/candidatures/${candidate.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {candidate.first_name} {candidate.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-35 text-muted-foreground sm:max-w-none">
                    <div className="truncate">{candidate.email}</div>
                    <div className="hidden sm:block">{candidate.phone}</div>
                  </TableCell>
                  <TableCell className="hidden capitalize text-muted-foreground sm:table-cell">
                    {candidate.gender}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {candidateStatusLabels[candidate.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {new Date(candidate.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
