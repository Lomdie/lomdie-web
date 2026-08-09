"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";

const testimonialSchema = z.object({
  authorInitials: z.string().trim().min(1, "Les initiales sont requises"),
  quote: z.string().trim().min(1, "Le témoignage est requis"),
  rating: z.coerce.number().int().min(1).max(5),
});

export interface TestimonialFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const parsed = testimonialSchema.safeParse({
    authorInitials: formData.get("authorInitials"),
    quote: formData.get("quote"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Merci de vérifier les champs." };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase.from("testimonials").insert({
    author_initials: parsed.data.authorInitials,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
  });

  if (error) {
    console.error("createTestimonial failed", error);
    return { status: "error", message: "L'ajout a échoué." };
  }

  updateTag("testimonials");
  return { status: "success", message: "Témoignage ajouté." };
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createAuthedServerClient();
  await supabase.from("testimonials").delete().eq("id", id);
  updateTag("testimonials");
}
