import Link from "next/link";
import { Check, X, Users, Gem, Target, ShieldCheck, UserRound, Eye } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createServerReadClient } from "@/lib/supabase/server";

interface PricingPlan {
  id: string;
  tier: string;
  name: string;
  description: string | null;
  price: number | null;
  price_period: string | null;
  currency: string;
  is_popular: boolean;
  features: string[];
  not_included: string[];
  cta_label: string;
}

const tierIcons: Record<string, typeof Users> = {
  reseau: Users,
  signature: Gem,
  hunter: Target,
};

const promises = [
  {
    icon: Users,
    title: "Rencontres de qualité",
    description: "Profils sérieux, validés et compatibles.",
  },
  {
    icon: ShieldCheck,
    title: "Discrétion totale",
    description: "Vos données sont 100% confidentielles.",
  },
  {
    icon: UserRound,
    title: "Accompagnement humain",
    description: "À l'écoute, disponible et bienveillant.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    description: "Des offres claires, sans frais cachés.",
  },
];

async function getPricingPlans(): Promise<PricingPlan[]> {
  "use cache";
  cacheTag("pricing-plans");
  cacheLife("hours");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("pricing_plans")
    .select("id, tier, name, description, price, price_period, currency, is_popular, features, not_included, cta_label")
    .order("sort_order");

  if (error) {
    return [];
  }

  return (data ?? []) as PricingPlan[];
}

export async function Pricing() {
  const plans = await getPricingPlans();

  if (plans.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = tierIcons[plan.tier] ?? Gem;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8",
                  plan.is_popular
                    ? "border-primary bg-card shadow-lg"
                    : "border-border/70 bg-card"
                )}
              >
                {plan.is_popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Populaire
                  </Badge>
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-xl">{plan.name}</h3>
                <p className="mt-2 flex items-baseline gap-1.5 font-display text-3xl">
                  {plan.price === null
                    ? "Sur demande"
                    : plan.price === 0
                      ? "Gratuit"
                      : `${plan.price} ${plan.currency}`}
                  {plan.price !== null && plan.price !== 0 && plan.price_period && (
                    <span className="font-sans text-sm font-normal text-muted-foreground">
                      {plan.price_period}
                    </span>
                  )}
                </p>
                {plan.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                )}

                <div className="mt-6 flex-1 space-y-5">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.not_included.length > 0 && (
                    <ul className="space-y-3 border-t border-border/60 pt-4">
                      {plan.not_included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" strokeWidth={1.5} />
                          <span className="text-muted-foreground/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  render={<Link href="/candidature" />}
                  className="mt-8"
                  variant={plan.is_popular ? "default" : "outline"}
                >
                  {plan.cta_label}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 border-t border-border/70 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <div key={promise.title} className="flex items-start gap-3">
              <promise.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{promise.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{promise.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/70 bg-secondary/30 p-6 text-center">
          <p className="text-sm font-medium">
            Important à savoir
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Lomdie s&apos;engage sur les moyens mis en œuvre et les introductions
            proposées, mais ne peut garantir une relation ou un couple. Notre
            rôle est de créer les meilleures conditions pour des rencontres
            authentiques et compatibles.
          </p>
        </div>
      </div>
    </section>
  );
}
