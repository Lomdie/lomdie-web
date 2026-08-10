import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { CandidatureForm } from "@/components/sections/candidature-form";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Faire une candidature",
  description:
    "Faites le premier pas vers une rencontre qui a du sens. Discrétion absolue garantie.",
};

export default async function CandidaturePage() {
  const content = await getSiteContent(["rdv.cal_link"]);
  const calLink = content["rdv.cal_link"] ?? "";
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Candidature"
          title="Faites le premier pas"
          description="Quelques informations suffisent pour commencer. Nous reviendrons vers vous pour mieux vous connaître."
        />
        <section className="bg-background">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <CandidatureForm calLink={calLink} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
