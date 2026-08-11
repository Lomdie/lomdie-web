import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DossierForm } from "@/components/sections/dossier-form";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Complétez votre dossier puis réservez votre rendez-vous Lomdie.",
};

const defaults = {
  "rdv.cal_link": "",
};

export default async function PrendreRendezVousPage() {
  const content = await getSiteContent(Object.keys(defaults));
  const calLink = content["rdv.cal_link"] || defaults["rdv.cal_link"];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-secondary/20">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/30 bg-card p-4 text-sm"><strong className="text-primary">1.</strong> Complétez et envoyez votre dossier détaillé.</div>
              <div className="rounded-xl border border-border/70 bg-card p-4 text-sm"><strong className="text-primary">2.</strong> Le calendrier s’ouvre immédiatement pour réserver votre créneau.</div>
            </div>
            <DossierForm calLink={calLink} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
