import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { TestimonialsList } from "@/components/sections/testimonials-list";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Témoignages",
  description: "Ils ont vécu l'expérience Lomdie.",
};

export default function TemoignagesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Témoignages"
          title="Ils ont vécu l'expérience Lomdie"
          description="Leurs histoires sont notre plus belle récompense."
        />
        <TestimonialsList />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
