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
  city: string | null;
  occupation: string | null;
  birth_date: string | null;
  photo_urls: string[] | null;
  status: CandidateStatus;
  created_at: string;
}

interface SearchParams {
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

function yearsAgo(years: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().slice(0, 10);
}

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return age;
}

async function getCandidates(filters: SearchParams): Promise<CandidateRow[]> {
  const supabase = await createAuthedServerClient();
  let query = supabase
    .from("candidates")
    .select(
      "id, first_name, last_name, email, phone, gender, city, occupation, birth_date, photo_urls, status, created_at"
    )
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
    Object.values(filters).some(Boolean)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Candidatures
          <HelpTooltip text="Chaque candidature reçue via le formulaire du site apparaît ici. Cliquez sur un nom pour voir le détail complet, changer son statut, ajouter des notes internes ou décider si son profil apparaît (anonymisé) sur la page « Les profils » du site public. Utilisez les filtres pour retrouver rapidement un profil. Deux liens à envoyer vous-même (ci-dessous, non accessibles depuis le site public) : le dossier détaillé une fois le candidat qualifié, et le lien de prise de rendez-vous une fois son paiement confirmé." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {candidates.length} dossier{candidates.length > 1 ? "s" : ""} dans la base.
          Cliquez sur un nom pour consulter toutes les informations importées.
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
                <TableHead className="hidden lg:table-cell">Profil</TableHead>
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
                  <TableCell className="hidden max-w-64 lg:table-cell">
                    <div className="truncate font-medium">
                      {[candidate.city, candidate.occupation].filter(Boolean).join(" · ") || "À compléter"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {candidate.birth_date
                        ? `${calculateAge(candidate.birth_date)} ans`
                        : "Âge non renseigné"}
                      {candidate.photo_urls?.length
                        ? ` · ${candidate.photo_urls.length} photo${candidate.photo_urls.length > 1 ? "s" : ""}`
                        : " · Sans photo"}
                    </div>
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
