import type { Metadata } from "next";
import Link from "next/link";
import { Users, CalendarClock } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAuthedServerClient } from "@/lib/supabase/server";
import type { CandidateStatus } from "@/lib/candidate-status";
import { HelpTooltip } from "@/components/admin/help-tooltip";
import { CandidaturesFilters } from "@/components/admin/candidatures-filters";
import { AdminLinkCard } from "@/components/admin/admin-link-card";
import { CandidateInlineRow, CreateCandidateInlineRow } from "@/components/admin/candidate-inline-row";
import type { CandidateMatchStatus } from "@/lib/candidate-match-status";

export const metadata: Metadata = { title: "Candidatures" };

interface CandidateRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  city: string | null;
  occupation: string | null;
  birth_date: string | null;
  photo_urls: string[] | null;
  country: string | null;
  years_in_country: number | null;
  marital_status: string | null;
  children_count: number | null;
  tribe: string | null;
  religion: string | null;
  sensitive_data_consent: boolean;
  height_cm: number | null;
  single_duration: string | null;
  hobbies: string | null;
  personality: string | null;
  search_age_range: string | null;
  search_marital_status: string[] | null;
  search_max_children: number | null;
  search_height_range: string | null;
  search_tribe: string | null;
  search_religion: string | null;
  search_body_type: string[] | null;
  search_qualities: string | null;
  offer_tier: string | null;
  is_publicly_listed: boolean;
  is_paid: boolean;
  motivation: string | null;
  admin_notes: string | null;
  application_date: string;
  eligibility_score: number | null;
  meeting_notes: string | null;
  key_decisions: string | null;
  resolvedPhotoUrls: string[];
  status: CandidateStatus;
  created_at: string;
}

interface SearchParams {
  page?: string;
  sort?: string;
  q?: string;
  status?: string;
  gender?: string;
  visible?: string;
  city?: string;
  country?: string;
  occupation?: string;
  marital?: string;
  tribe?: string;
  religion?: string;
  minAge?: string;
  maxAge?: string;
  minHeight?: string;
  maxHeight?: string;
  maxChildren?: string;
  photos?: string;
  offer?: string;
}

const PAGE_SIZE = 10;
function yearsAgo(years: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().slice(0, 10);
}

async function getCandidates(filters: SearchParams, page: number) {
  const supabase = await createAuthedServerClient();
  let query = supabase
    .from("candidates")
    .select(
      "id, first_name, last_name, email, phone, gender, birth_date, country, city, years_in_country, marital_status, children_count, tribe, religion, sensitive_data_consent, height_cm, occupation, single_duration, hobbies, personality, photo_urls, search_age_range, search_marital_status, search_max_children, search_height_range, search_tribe, search_religion, search_body_type, search_qualities, status, offer_tier, is_publicly_listed, is_paid, motivation, admin_notes, created_at, application_date, eligibility_score, meeting_notes, key_decisions",
      { count: "exact" }
    )
    .neq("status", "nouvelle_candidature")
    .order("application_date", { ascending: filters.sort === "date_asc" })
    .order("id", { ascending: true });

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
  if (filters.city) query = query.ilike("city", `%${filters.city.trim()}%`);
  if (filters.country) query = query.ilike("country", `%${filters.country.trim()}%`);
  if (filters.occupation) query = query.ilike("occupation", `%${filters.occupation.trim()}%`);
  if (filters.marital) query = query.eq("marital_status", filters.marital);
  if (filters.tribe) {
    query = query.or(
      `tribe.ilike.%${filters.tribe.trim()}%,search_tribe.ilike.%${filters.tribe.trim()}%`
    );
  }
  if (filters.religion) {
    query = query.or(
      `religion.ilike.%${filters.religion.trim()}%,search_religion.ilike.%${filters.religion.trim()}%`
    );
  }
  if (filters.minAge && Number.isFinite(Number(filters.minAge))) {
    query = query.lte("birth_date", yearsAgo(Number(filters.minAge)));
  }
  if (filters.maxAge && Number.isFinite(Number(filters.maxAge))) {
    query = query.gte("birth_date", yearsAgo(Number(filters.maxAge) + 1));
  }
  if (filters.minHeight && Number.isFinite(Number(filters.minHeight))) {
    query = query.gte("height_cm", Number(filters.minHeight));
  }
  if (filters.maxHeight && Number.isFinite(Number(filters.maxHeight))) {
    query = query.lte("height_cm", Number(filters.maxHeight));
  }
  if (filters.maxChildren && Number.isFinite(Number(filters.maxChildren))) {
    query = query.lte("children_count", Number(filters.maxChildren));
  }
  if (filters.photos === "yes") query = query.not("photo_urls", "eq", "{}");
  if (filters.photos === "no") query = query.eq("photo_urls", "{}");
  if (filters.offer) query = query.eq("offer_tier", filters.offer);
  if (filters.q) {
    const term = filters.q.trim();
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    );
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, count } = await query.range(from, from + PAGE_SIZE - 1);
  const candidates = data ?? [];
  const paths = candidates.flatMap((candidate) => candidate.photo_urls ?? []);
  const urlByPath = new Map<string, string>();

  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("candidate-photos")
      .createSignedUrls(paths, 60 * 30);
    paths.forEach((path, index) => {
      const signedUrl = signed?.[index]?.signedUrl;
      if (signedUrl) urlByPath.set(path, signedUrl);
    });
  }

  const rows = candidates.map((candidate) => ({
      ...candidate,
      resolvedPhotoUrls: (candidate.photo_urls ?? [])
        .map((path: string) => urlByPath.get(path))
        .filter((url: string | undefined): url is string => Boolean(url)),
    })) as CandidateRow[];
  const ids = rows.map((candidate) => candidate.id);
  const [matchesResult, optionsResult] = await Promise.all([
    ids.length > 0
      ? supabase.from("candidate_matches")
          .select("id, candidate_a_id, candidate_b_id, status")
          .or(`candidate_a_id.in.(${ids.join(",")}),candidate_b_id.in.(${ids.join(",")})`)
      : Promise.resolve({ data: [], error: null }),
    supabase.from("candidates").select("id, first_name, last_name").neq("status", "nouvelle_candidature").order("first_name"),
  ]);

  if (matchesResult.error) console.error("getCandidates: relations failed", matchesResult.error);

  return {
    candidates: rows,
    matches: (matchesResult.data ?? []) as { id: string; candidate_a_id: string; candidate_b_id: string; status: CandidateMatchStatus }[],
    candidateOptions: (optionsResult.data ?? []).map((candidate) => ({
      id: candidate.id,
      name: `${candidate.first_name} ${candidate.last_name}`.trim(),
    })),
    total: count ?? 0,
  };
}

export default async function AdminCandidaturesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const requestedPage = Number.parseInt(filters.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { candidates, matches, candidateOptions, total } = await getCandidates(filters, page);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters = Boolean(
    Object.values(filters).some(Boolean)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Candidatures
          <HelpTooltip text="Seules les personnes ayant envoyé leur dossier détaillé apparaissent ici. Les prospects du formulaire simple, avec ou sans appel découverte, restent dans la page Prospects. Après paiement, envoyez au candidat le lien unique ci-dessous : il complétera son dossier puis réservera son rendez-vous sur la même page." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} dossier{total > 1 ? "s" : ""} dans la base.
          Cliquez sur un nom pour consulter toutes les informations importées.
        </p>
      </div>

      <div className="grid gap-3">
        <AdminLinkCard
          icon={<CalendarClock className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />}
          label="Dossier détaillé et prise de rendez-vous (après paiement)"
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
          <Table topScrollbar>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Métier</TableHead>
                <TableHead>Situation</TableHead>
                <TableHead>Enfants</TableHead>
                <TableHead>Tribu</TableHead>
                <TableHead>Religion</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Célibataire depuis</TableHead>
                <TableHead>Ancienneté pays</TableHead>
                <TableHead>Centres d’intérêt</TableHead>
                <TableHead>Personnalité</TableHead>
                <TableHead>Âge recherché</TableHead>
                <TableHead>Situation recherchée</TableHead>
                <TableHead>Enfants max.</TableHead>
                <TableHead>Taille recherchée</TableHead>
                <TableHead>Tribu recherchée</TableHead>
                <TableHead>Religion recherchée</TableHead>
                <TableHead>Carrure recherchée</TableHead>
                <TableHead>Qualités recherchées</TableHead>
                <TableHead>Offre</TableHead>
                <TableHead>Payé</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead>Consentement sensible</TableHead>
                <TableHead>Motivation</TableHead>
                <TableHead>Notes admin</TableHead>
                <TableHead>Note éligibilité AI</TableHead>
                <TableHead>Meeting Notes</TableHead>
                <TableHead>Key Decisions</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mise en relation</TableHead>
                <TableHead>Date de candidature</TableHead>
                <TableHead className="sticky right-0 z-20 bg-card">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <CreateCandidateInlineRow columnCount={38} />
              {candidates.map((candidate) => (
                <CandidateInlineRow
                  key={candidate.id}
                  candidate={candidate}
                  matches={matches.filter((match) => match.candidate_a_id === candidate.id || match.candidate_b_id === candidate.id)}
                  candidateOptions={candidateOptions}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {total > PAGE_SIZE ? (
        <nav className="flex items-center justify-between gap-4" aria-label="Pagination des candidatures">
          <p className="text-sm text-muted-foreground">
            Page {Math.min(page, pageCount)} sur {pageCount}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={{ pathname: "/admin/candidatures", query: { ...filters, page: page - 1 } }}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                Précédente
              </Link>
            ) : null}
            {page < pageCount ? (
              <Link
                href={{ pathname: "/admin/candidatures", query: { ...filters, page: page + 1 } }}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                Suivante
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
