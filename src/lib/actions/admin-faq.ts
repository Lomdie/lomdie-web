"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";

const faqSchema = z.object({
  question: z.string().trim().min(1, "La question est requise"),
  answer: z.string().trim().min(1, "La réponse est requise"),
});

export interface FaqFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function createFaqItem(
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Merci de remplir la question et la réponse." };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase.from("faq_items").insert({
    question: parsed.data.question,
    answer: parsed.data.answer,
  });

  if (error) {
    console.error("createFaqItem failed", error);
    return { status: "error", message: "L'ajout a échoué." };
  }

  updateTag("faq-items");
  return { status: "success", message: "Question ajoutée." };
}

export async function updateFaqItem(
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  const id = formData.get("id") as string;
  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Merci de remplir la question et la réponse." };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase
    .from("faq_items")
    .update({ question: parsed.data.question, answer: parsed.data.answer })
    .eq("id", id);

  if (error) {
    console.error("updateFaqItem failed", error);
    return { status: "error", message: "La mise à jour a échoué." };
  }

  updateTag("faq-items");
  return { status: "success", message: "Question mise à jour." };
}

export async function deleteFaqItem(id: string): Promise<void> {
  const supabase = await createAuthedServerClient();
  await supabase.from("faq_items").delete().eq("id", id);
  updateTag("faq-items");
}
