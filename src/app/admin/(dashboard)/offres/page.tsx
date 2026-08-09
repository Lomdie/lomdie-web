import type { Metadata } from "next";
import { PricingPlanForm } from "@/components/admin/pricing-plan-form";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Offres" };

async function getPlans() {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("pricing_plans")
    .select("id, tier, name, description, price, is_popular, features, not_included, cta_label")
    .order("sort_order");

  return data ?? [];
}

export default async function AdminOffresPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Offres
          <HelpTooltip text="Modifiez le nom, le prix et les avantages inclus de chaque formule. Laissez le prix vide pour afficher « Sur demande ». Chaque changement est visible immédiatement sur la page « Nos offres » du site." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations sont affichées telles quelles sur la page &quot;Nos
          offres&quot; du site public.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingPlanForm
            key={plan.id}
            planId={plan.id}
            tier={plan.tier}
            name={plan.name}
            description={plan.description}
            price={plan.price}
            isPopular={plan.is_popular}
            features={plan.features as string[]}
            notIncluded={plan.not_included as string[]}
            ctaLabel={plan.cta_label}
          />
        ))}
      </div>
    </div>
  );
}
