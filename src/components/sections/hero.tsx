import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMotion, HeroImageMotion } from "@/components/sections/hero-motion";

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function Hero({ eyebrow, title, subtitle }: HeroProps) {
  return (
    <section className="relative border-b border-border/70 bg-background lg:min-h-[720px] lg:overflow-hidden">
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/images/stock/hero-couple.webp"
          alt="Couple partageant un moment complice"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/92 via-28% to-transparent to-50%" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:min-h-[720px] lg:grid-cols-2 lg:items-center lg:py-0">
        <HeroMotion>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button render={<Link href="/candidature" />} size="lg">
              Faire une candidature
            </Button>
            <Button
              render={<Link href="/notre-methode" className="gap-2" />}
              variant="outline"
              size="lg"
            >
              <PlayCircle className="h-4 w-4" strokeWidth={1.5} />
              Notre méthode
            </Button>
          </div>
        </HeroMotion>

        <HeroImageMotion className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-xl lg:hidden">
          <Image
            src="/images/stock/hero-couple.webp"
            alt="Couple partageant un moment complice"
            fill
            priority
            sizes="90vw"
            className="object-cover object-[72%_50%]"
          />
        </HeroImageMotion>
      </div>
    </section>
  );
}
