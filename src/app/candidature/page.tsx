import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { CandidatureForm } from "@/components/sections/candidature-form";

export const metadata: Metadata = {
  title: "Faire une candidature",
  description:
    "Faites le premier pas vers une rencontre qui a du sens. Discrétion absolue garantie.",
};

export default function CandidaturePage() {
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
          <div className="mx-auto max-w-xl px-6 py-16">
            <CandidatureForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
