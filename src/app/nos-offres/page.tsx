import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { Comparison } from "@/components/sections/comparison";
import { Pricing } from "@/components/sections/pricing";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Nos offres",
  description: "Choisissez l'accompagnement qui vous correspond.",
};

export default function NosOffresPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Nos offres"
          title="Nos offres de matchmaking"
          description="Choisissez l'accompagnement qui vous correspond."
        />
        <Comparison />
        <Pricing />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
