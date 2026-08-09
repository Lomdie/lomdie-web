"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  updatePricingPlan,
  type UpdatePlanState,
} from "@/lib/actions/admin-pricing";

const initialState: UpdatePlanState = { status: "idle" };

interface PricingPlanFormProps {
  planId: string;
  tier: string;
  name: string;
  description: string | null;
  price: number | null;
  isPopular: boolean;
  features: string[];
  notIncluded: string[];
  ctaLabel: string;
}

export function PricingPlanForm({
  planId,
  tier,
  name,
  description,
  price,
  isPopular,
  features,
  notIncluded,
  ctaLabel,
}: PricingPlanFormProps) {
  const [state, formAction, isPending] = useActionState(
    updatePricingPlan,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-border/70 bg-card p-6"
    >
      <input type="hidden" name="planId" value={planId} />
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        {tier}
      </p>

      <div className="space-y-1.5">
        <Label htmlFor={`name-${planId}`}>Nom de l&apos;offre</Label>
        <Input id={`name-${planId}`} name="name" defaultValue={name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`description-${planId}`}>Description courte</Label>
        <Textarea
          id={`description-${planId}`}
          name="description"
          rows={2}
          defaultValue={description ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`price-${planId}`}>
          Prix en euros (laisser vide pour &quot;Sur demande&quot;)
        </Label>
        <Input
          id={`price-${planId}`}
          name="price"
          type="number"
          min={0}
          defaultValue={price ?? ""}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id={`popular-${planId}`} name="isPopular" defaultChecked={isPopular} />
        <Label htmlFor={`popular-${planId}`} className="font-normal">
          Mettre en avant comme offre populaire
        </Label>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`features-${planId}`}>
          Ce qui est inclus (une ligne par élément)
        </Label>
        <Textarea
          id={`features-${planId}`}
          name="features"
          rows={5}
          defaultValue={features.join("\n")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`not-included-${planId}`}>
          Ce qui n&apos;est PAS inclus (une ligne par élément, laisser vide si sans objet)
        </Label>
        <Textarea
          id={`not-included-${planId}`}
          name="notIncluded"
          rows={4}
          defaultValue={notIncluded.join("\n")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`cta-${planId}`}>Texte du bouton</Label>
        <Input id={`cta-${planId}`} name="ctaLabel" defaultValue={ctaLabel} required />
      </div>

      {state.message && (
        <p
          className={
            state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"
          }
        >
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
