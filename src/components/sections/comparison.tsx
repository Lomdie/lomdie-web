import Image from "next/image";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PhoneMockup } from "@/components/sections/phone-mockup";

const classicApps = [
  "Swipe sans fin",
  "Algorithmes impersonnels",
  "Profils partiels ou trompeurs",
  "Messages sans réponse",
  "Rencontres basées sur le hasard",
  "Aucun suivi véritable",
];

const lomdie = [
  "Accompagnement humain",
  "Entretiens personnalisés",
  "Profils vérifiés et compatibles",
  "Mises en relation ciblées",
  "Rencontres basées sur la compatibilité",
  "Suivi personnalisé et bienveillant",
];

export function Comparison() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-center font-display text-2xl sm:text-3xl">
            Lomdie face aux applications de rencontre
          </h2>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-12 grid overflow-hidden rounded-2xl border border-border/70 shadow-sm lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.9fr)]"
        >
          <div className="flex flex-col items-center gap-8 bg-card p-7 sm:p-9 md:flex-row md:items-start lg:gap-7 lg:p-8 xl:gap-9 xl:p-10">
            <PhoneMockup />

            <div className="grid w-full min-w-0 flex-1 items-start gap-y-6 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] sm:gap-x-3">
              <div>
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                  Applications classiques
                </h3>
                <ul className="space-y-3">
                  {classicApps.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" strokeWidth={1.5} />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center self-stretch">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-md">
                  Vs
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-medium text-primary">Lomdie</h3>
                <ul className="space-y-3">
                  {lomdie.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-105 lg:block">
            <Image
              src="/images/stock/couple-connection.webp"
              alt="Couple partageant un moment de complicité"
              fill
              sizes="(min-width: 1280px) 34vw, 38vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/35 to-transparent" />
            <div className="absolute right-5 top-5 flex items-center gap-2 text-white drop-shadow-md">
              <Image
                src="/images/logo-lomdie-icon.png"
                alt=""
                width={22}
                height={22}
                className="h-5.5 w-5.5"
              />
              <span className="font-display text-base tracking-wide">Lomdie</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
