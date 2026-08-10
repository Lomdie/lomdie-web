"use server";

import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendContactConfirmationEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  email: z.string().trim().email("Adresse email invalide"),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1, "Le message est requis").max(2000),
});

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof contactSchema>;
      fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Merci de corriger les champs indiqués." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error("submitContact: insert failed", error);
    return {
      status: "error",
      message: "Une erreur est survenue. Merci de réessayer dans quelques instants.",
    };
  }

  await sendContactConfirmationEmail(parsed.data.email, parsed.data.name);

  return {
    status: "success",
    message: "Votre message a bien été envoyé. Notre équipe vous répondra rapidement.",
  };
}
