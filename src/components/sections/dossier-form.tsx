"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  submitDossierCandidature,
  type DossierFormState,
} from "@/lib/actions/dossier-candidature";

const initialState: DossierFormState = { status: "idle" };
const MAX_UPLOADED_PHOTO_SIZE = 1.4 * 1024 * 1024;
const CalEmbed = dynamic(
  () => import("@/components/sections/cal-embed").then((module) => module.CalEmbed),
  { loading: () => <p className="py-10 text-center text-sm text-muted-foreground">Chargement du calendrier…</p> }
);

async function optimizePhoto(file: File): Promise<File> {
  if (file.size <= MAX_UPLOADED_PHOTO_SIZE) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Impossible de préparer cette photo.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.86;
  let blob: Blob | null = null;
  do {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    quality -= 0.08;
  } while (blob && blob.size > MAX_UPLOADED_PHOTO_SIZE && quality >= 0.46);

  if (!blob || blob.size > MAX_UPLOADED_PHOTO_SIZE) {
    throw new Error("Cette photo est trop volumineuse. Choisissez une image plus légère.");
  }

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

function PhotoField({
  id,
  name,
  label,
  error,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string>();
  const [isOptimizing, setIsOptimizing] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
        onChange={async (event) => {
          const input = event.currentTarget;
          const file = event.target.files?.[0];
          if (!file) return;
          input.value = "";
          setLocalError(undefined);
          setIsOptimizing(true);

          try {
            const optimized = await optimizePhoto(file);
            const transfer = new DataTransfer();
            transfer.items.add(optimized);
            input.files = transfer.files;
            setPreview((current) => {
              if (current) URL.revokeObjectURL(current);
              return URL.createObjectURL(optimized);
            });
          } catch (photoError) {
            setLocalError(
              photoError instanceof Error
                ? photoError.message
                : "Impossible de préparer cette photo."
            );
          } finally {
            setIsOptimizing(false);
          }
        }}
      />
      {isOptimizing && <p className="text-xs text-muted-foreground">Optimisation de la photo…</p>}
      {preview && (
        <div className="relative aspect-3/4 w-32 overflow-hidden rounded-lg border border-border/70 bg-secondary/40">
          <Image src={preview} alt={`Aperçu — ${label}`} fill sizes="128px" className="object-cover" unoptimized />
        </div>
      )}
      <FieldError message={localError ?? error} />
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
      <div>
        <h2 className="font-display text-lg">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function DossierForm({ calLink = "" }: { calLink?: string }) {
  const [state, formAction, isPending] = useActionState(
    submitDossierCandidature,
    initialState
  );

  if (state.status === "success") {
    return <div className="space-y-8">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-primary" strokeWidth={1.5} />
        <p className="mt-4 font-display text-xl">Dossier envoyé</p>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
        {state.canBook ? <p className="mt-3 font-medium">Choisissez maintenant votre rendez-vous pour finaliser votre candidature.</p> : null}
      </div>
      {state.canBook && calLink ? <CalEmbed calLink={calLink} /> : null}
      {state.canBook && !calLink ? <p className="text-center text-sm text-muted-foreground">Le calendrier est temporairement indisponible. Charlène vous contactera pour convenir d’un créneau.</p> : null}
    </div>;
  }

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      <Section title="Votre profil">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" name="firstName" required />
            <FieldError message={state.fieldErrors?.firstName} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" name="lastName" required />
            <FieldError message={state.fieldErrors?.lastName} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Vous êtes</Label>
          <RadioGroup name="gender" defaultValue="femme" className="flex gap-6">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="femme" id="d-gender-femme" />
              <Label htmlFor="d-gender-femme" className="font-normal">Une femme</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="homme" id="d-gender-homme" />
              <Label htmlFor="d-gender-homme" className="font-normal">Un homme</Label>
            </div>
          </RadioGroup>
          <FieldError message={state.fieldErrors?.gender} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            <FieldError message={state.fieldErrors?.email} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" type="tel" required />
            <FieldError message={state.fieldErrors?.phone} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input id="birthDate" name="birthDate" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Pays de résidence</Label>
            <Input id="country" name="country" defaultValue="France" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" required />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="yearsInCountry">Ancienneté dans le pays (années)</Label>
            <Input id="yearsInCountry" name="yearsInCountry" type="number" min={0} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maritalStatus">Statut</Label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="celibataire">Célibataire</option>
              <option value="divorce">Divorcé(e)</option>
              <option value="veuf">Veuf(ve)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="childrenCount">Nombre d&apos;enfants</Label>
            <Input id="childrenCount" name="childrenCount" type="number" min={0} defaultValue={0} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="heightCm">Taille (cm)</Label>
            <Input id="heightCm" name="heightCm" type="number" min={100} max={230} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="occupation">Métier</Label>
            <Input id="occupation" name="occupation" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tribe">Tribu</Label>
            <Input id="tribe" name="tribe" placeholder="Ex. Bamendjou, Ewondo, Sawa..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="religion">Religion</Label>
            <Input id="religion" name="religion" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="singleDuration">Depuis combien de temps êtes-vous célibataire ?</Label>
          <Input id="singleDuration" name="singleDuration" placeholder="Ex. 2 ans" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hobbies">Vos centres d&apos;intérêt</Label>
          <Textarea id="hobbies" name="hobbies" rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="personality">Comment décririez-vous votre personnalité ?</Label>
          <Textarea id="personality" name="personality" rows={3} />
        </div>
      </Section>

      <Section
        title="La personne que vous recherchez"
        description="Ces critères nous aident à cibler des profils réellement compatibles avec vous."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="searchAgeRange">Tranche d&apos;âge souhaitée</Label>
            <Input id="searchAgeRange" name="searchAgeRange" placeholder="Ex. 28-35" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="searchMaxChildren">Nombre d&apos;enfants maximum accepté</Label>
            <Input id="searchMaxChildren" name="searchMaxChildren" type="number" min={0} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Statut accepté</Label>
          <div className="flex flex-wrap gap-5">
            {[
              { value: "celibataire", label: "Célibataire" },
              { value: "divorce", label: "Divorcé(e)" },
              { value: "veuf", label: "Veuf(ve)" },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`search-status-${option.value}`}
                  name="searchMaritalStatus"
                  value={option.value}
                />
                <Label htmlFor={`search-status-${option.value}`} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="searchHeightRange">Tranche de taille acceptée</Label>
            <Input id="searchHeightRange" name="searchHeightRange" placeholder="Ex. 165-180 cm" />
          </div>
          <div className="space-y-1.5">
            <Label>Carrures physiques souhaitées</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "mince", label: "Mince" },
                { value: "moyenne", label: "Moyenne" },
                { value: "athletique", label: "Athlétique" },
                { value: "embonpoint", label: "Embonpoint" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox id={`search-body-${option.value}`} name="searchBodyType" value={option.value} />
                  <Label htmlFor={`search-body-${option.value}`} className="font-normal">{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="searchTribe">Tribu acceptée</Label>
            <Input id="searchTribe" name="searchTribe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="searchReligion">Religion acceptée</Label>
            <Input id="searchReligion" name="searchReligion" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="searchQualities">Qualités que vous recherchez chez cette personne</Label>
          <Textarea id="searchQualities" name="searchQualities" rows={3} />
        </div>
      </Section>

      <Section
        title="Vos photos"
        description="Ces photos restent strictement internes, pour aider Charlène à vous proposer des profils compatibles. Elles ne sont jamais publiées sur le site."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <PhotoField
            id="photoPortrait"
            name="photoPortrait"
            label="Photo portrait"
            error={state.fieldErrors?.photoPortrait}
          />
          <PhotoField
            id="photoFull"
            name="photoFull"
            label="Photo entière"
            error={state.fieldErrors?.photoFull}
          />
        </div>
      </Section>

      <Section title="Consentement">
        <div className="flex items-start gap-2">
          <Checkbox id="sensitiveDataConsent" name="sensitiveDataConsent" required />
          <Label htmlFor="sensitiveDataConsent" className="font-normal">
            J&apos;autorise Lomdie à traiter les informations sensibles renseignées
            ci-dessus (tribu, religion) dans le seul but de me proposer des
            profils compatibles. Ces données ne sont jamais partagées ni
            publiées.
          </Label>
        </div>
        <FieldError message={state.fieldErrors?.sensitiveDataConsent} />
      </Section>

      {state.status === "error" && state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Envoi en cours..." : "Envoyer mon dossier"}
      </Button>
    </form>
  );
}
