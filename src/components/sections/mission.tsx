import { Heart, ShieldCheck, UserRound } from "lucide-react";
import { Reveal } from "@/components/reveal";

const pillars = [
  {
    icon: UserRound,
    title: "Humaniser les rencontres",
    description: "Remettre l'humain au cœur du matchmaking.",
  },
  {
    icon: ShieldCheck,
    title: "Restaurer la confiance",
    description: "Offrir un cadre sécurisé et bienveillant.",
  },
  {
    icon: Heart,
    title: "Construire des relations durables",
    description: "Accompagner chacun vers une union épanouissante.",
  },
];

const values = [
  { title: "Respect", description: "Chaque personne mérite d'être écoutée et respectée." },
  { title: "Confiance", description: "Un climat rassurant et sans jugement, à chaque étape." },
  { title: "Discrétion", description: "Vos informations sont protégées et ne sont jamais partagées." },
  { title: "Authenticité", description: "Des rencontres basées sur la sincérité et la transparence." },
  { title: "Excellence", description: "Un service haut de gamme, exigeant et centré sur la qualité." },
  { title: "Bienveillance", description: "Un accompagnement humain, chaleureux et attentionné." },
];

export function Mission() {
  return (
    <section className="border-b border-border/70 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Notre mission
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.1} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Nos valeurs
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.06} className="text-center">
              <h4 className="font-display text-base">{value.title}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
