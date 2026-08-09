"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { createAuthedServerClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  memberId: z.string().uuid(),
  name: z.string().trim().min(1, "Le nom est requis"),
  role: z.string().trim().min(1, "Le rôle est requis"),
  bio: z.string().trim().max(2000),
});

export interface UpdateTeamMemberState {
  status: "idle" | "success" | "error";
  message?: string;
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function updateTeamMember(
  _prevState: UpdateTeamMemberState,
  formData: FormData
): Promise<UpdateTeamMemberState> {
  const parsed = updateSchema.safeParse({
    memberId: formData.get("memberId"),
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const supabase = await createAuthedServerClient();

  const updates: Record<string, string> = {
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio,
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_SIZE) {
      return { status: "error", message: "La photo ne doit pas dépasser 5 Mo." };
    }
    if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
      return { status: "error", message: "Formats acceptés : JPG, PNG, WebP." };
    }

    const extension = photo.type.split("/")[1];
    const path = `${parsed.data.memberId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("team-photos")
      .upload(path, photo, { upsert: true, contentType: photo.type });

    if (uploadError) {
      console.error("updateTeamMember: photo upload failed", uploadError);
      return { status: "error", message: "L'envoi de la photo a échoué." };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("team-photos").getPublicUrl(path);
    updates.photo_url = publicUrl;
  }

  const { error } = await supabase
    .from("team_members")
    .update(updates)
    .eq("id", parsed.data.memberId);

  if (error) {
    console.error("updateTeamMember: update failed", error);
    return { status: "error", message: "La mise à jour a échoué." };
  }

  updateTag("team-members");
  return { status: "success", message: "Profil mis à jour." };
}
