import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Espace membre" };

export default function EspaceMembrePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <Lock className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-2xl">Espace membre</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            L&apos;espace membre est en cours de construction. Il vous
            permettra bientôt de suivre vos mises en relation et d&apos;échanger
            avec votre matchmaker.
          </p>
          <Button render={<Link href="/candidature" />} className="mt-6">
            Faire une candidature
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
