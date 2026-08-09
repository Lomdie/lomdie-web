"use server";

import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";

const newsletterSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
});

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { status: "error", message: "Merci de renseigner une adresse email valide." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email });

  if (error && error.code !== "23505") {
    console.error("subscribeNewsletter: insert failed", error);
    return {
      status: "error",
      message: "Une erreur est survenue. Merci de réessayer dans quelques instants.",
    };
  }

  return { status: "success", message: "Merci, vous êtes inscrit(e) !" };
}
