import { cacheLife, cacheTag } from "next/cache";
import { ProfileCard, type PublicProfile } from "@/components/sections/profile-card";
import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
import { createServerReadClient } from "@/lib/supabase/server";

async function getPublicProfiles(): Promise<PublicProfile[]> {
  "use cache";
  cacheTag("public-profiles");
  cacheLife("minutes");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("public_candidate_profiles")
    .select("id, gender, age, city, occupation")
    .limit(5);

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function ProfilesTeaser() {
  const profiles = await getPublicProfiles();

  if (profiles.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border/70 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl">
            Ils recherchent une belle rencontre...
          </h2>
        </Reveal>

        <div className="mt-10">
          <Carousel itemClassName="w-full" autoplayMs={5000}>
            {profiles.map((profile) => (
              <div key={profile.id} className="mx-auto flex max-w-xs justify-center">
                <ProfileCard profile={profile} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
