"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient, createAuthedServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

const inviteSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
});

export interface InviteTeamMemberState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function inviteTeamMember(
  _prevState: InviteTeamMemberState,
  formData: FormData
): Promise<InviteTeamMemberState> {
  const parsed = inviteSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { status: "error", message: "Adresse email invalide." };
  }

  // Seul un membre deja authentifie peut inviter quelqu'un d'autre.
  const authed = await createAuthedServerClient();
  const {
    data: { user },
  } = await authed.auth.getUser();

  if (!user) {
    return { status: "error", message: "Vous devez être connecté." };
  }

  const admin = createServiceRoleClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/admin/nouveau-mot-de-passe`,
  });

  if (error) {
    console.error("inviteTeamMember failed", error);
    return {
      status: "error",
      message:
        error.message.includes("already been registered") || error.code === "email_exists"
          ? "Cette adresse a déjà un compte."
          : "L'invitation n'a pas pu être envoyée.",
    };
  }

  revalidatePath("/admin/equipe");
  return {
    status: "success",
    message: `Invitation envoyée à ${parsed.data.email}.`,
  };
}

export async function removeTeamMember(userId: string): Promise<void> {
  const admin = createServiceRoleClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin/equipe");
}
