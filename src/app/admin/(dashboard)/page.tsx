import type { Metadata } from "next";
import Link from "next/link";
import { Users, MessageSquareQuote, HelpCircle, Sparkles } from "lucide-react";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Tableau de bord" };

async function getCounts() {
  const supabase = await createAuthedServerClient();

  const [{ count: candidatesCount }, { count: newCandidatesCount }] = await Promise.all([
    supabase.from("candidates").select("id", { count: "exact", head: true }),
    supabase
      .from("candidates")
      .select("id", { count: "exact", head: true })
      .eq("status", "nouvelle_candidature"),
  ]);

  return {
    total: candidatesCount ?? 0,
    nouvelles: newCandidatesCount ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Tableau de bord
          <HelpTooltip text="Point de départ de votre espace. Le menu à gauche donne accès à chaque section : candidatures reçues, contenu du site, offres, FAQ, témoignages, blog et équipe." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble de votre activité Lomdie.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium">Bienvenue dans votre espace Lomdie</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Utilisez le menu pour accéder à chaque section. Tout ce que vous
            modifiez ici (offres, FAQ, témoignages) se met à jour
            directement sur le site public.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/candidatures"
          className="rounded-2xl border border-border/70 bg-card p-6 transition-shadow hover:shadow-md"
        >
          <Users className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <p className="mt-3 font-display text-3xl">{counts.total}</p>
          <p className="text-sm text-muted-foreground">Candidatures au total</p>
        </Link>
        <Link
          href="/admin/candidatures"
          className="rounded-2xl border border-border/70 bg-card p-6 transition-shadow hover:shadow-md"
        >
          <Users className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <p className="mt-3 font-display text-3xl">{counts.nouvelles}</p>
          <p className="text-sm text-muted-foreground">Nouvelles candidatures à traiter</p>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/temoignages"
          className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 text-sm transition-shadow hover:shadow-md"
        >
          <MessageSquareQuote className="h-5 w-5 text-primary" strokeWidth={1.5} />
          Gérer les témoignages
        </Link>
        <Link
          href="/admin/faq"
          className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 text-sm transition-shadow hover:shadow-md"
        >
          <HelpCircle className="h-5 w-5 text-primary" strokeWidth={1.5} />
          Gérer la FAQ
        </Link>
      </div>
    </div>
  );
}
