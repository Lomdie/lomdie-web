import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegalContent } from "@/components/sections/legal-content";

export const metadata: Metadata = { title: "Confidentialité" };

export default function ConfidentialitePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LegalContent title="Politique de confidentialité" contentKey="confidentialite.content" />
      </main>
      <SiteFooter />
    </>
  );
}
