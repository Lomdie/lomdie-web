import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { Story } from "@/components/sections/story";
import { Mission } from "@/components/sections/mission";
import { Team } from "@/components/sections/team";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'équipe et l'histoire de Lomdie, le service de matchmaking dédié à la diaspora camerounaise.",
};

const defaults = {
  "a-propos.header.title": "Des rencontres qui ont du sens",
  "a-propos.header.description":
    "Une approche née d'une pratique personnelle du matchmaking, aujourd'hui structurée pour accompagner plus de célibataires de la diaspora camerounaise.",
};

export default async function AProposPage() {
  const content = await getSiteContent(Object.keys(defaults));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="À propos de Lomdie"
          title={content["a-propos.header.title"] ?? defaults["a-propos.header.title"]}
          description={
            content["a-propos.header.description"] ?? defaults["a-propos.header.description"]
          }
        />
        <Story />
        <Mission />
        <Team />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
