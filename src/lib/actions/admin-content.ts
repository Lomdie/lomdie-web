"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim().min(1, "Ce champ ne peut pas être vide"),
});

export interface UpdateContentState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function updateSiteContent(
  _prevState: UpdateContentState,
  formData: FormData
): Promise<UpdateContentState> {
  const parsed = updateSchema.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Champ invalide.",
    };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase
    .from("site_content")
    .update({ value: parsed.data.value })
    .eq("key", parsed.data.key);

  if (error) {
    console.error("updateSiteContent failed", error);
    return { status: "error", message: "La mise à jour a échoué." };
  }

  updateTag("site-content");
  return { status: "success", message: "Enregistré." };
}
