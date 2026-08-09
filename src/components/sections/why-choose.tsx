import { HeartHandshake, ShieldCheck, Lock, Gem, Target } from "lucide-react";
import { Reveal } from "@/components/reveal";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Accompagnement humain",
    description: "Un suivi personnalisé à chaque étape de votre recherche.",
  },
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    description: "Des profils sélectionnés avec soin pour leur sérieux et leurs valeurs.",
  },
  {
    icon: Lock,
    title: "Discrétion absolue",
    description: "Votre confidentialité est notre priorité absolue.",
  },
  {
    icon: Gem,
    title: "Matchmaking premium",
    description: "Un service haut de gamme pour des rencontres de qualité.",
  },
  {
    icon: Target,
    title: "Compatibilité réelle",
    description: "Nous nous concentrons sur ce qui compte vraiment : vous.",
  },
];

export function WhyChoose() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl">
            Pourquoi choisir Lomdie ?
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.08} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-base">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
