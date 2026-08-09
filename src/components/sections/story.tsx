import { getSiteContent } from "@/lib/site-content";

const defaults = {
  "a-propos.story.title": "Pourquoi Lomdie existe",
  "a-propos.story.body":
    "Avant d'être Lomdie, c'était déjà une pratique personnelle : mettre en relation des personnes de la diaspora camerounaise qu'on sentait faites l'une pour l'autre, sans algorithme, juste en prenant le temps de bien les connaître. Les premières mises en relation de ces derniers mois en sont la preuve : une méthode qui fonctionne, qu'on a voulu structurer et rendre accessible à plus grand nombre, sans jamais perdre cette exigence du départ.",
};

export async function Story() {
  const content = await getSiteContent(Object.keys(defaults));
  const title = content["a-propos.story.title"] ?? defaults["a-propos.story.title"];
  const body = content["a-propos.story.body"] ?? defaults["a-propos.story.body"];

  return (
    <section className="border-b border-border/70 bg-secondary/30">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Notre histoire
        </p>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl">{title}</h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </section>
  );
}
