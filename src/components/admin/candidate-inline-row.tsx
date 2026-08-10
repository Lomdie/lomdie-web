"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { CandidatePhotoPreview } from "@/components/admin/candidate-photo-preview";
import {
  createCandidateInline,
  deleteCandidateInline,
  addCandidatePhoto,
  removeCandidatePhoto,
  updateCandidateCell,
} from "@/lib/actions/admin-candidates";
import { candidateStatusLabels, candidateStatuses, type CandidateStatus } from "@/lib/candidate-status";

type Field = Parameters<typeof updateCandidateCell>[0]["field"];
type EditorType = "text" | "number" | "date" | "textarea" | "boolean" | "select" | "array";

interface Candidate {
  id: string; first_name: string; last_name: string; email: string; phone: string; gender: string;
  birth_date: string | null; country: string | null; city: string | null; years_in_country: number | null;
  marital_status: string | null; children_count: number | null; tribe: string | null; religion: string | null;
  sensitive_data_consent: boolean; height_cm: number | null; occupation: string | null;
  single_duration: string | null; hobbies: string | null; personality: string | null;
  search_age_range: string | null; search_marital_status: string[] | null; search_max_children: number | null;
  search_height_range: string | null; search_tribe: string | null; search_religion: string | null;
  search_body_type: string | null; search_qualities: string | null; offer_tier: string | null;
  is_publicly_listed: boolean; motivation: string | null; admin_notes: string | null;
  airtable_age: number | null; eligibility_score: number | null; meeting_notes: string | null; key_decisions: string | null;
  airtable_status: string | null; airtable_criteria_ids: string[] | null; status: CandidateStatus;
  application_date: string; photo_urls: string[] | null; resolvedPhotoUrls: string[];
}

function InlinePhotos({ candidate }: { candidate: Candidate }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return <div className="min-w-36 space-y-2">
    <CandidatePhotoPreview urls={candidate.resolvedPhotoUrls} candidateName={`${candidate.first_name} ${candidate.last_name}`} />
    <div className="flex items-center gap-1">
      <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary">
        <Upload className="h-3 w-3" /> Ajouter
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={pending} onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const formData = new FormData();
          formData.set("candidateId", candidate.id);
          formData.set("photo", file);
          startTransition(async () => {
            const result = await addCandidatePhoto(formData);
            setMessage(result.message);
            if (result.ok) router.refresh();
          });
          event.currentTarget.value = "";
        }} />
      </label>
      {(candidate.photo_urls ?? []).map((path, index) => <button
        key={path}
        type="button"
        disabled={pending}
        aria-label={`Supprimer la photo ${index + 1}`}
        title={`Supprimer la photo ${index + 1}`}
        className="rounded p-1 text-destructive hover:bg-destructive/10"
        onClick={() => {
          if (!window.confirm(`Supprimer la photo ${index + 1} ?`)) return;
          startTransition(async () => {
            const result = await removeCandidatePhoto({ candidateId: candidate.id, path });
            setMessage(result.message);
            if (result.ok) router.refresh();
          });
        }}
      ><Trash2 className="h-3.5 w-3.5" /></button>)}
    </div>
    {message && <p className={`text-xs ${message.includes("échoué") || message.includes("invalide") ? "text-destructive" : "text-muted-foreground"}`}>{message}</p>}
  </div>;
}

const maritalOptions = [
  { value: "celibataire", label: "Célibataire" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf/veuve" },
];

function ageFromDate(value: string | null) {
  if (!value) return "";
  const birth = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return String(age);
}

function InlineCell({
  candidateId, field, value, display, label, type = "text", options,
}: {
  candidateId: string; field: Field; value: string | number | boolean | string[] | null;
  display?: ReactNode; label: string; type?: EditorType; options?: { value: string; label: string }[];
}) {
  const router = useRouter();
  const serialized = Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(serialized);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateCandidateCell({ candidateId, field, value: draft });
      setMessage(result.message);
      if (result.ok) {
        setEditing(false);
        router.refresh();
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="group/cell flex min-h-8 w-full min-w-24 items-center gap-1 rounded px-1 text-left hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary"
        onClick={() => { setDraft(serialized); setMessage(""); setEditing(true); }}
        title={`Modifier ${label.toLowerCase()}`}
      >
        <span className="min-w-0 flex-1 truncate">{display ?? serialized}</span>
        <Pencil className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-60" />
      </button>
    );
  }

  const common = {
    value: draft,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDraft(event.target.value),
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (event.key === "Escape") setEditing(false);
      if (event.key === "Enter" && type !== "textarea") { event.preventDefault(); save(); }
    },
    autoFocus: true,
    disabled: pending,
    "aria-label": label,
  };

  return (
    <div className="min-w-48 rounded-lg border border-primary/40 bg-background p-1.5 shadow-md">
      {type === "select" || type === "boolean" ? (
        <select {...common} className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm">
          {type !== "boolean" && <option value="">Vide</option>}
          {(type === "boolean" ? [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }] : options ?? []).map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea {...common} rows={4} className="w-80 rounded-md border border-input bg-background p-2 text-sm" />
      ) : (
        <Input {...common} type={type === "array" ? "text" : type} className="h-9" />
      )}
      {type === "array" && <p className="mt-1 text-xs text-muted-foreground">Séparez les valeurs par des virgules.</p>}
      {message && <p className="mt-1 text-xs text-destructive">{message}</p>}
      <div className="mt-1 flex justify-end gap-1">
        <button type="button" onClick={() => setEditing(false)} className="rounded p-1 hover:bg-secondary" aria-label="Annuler"><X className="h-4 w-4" /></button>
        <button type="button" onClick={save} disabled={pending} className="rounded bg-primary p-1 text-primary-foreground" aria-label="Enregistrer"><Check className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function CandidateInlineRow({ candidate }: { candidate: Candidate }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function remove() {
    if (!window.confirm(`Supprimer définitivement la candidature de ${candidate.first_name} ${candidate.last_name} ?`)) return;
    startTransition(async () => {
      const result = await deleteCandidateInline(candidate.id);
      if (!result.ok) setError(result.message);
      else router.refresh();
    });
  }

  return (
    <TableRow>
      <TableCell className="sticky left-0 z-10 min-w-52 bg-card">
        <div className="space-y-1">
          <InlineCell candidateId={candidate.id} field="first_name" value={candidate.first_name} label="Prénom" />
          <InlineCell candidateId={candidate.id} field="last_name" value={candidate.last_name} label="Nom" />
          <Link href={`/admin/candidatures/${candidate.id}`} prefetch={false} className="block px-1 text-xs text-primary hover:underline">Voir le dossier complet</Link>
        </div>
      </TableCell>
      <TableCell><InlinePhotos candidate={candidate} /></TableCell>
      <TableCell className="min-w-56"><InlineCell candidateId={candidate.id} field="email" value={candidate.email.endsWith("@lomdie-sans-email.invalid") ? "" : candidate.email} label="E-mail" /><InlineCell candidateId={candidate.id} field="phone" value={candidate.phone} label="Téléphone" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="gender" value={candidate.gender} label="Genre" type="select" options={[{ value: "femme", label: "Femme" }, { value: "homme", label: "Homme" }]} /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="birth_date" value={candidate.birth_date} display={ageFromDate(candidate.birth_date)} label="Date de naissance" type="date" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="airtable_age" value={candidate.airtable_age} label="Âge importé" type="number" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="city" value={candidate.city} label="Ville" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="country" value={candidate.country} label="Pays" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="occupation" value={candidate.occupation} label="Métier" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="marital_status" value={candidate.marital_status} label="Situation" type="select" options={maritalOptions} /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="children_count" value={candidate.children_count} label="Enfants" type="number" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="tribe" value={candidate.tribe} label="Tribu" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="religion" value={candidate.religion} label="Religion" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="height_cm" value={candidate.height_cm} display={candidate.height_cm ? `${candidate.height_cm} cm` : ""} label="Taille" type="number" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="single_duration" value={candidate.single_duration} label="Célibataire depuis" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="years_in_country" value={candidate.years_in_country} label="Ancienneté pays" type="number" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="hobbies" value={candidate.hobbies} label="Centres d’intérêt" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="personality" value={candidate.personality} label="Personnalité" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_age_range" value={candidate.search_age_range} label="Âge recherché" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_marital_status" value={candidate.search_marital_status} display={candidate.search_marital_status?.map((v) => maritalOptions.find((o) => o.value === v)?.label ?? v).join(", ") ?? ""} label="Situation recherchée" type="array" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_max_children" value={candidate.search_max_children} label="Enfants max." type="number" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_height_range" value={candidate.search_height_range} label="Taille recherchée" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_tribe" value={candidate.search_tribe} label="Tribu recherchée" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_religion" value={candidate.search_religion} label="Religion recherchée" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_body_type" value={candidate.search_body_type} label="Carrure recherchée" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="search_qualities" value={candidate.search_qualities} label="Qualités recherchées" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="offer_tier" value={candidate.offer_tier} label="Offre" type="select" options={[{ value: "reseau", label: "Réseau" }, { value: "signature", label: "Signature" }, { value: "hunter", label: "Hunter" }]} /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="is_publicly_listed" value={candidate.is_publicly_listed} display={candidate.is_publicly_listed ? "Oui" : "Non"} label="Visible" type="boolean" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="sensitive_data_consent" value={candidate.sensitive_data_consent} display={candidate.sensitive_data_consent ? "Oui" : "Non"} label="Consentement sensible" type="boolean" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="motivation" value={candidate.motivation} label="Motivation" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="admin_notes" value={candidate.admin_notes} label="Notes admin" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="eligibility_score" value={candidate.eligibility_score} label="Note éligibilité AI" type="number" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="meeting_notes" value={candidate.meeting_notes} label="Meeting Notes" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="key_decisions" value={candidate.key_decisions} label="Key Decisions" type="textarea" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="airtable_status" value={candidate.airtable_status} label="Statut historique" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="airtable_criteria_ids" value={candidate.airtable_criteria_ids} display={candidate.airtable_criteria_ids?.length ?? ""} label="Critères historiques liés" type="array" /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="status" value={candidate.status} display={<Badge variant="secondary">{candidateStatusLabels[candidate.status]}</Badge>} label="Statut" type="select" options={candidateStatuses.map((value) => ({ value, label: candidateStatusLabels[value] }))} /></TableCell>
      <TableCell><InlineCell candidateId={candidate.id} field="application_date" value={candidate.application_date.slice(0, 10)} display={new Date(candidate.application_date).toLocaleDateString("fr-FR")} label="Date de candidature" type="date" /></TableCell>
      <TableCell className="sticky right-0 z-10 bg-card">
        <Button type="button" variant="ghost" size="icon" onClick={remove} disabled={pending} aria-label="Supprimer la candidature" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
        {error && <p className="w-36 text-xs text-destructive">{error}</p>}
      </TableCell>
    </TableRow>
  );
}

export function CreateCandidateInlineRow({ columnCount }: { columnCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (!open) {
    return <TableRow><TableCell colSpan={columnCount}><Button type="button" variant="ghost" onClick={() => setOpen(true)} className="gap-2 text-primary"><Plus className="h-4 w-4" />Ajouter une candidature</Button></TableCell></TableRow>;
  }

  return (
    <TableRow className="bg-secondary/30">
      <TableCell colSpan={columnCount}>
        <form className="flex min-w-max flex-wrap items-end gap-3" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          startTransition(async () => {
            const result = await createCandidateInline({ firstName: String(form.get("firstName") ?? ""), lastName: String(form.get("lastName") ?? ""), gender: String(form.get("gender") ?? ""), email: String(form.get("email") ?? ""), phone: String(form.get("phone") ?? "") });
            if (!result.ok) setError(result.message);
            else { setOpen(false); router.refresh(); }
          });
        }}>
          <Input name="firstName" placeholder="Prénom *" required className="w-44" autoFocus />
          <Input name="lastName" placeholder="Nom *" required className="w-44" />
          <select name="gender" required defaultValue="" className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm"><option value="" disabled>Genre *</option><option value="femme">Femme</option><option value="homme">Homme</option></select>
          <Input name="email" type="email" placeholder="E-mail" className="w-56" />
          <Input name="phone" placeholder="Téléphone" className="w-44" />
          <Button type="submit" disabled={pending}>{pending ? "Création…" : "Créer"}</Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </TableCell>
    </TableRow>
  );
}
