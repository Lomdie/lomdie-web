import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function CtaBanner() {
  return (
    <section className="bg-primary text-primary-foreground">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">
            Prêt(e) à vivre une rencontre différente ?
          </h2>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
            Faites le premier pas vers une relation sérieuse et
            épanouissante.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Button
            render={<Link href="/candidature" className="gap-2" />}
            size="lg"
            variant="secondary"
          >
            Faire une candidature
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-primary-foreground/70">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
            Discrétion absolue garantie
          </p>
        </div>
      </Reveal>
    </section>
  );
}
