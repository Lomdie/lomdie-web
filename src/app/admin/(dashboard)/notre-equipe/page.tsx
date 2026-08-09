import type { Metadata } from "next";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Notre équipe" };

async function getTeamMembers() {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("team_members")
    .select("id, name, role, bio, photo_url")
    .order("sort_order");

  return data ?? [];
}

export default async function AdminNotreEquipePage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Notre équipe
          <HelpTooltip text="Ceci gère les fiches publiques (photo, rôle, bio) de la page « À propos ». C'est différent de la page « Équipe » qui gère les accès de connexion à cet espace admin." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Photo, rôle et présentation affichés sur la page &quot;À
          propos&quot; du site public.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {members.map((member) => (
          <TeamMemberForm
            key={member.id}
            memberId={member.id}
            name={member.name}
            role={member.role}
            bio={member.bio ?? ""}
            photoUrl={member.photo_url}
          />
        ))}
      </div>
    </div>
  );
}
