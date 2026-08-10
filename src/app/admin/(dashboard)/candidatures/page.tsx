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
import { CandidatePhotoPreview } from "@/components/admin/candidate-photo-preview";

export const metadata: Metadata = { title: "Candidatures" };

const maritalStatusLabels: Record<string, string> = {
  celibataire: "Célibataire",
  divorce: "Divorcé(e)",
  veuf: "Veuf/veuve",
};

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
  search_body_type: string | null;
  search_qualities: string | null;
  offer_tier: string | null;
  is_publicly_listed: boolean;
  motivation: string | null;
  admin_notes: string | null;
  resolvedPhotoUrls: string[];
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
      "id, first_name, last_name, email, phone, gender, birth_date, country, city, years_in_country, marital_status, children_count, tribe, religion, sensitive_data_consent, height_cm, occupation, single_duration, hobbies, personality, photo_urls, search_age_range, search_marital_status, search_max_children, search_height_range, search_tribe, search_religion, search_body_type, search_qualities, status, offer_tier, is_publicly_listed, motivation, admin_notes, created_at"
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

  return candidates.map((candidate) => ({
    ...candidate,
    resolvedPhotoUrls: (candidate.photo_urls ?? [])
      .map((path: string) => urlByPath.get(path))
      .filter((url: string | undefined): url is string => Boolean(url)),
  }));
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
                <TableHead>Visible</TableHead>
                <TableHead>Consentement sensible</TableHead>
                <TableHead>Motivation</TableHead>
                <TableHead>Notes admin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Reçue le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id} className="cursor-pointer">
                  <TableCell className="sticky left-0 z-10 bg-card">
                    <Link
                      href={`/admin/candidatures/${candidate.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {candidate.first_name} {candidate.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <CandidatePhotoPreview
                      urls={candidate.resolvedPhotoUrls}
                      candidateName={`${candidate.first_name} ${candidate.last_name}`}
                    />
                  </TableCell>
                  <TableCell className="max-w-35 text-muted-foreground sm:max-w-none">
                    <div className="truncate">{candidate.email}</div>
                    <div className="hidden sm:block">{candidate.phone}</div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {candidate.gender}
                  </TableCell>
                  <TableCell>{candidate.birth_date ? calculateAge(candidate.birth_date) : "—"}</TableCell>
                  <TableCell>{candidate.city || "—"}</TableCell>
                  <TableCell>{candidate.country || "—"}</TableCell>
                  <TableCell className="max-w-48 truncate">{candidate.occupation || "—"}</TableCell>
                  <TableCell>{candidate.marital_status ? maritalStatusLabels[candidate.marital_status] ?? candidate.marital_status : "—"}</TableCell>
                  <TableCell>{candidate.children_count ?? "—"}</TableCell>
                  <TableCell>{candidate.tribe || "—"}</TableCell>
                  <TableCell>{candidate.religion || "—"}</TableCell>
                  <TableCell>{candidate.height_cm ? `${candidate.height_cm} cm` : "—"}</TableCell>
                  <TableCell>{candidate.single_duration || "—"}</TableCell>
                  <TableCell>{candidate.years_in_country != null ? `${candidate.years_in_country} ans` : "—"}</TableCell>
                  <TableCell className="max-w-56 truncate" title={candidate.hobbies ?? undefined}>{candidate.hobbies || "—"}</TableCell>
                  <TableCell className="max-w-56 truncate" title={candidate.personality ?? undefined}>{candidate.personality || "—"}</TableCell>
                  <TableCell>{candidate.search_age_range || "—"}</TableCell>
                  <TableCell>{candidate.search_marital_status?.map((value) => maritalStatusLabels[value] ?? value).join(", ") || "—"}</TableCell>
                  <TableCell>{candidate.search_max_children ?? "—"}</TableCell>
                  <TableCell>{candidate.search_height_range || "—"}</TableCell>
                  <TableCell>{candidate.search_tribe || "—"}</TableCell>
                  <TableCell>{candidate.search_religion || "—"}</TableCell>
                  <TableCell>{candidate.search_body_type || "—"}</TableCell>
                  <TableCell className="max-w-56 truncate" title={candidate.search_qualities ?? undefined}>{candidate.search_qualities || "—"}</TableCell>
                  <TableCell className="capitalize">{candidate.offer_tier || "—"}</TableCell>
                  <TableCell>{candidate.is_publicly_listed ? "Oui" : "Non"}</TableCell>
                  <TableCell>{candidate.sensitive_data_consent ? "Oui" : "Non"}</TableCell>
                  <TableCell className="max-w-56 truncate" title={candidate.motivation ?? undefined}>{candidate.motivation || "—"}</TableCell>
                  <TableCell className="max-w-56 truncate" title={candidate.admin_notes ?? undefined}>{candidate.admin_notes || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {candidateStatusLabels[candidate.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
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
