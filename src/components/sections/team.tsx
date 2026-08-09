import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { createServerReadClient } from "@/lib/supabase/server";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
}

async function getTeamMembers(): Promise<TeamMember[]> {
  "use cache";
  cacheTag("team-members");
  cacheLife("hours");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, bio, photo_url")
    .order("sort_order");

  if (error) {
    return [];
  }

  return data ?? [];
}

function MemberPhoto({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
        <Image src={photoUrl} alt={name} fill sizes="80px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-display text-2xl text-primary">
      {name.charAt(0)}
    </div>
  );
}

export async function Team() {
  const team = await getTeamMembers();

  if (team.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Notre équipe
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">
            Deux personnes, une même exigence
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {team.map((member) => (
            <div key={member.id} className="text-center">
              <MemberPhoto name={member.name} photoUrl={member.photo_url} />
              <h3 className="mt-4 font-display text-lg">{member.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                {member.role}
              </p>
              {member.bio && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
