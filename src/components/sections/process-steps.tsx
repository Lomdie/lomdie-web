import {
  ClipboardList,
  CreditCard,
  Video,
  Search,
  FileText,
  HeartHandshake,
  Coffee,
  Headphones,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Candidature",
    description:
      "Vous remplissez notre formulaire de candidature en ligne. Nous étudions votre profil avec soin et discrétion.",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Validation & paiement",
    description:
      "Votre profil est validé. Vous choisissez la formule qui vous correspond et effectuez votre paiement en toute sécurité.",
    icon: CreditCard,
  },
  {
    number: 3,
    title: "Appel vidéo",
    description:
      "Nous planifions un appel vidéo avec vous afin de mieux vous connaître, comprendre vos attentes et vos valeurs.",
    icon: Video,
  },
  {
    number: 4,
    title: "Sélection personnalisée",
    description:
      "Nous sélectionnons pour vous des profils compatibles au sein de notre réseau selon des critères de compatibilité approfondis.",
    icon: Search,
  },
  {
    number: 5,
    title: "Présentation des profils",
    description:
      "Nous vous présentons des profils sélectionnés, un à trois maximum, avec un résumé détaillé. Vous choisissez ceux que vous souhaitez rencontrer.",
    icon: FileText,
  },
  {
    number: 6,
    title: "Mise en relation",
    description:
      "Nous organisons votre rencontre dans des conditions optimales. Toutes les informations nécessaires vous sont communiquées.",
    icon: HeartHandshake,
  },
  {
    number: 7,
    title: "Premier rendez-vous",
    description:
      "Vous faites votre rencontre. Nous restons disponibles avant et après pour recueillir vos retours.",
    icon: Coffee,
  },
  {
    number: 8,
    title: "Suivi personnalisé",
    description:
      "Nous assurons un suivi après chaque rencontre pour comprendre vos impressions et ajuster nos prochaines propositions si nécessaire.",
    icon: Headphones,
  },
  {
    number: 9,
    title: "Vers une belle histoire",
    description:
      "Si une connexion mutuelle se confirme, nous continuons à vous accompagner pour construire une relation saine et épanouissante.",
    icon: Sparkles,
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="relative">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-6 w-px bg-border sm:left-8"
          />
          <ol className="space-y-12">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <li key={number} className="relative flex gap-6 pl-0 sm:gap-8">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card sm:h-16 sm:w-16">
                  <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={1.5} />
                </div>
                <div className="pt-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Étape {number}
                  </p>
                  <h3 className="mt-1 font-display text-lg sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
