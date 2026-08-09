import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { createServerReadClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/site-content";

interface Founder {
  name: string;
  role: string;
  photo_url: string | null;
}

async function getFounders(): Promise<Founder[]> {
  "use cache";
  cacheTag("team-members");
  cacheLife("hours");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("name, role, photo_url")
    .order("sort_order")
    .limit(2);

  if (error) {
    return [];
  }

  return data ?? [];
}

function FounderPhoto({ founder }: { founder: Founder }) {
  return (
    <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-card">
      {founder.photo_url ? (
        <Image
          src={founder.photo_url}
          alt={founder.name}
          fill
          sizes="240px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-display text-4xl text-primary">
          {founder.name.charAt(0)}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3">
        <p className="font-display text-sm text-background">{founder.name}</p>
        <p className="text-[10px] uppercase tracking-wide text-background/80">
          {founder.role}
        </p>
      </div>
    </div>
  );
}

const defaults = {
  "a-propos.header.title": "Des rencontres qui ont du sens",
};

export async function AboutTeaser() {
  const [founders, content] = await Promise.all([
    getFounders(),
    getSiteContent(Object.keys(defaults)),
  ]);

  if (founders.length === 0) {
    return null;
  }

  const title = content["a-propos.header.title"] ?? defaults["a-propos.header.title"];
  const names = founders.map((founder) => founder.name).join(" et ");

  return (
    <section className="border-b border-border/70 bg-secondary/30">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
        <Reveal className="mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
          {founders.map((founder) => (
            <FounderPhoto key={founder.name} founder={founder} />
          ))}
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            À propos de l&apos;équipe fondatrice
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Passionnées par les relations humaines et convaincues que chacun
            mérite de vivre une histoire d&apos;amour épanouissante, {names} ont
            créé Lomdie pour accompagner la diaspora camerounaise en France
            vers des rencontres sérieuses et durables.
          </p>
          <Button render={<Link href="/a-propos" className="gap-2" />} className="mt-6">
            Découvrir notre histoire
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
