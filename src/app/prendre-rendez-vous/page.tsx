import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { CalEmbed } from "@/components/sections/cal-embed";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Réservez votre appel découverte avec l'équipe Lomdie.",
};

const defaults = {
  "rdv.cal_link": "",
  "rdv.header.title": "Réservez votre appel découverte",
  "rdv.header.description":
    "Un premier échange pour faire connaissance et comprendre vos attentes.",
};

export default async function PrendreRendezVousPage() {
  const content = await getSiteContent(Object.keys(defaults));
  const calLink = content["rdv.cal_link"] || defaults["rdv.cal_link"];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Prendre rendez-vous"
          title={content["rdv.header.title"] ?? defaults["rdv.header.title"]}
          description={
            content["rdv.header.description"] ?? defaults["rdv.header.description"]
          }
        />

        {calLink ? (
          <CalEmbed calLink={calLink} />
        ) : (
          <section className="bg-background">
            <div className="mx-auto max-w-md px-6 py-16 text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
              <p className="mt-4 font-display text-lg">
                La prise de rendez-vous en ligne arrive bientôt
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                En attendant, contactez-nous directement et nous
                planifierons votre appel découverte ensemble.
              </p>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
