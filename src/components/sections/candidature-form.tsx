"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CalEmbed } from "@/components/sections/cal-embed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  submitCandidature,
  type CandidatureFormState,
} from "@/lib/actions/candidature";

const initialState: CandidatureFormState = { status: "idle" };

export function CandidatureForm({ calLink }: { calLink: string }) {
  const [state, formAction, isPending] = useActionState(
    submitCandidature,
    initialState
  );

  if (state.status === "success") {
    return <div className="space-y-8">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
        <p className="mt-4 font-display text-lg">Informations enregistrées</p>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      </div>
      {calLink ? (
        <CalEmbed
          calLink={calLink}
          name={state.prospect?.name}
          email={state.prospect?.email}
          notes={state.prospect?.notes}
        />
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Le calendrier est temporairement indisponible. Charlène vous contactera pour convenir d’un créneau.
        </p>
      )}
    </div>;
  }

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" required autoComplete="given-name" />
          {state.fieldErrors?.firstName && (
            <p className="text-xs text-destructive">{state.fieldErrors.firstName}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" required autoComplete="family-name" />
          {state.fieldErrors?.lastName && (
            <p className="text-xs text-destructive">{state.fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Vous êtes</Label>
        <RadioGroup name="gender" defaultValue="femme" className="flex gap-6">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="femme" id="gender-femme" />
            <Label htmlFor="gender-femme" className="font-normal">Une femme</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="homme" id="gender-homme" />
            <Label htmlFor="gender-homme" className="font-normal">Un homme</Label>
          </div>
        </RadioGroup>
        {state.fieldErrors?.gender && (
          <p className="text-xs text-destructive">{state.fieldErrors.gender}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Adresse email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        {state.fieldErrors?.phone && (
          <p className="text-xs text-destructive">{state.fieldErrors.phone}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="motivation">
          Parlez-nous un peu de vous et de ce que vous recherchez
        </Label>
        <Textarea id="motivation" name="motivation" rows={4} />
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Envoi en cours..." : "Envoyer ma candidature"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Vos informations restent confidentielles et ne sont utilisées que
        dans le cadre de votre accompagnement Lomdie.
      </p>
    </form>
  );
}
