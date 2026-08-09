import { Heart, Lock, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

const engagements = [
  { icon: Lock, label: "Confidentialité absolue" },
  { icon: UserCheck, label: "Accompagnement humain" },
  { icon: ShieldCheck, label: "Profils vérifiés" },
  { icon: Heart, label: "Compatibilité réelle" },
  { icon: Sparkles, label: "Service haut de gamme" },
];

export function Engagements() {
  return (
    <section className="border-b border-border/70 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          {engagements.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
