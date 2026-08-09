import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegalContent } from "@/components/sections/legal-content";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LegalContent title="Mentions légales" contentKey="mentions-legales.content" />
      </main>
      <SiteFooter />
    </>
  );
}
