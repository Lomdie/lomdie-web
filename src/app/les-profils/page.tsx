import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { ProfileCard, type PublicProfile } from "@/components/sections/profile-card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { createServerReadClient } from "@/lib/supabase/server";
import { HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Les profils",
  description:
    "Découvrez des profils compatibles avec vous, sélectionnés avec soin par l'équipe Lomdie.",
};

async function getPublicProfiles(): Promise<PublicProfile[]> {
  "use cache";
  cacheTag("public-profiles");
  cacheLife("minutes");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("public_candidate_profiles")
    .select("id, gender, age, city, occupation")
    .limit(24);

  if (error) {
    return [];
  }

  return data ?? [];
}

export default async function LesProfilsPage() {
  const profiles = await getPublicProfiles();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Les profils"
          title="Découvrez des profils compatibles avec vous"
          description="Des célibataires sérieux, sélectionnés avec soin. Les photos restent floutées et réservées à nos membres : la discrétion est notre priorité."
        />

        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16">
            {profiles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border py-16 text-center">
                <HeartHandshake className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
                <p className="mt-4 font-display text-lg">
                  De nouveaux profils rejoignent Lomdie chaque semaine
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Faites votre candidature pour être mis en relation dès
                  qu'un profil compatible avec vos critères rejoint notre
                  réseau.
                </p>
              </div>
            )}
          </div>
        </section>

        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
