import type { Metadata } from "next";
import { InviteTeamForm } from "@/components/admin/invite-team-form";
import { TeamMemberRow } from "@/components/admin/team-member-row";
import {
  createAuthedServerClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Équipe" };

async function getTeam() {
  const authed = await createAuthedServerClient();
  const {
    data: { user: currentUser },
  } = await authed.auth.getUser();

  const admin = createServiceRoleClient();
  const { data } = await admin.auth.admin.listUsers();

  return {
    currentUserId: currentUser?.id,
    users: data?.users ?? [],
  };
}

export default async function AdminEquipePage() {
  const { currentUserId, users } = await getTeam();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Équipe
          <HelpTooltip text="Invitez une nouvelle personne par email : elle recevra un lien pour créer son propre mot de passe et se connecter. Toute personne invitée a un accès complet à cet espace admin (candidatures, contenu, offres...)." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les personnes qui ont accès à cet espace pour gérer le site et les
          candidatures.
        </p>
      </div>

      <InviteTeamForm />

      <div className="space-y-3">
        {users.map((user) => (
          <TeamMemberRow
            key={user.id}
            id={user.id}
            email={user.email ?? ""}
            hasAcceptedInvite={Boolean(user.last_sign_in_at)}
            isCurrentUser={user.id === currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
