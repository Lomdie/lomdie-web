import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { FaqList } from "@/components/sections/faq-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Trouvez rapidement les réponses à vos questions sur Lomdie.",
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="FAQ"
          title="Questions fréquentes"
          description="Trouvez rapidement les réponses à vos questions."
        />
        <FaqList />
        <section className="border-t border-border/70 bg-secondary/30">
          <div className="mx-auto max-w-md px-6 py-14 text-center">
            <MessageCircle className="mx-auto h-7 w-7 text-primary" strokeWidth={1.5} />
            <p className="mt-3 font-display text-lg">
              Vous ne trouvez pas votre réponse ?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contactez-nous, nous sommes là pour vous.
            </p>
            <Button render={<Link href="/contact" />} className="mt-5">
              Nous contacter
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
