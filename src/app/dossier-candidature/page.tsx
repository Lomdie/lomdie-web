import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { DossierForm } from "@/components/sections/dossier-form";

export const metadata: Metadata = {
  title: "Dossier de candidature",
  description: "Complétez votre dossier pour finaliser votre profil Lomdie.",
  robots: { index: false, follow: false },
};

export default function DossierCandidaturePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-secondary/20">
        <PageHeader
          eyebrow="Dossier de candidature"
          title="Complétez votre profil"
          description="Ce formulaire nous permet de bien vous connaître pour vous proposer des rencontres réellement compatibles. Toutes vos informations restent strictement confidentielles."
        />
        <div className="mx-auto max-w-2xl px-6 py-16">
          <DossierForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
