import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { CandidateEditForm } from "@/components/admin/candidate-edit-form";
import { HelpTooltip } from "@/components/admin/help-tooltip";
import { PhotoDownloadButton } from "@/components/admin/photo-download-button";

export const metadata: Metadata = { title: "Détail candidature" };

interface PageProps {
  params: Promise<{ id: string }>;
}

const maritalStatusLabels: Record<string, string> = {
  celibataire: "Célibataire",
  divorce: "Divorcé(e)",
  veuf: "Veuf(ve)",
};

async function getCandidate(id: string) {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  let photoUrls: string[] = [];
  if (data.photo_urls?.length) {
    const { data: signed } = await supabase.storage
      .from("candidate-photos")
      .createSignedUrls(data.photo_urls, 60 * 30);
    photoUrls = (signed ?? [])
      .map((entry) => entry.signedUrl)
      .filter((url): url is string => Boolean(url));
  }

  return { ...data, resolvedPhotoUrls: photoUrls };
}

function InfoRow({ label, value }: { label: string; value: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/50 py-2 text-sm last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium break-words sm:text-right">{value}</span>
    </div>
  );
}

export default async function AdminCandidateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const candidate = await getCandidate(id);

  if (!candidate) {
    notFound();
  }

  const searchMaritalStatus = (candidate.search_marital_status as string[] | null)
    ?.map((status) => maritalStatusLabels[status] ?? status)
    .join(", ");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/candidatures"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Retour aux candidatures
      </Link>

      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          {candidate.first_name} {candidate.last_name}
          <HelpTooltip text="Vue complète de cette candidature. À droite : changez le statut du dossier, ajoutez des notes internes visibles uniquement en admin, et cochez « Afficher publiquement » une fois ville, métier et date de naissance renseignés pour que ce profil apparaisse (anonymisé, sans photo) sur la page « Les profils » du site." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Candidature reçue le{" "}
          {new Date(candidate.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Informations
            </h2>
            <InfoRow label="Email" value={candidate.email} />
            <InfoRow label="Téléphone" value={candidate.phone} />
            <InfoRow label="Genre" value={candidate.gender} />
            <InfoRow label="Ville" value={candidate.city} />
            <InfoRow label="Pays" value={candidate.country} />
            <InfoRow label="Ancienneté dans le pays" value={candidate.years_in_country ? `${candidate.years_in_country} ans` : null} />
            <InfoRow
              label="Date de naissance"
              value={
                candidate.birth_date
                  ? new Date(candidate.birth_date).toLocaleDateString("fr-FR")
                  : null
              }
            />
            <InfoRow label="Métier" value={candidate.occupation} />
            <InfoRow
              label="Statut"
              value={
                candidate.marital_status
                  ? maritalStatusLabels[candidate.marital_status] ?? candidate.marital_status
                  : null
              }
            />
            <InfoRow label="Enfants" value={candidate.children_count} />
            <InfoRow label="Tribu" value={candidate.tribe} />
            <InfoRow label="Religion" value={candidate.religion} />
            <InfoRow label="Taille" value={candidate.height_cm ? `${candidate.height_cm} cm` : null} />
            <InfoRow label="Célibataire depuis" value={candidate.single_duration} />
          </div>

          {(candidate.hobbies || candidate.personality) && (
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Centres d&apos;intérêt &amp; personnalité
              </h2>
              {candidate.hobbies && <p className="text-sm leading-relaxed">{candidate.hobbies}</p>}
              {candidate.personality && (
                <p className="text-sm leading-relaxed text-muted-foreground">{candidate.personality}</p>
              )}
            </div>
          )}

          {candidate.motivation && (
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Message de motivation
              </h2>
              <p className="text-sm leading-relaxed">{candidate.motivation}</p>
            </div>
          )}

          {(candidate.search_age_range ||
            searchMaritalStatus ||
            candidate.search_height_range ||
            candidate.search_tribe ||
            candidate.search_religion ||
            candidate.search_body_type ||
            candidate.search_qualities) && (
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Critères de recherche
              </h2>
              <InfoRow label="Tranche d'âge" value={candidate.search_age_range} />
              <InfoRow label="Statut accepté" value={searchMaritalStatus || null} />
              <InfoRow label="Enfants max acceptés" value={candidate.search_max_children} />
              <InfoRow label="Taille acceptée" value={candidate.search_height_range} />
              <InfoRow label="Tribu acceptée" value={candidate.search_tribe} />
              <InfoRow label="Religion acceptée" value={candidate.search_religion} />
              <InfoRow label="Carrure souhaitée" value={candidate.search_body_type} />
              {candidate.search_qualities && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {candidate.search_qualities}
                </p>
              )}
            </div>
          )}

          {candidate.resolvedPhotoUrls.length > 0 && (
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Photos (usage interne uniquement)
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {candidate.resolvedPhotoUrls.map((url: string, index: number) => (
                  <div
                    key={url}
                    className="group relative aspect-3/4 overflow-hidden rounded-lg bg-secondary/40"
                  >
                    <Image
                      src={url}
                      alt={`Photo ${index + 1} de ${candidate.first_name}`}
                      fill
                      sizes="200px"
                      className="object-contain"
                      unoptimized
                    />
                    <PhotoDownloadButton
                      url={url}
                      filename={`${candidate.first_name}-${candidate.last_name}-photo-${index + 1}.jpg`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.resolvedPhotoUrls.length === 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              <UserRound className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              Aucune photo reçue. Le candidat peut les ajouter via son dossier
              détaillé.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 lg:sticky lg:top-6">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Suivi
          </h2>
          <CandidateEditForm
            candidateId={candidate.id}
            currentStatus={candidate.status}
            currentNotes={candidate.admin_notes}
            isPubliclyListed={candidate.is_publicly_listed}
            currentCity={candidate.city}
            currentOccupation={candidate.occupation}
            currentBirthDate={candidate.birth_date}
          />
        </div>
      </div>
    </div>
  );
}
