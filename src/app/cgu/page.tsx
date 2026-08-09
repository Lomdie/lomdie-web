import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegalContent } from "@/components/sections/legal-content";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function CguPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LegalContent title="Conditions générales d'utilisation" contentKey="cgu.content" />
      </main>
      <SiteFooter />
    </>
  );
}
