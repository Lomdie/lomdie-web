import Link from "next/link";
import { ArrowRight, ClipboardList, Video, Search, HeartHandshake, Headphones } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const steps = [
  { number: "01", title: "Candidature", icon: ClipboardList },
  { number: "02", title: "Appel vidéo", icon: Video },
  { number: "03", title: "Sélection", icon: Search },
  { number: "04", title: "Mise en relation", icon: HeartHandshake },
  { number: "05", title: "Suivi personnalisé", icon: Headphones },
];

export function MethodTeaser() {
  return (
    <section className="border-b border-border/70 bg-primary/10">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Notre méthode
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">
            Notre méthode en un coup d&apos;œil
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-5">
          {steps.map(({ number, title, icon: Icon }, index) => (
            <Reveal key={number} delay={index * 0.08} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-background">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary/60">
                {number}
              </p>
              <h3 className="mt-1 font-display text-base">{title}</h3>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14 text-center">
          <Button render={<Link href="/notre-methode" className="gap-2" />} variant="outline">
            Découvrir notre méthode
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
