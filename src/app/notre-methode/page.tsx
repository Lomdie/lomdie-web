import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Engagements } from "@/components/sections/engagements";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Un accompagnement humain, personnalisé et confidentiel à chaque étape, de la candidature à la mise en relation.",
};

const defaults = {
  "methode.header.title": "Le processus de mise en relation",
  "methode.header.description":
    "Un accompagnement humain, personnalisé et confidentiel à chaque étape.",
};

export default async function NotreMethodePage() {
  const content = await getSiteContent(Object.keys(defaults));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Notre méthode"
          title={content["methode.header.title"] ?? defaults["methode.header.title"]}
          description={
            content["methode.header.description"] ?? defaults["methode.header.description"]
          }
        />
        <ProcessSteps />
        <Engagements />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
