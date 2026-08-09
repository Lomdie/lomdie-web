"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";

const updatePlanSchema = z.object({
  planId: z.string().uuid(),
  name: z.string().trim().min(1),
  description: z.string().trim(),
  price: z.string().trim(),
  isPopular: z.coerce.boolean(),
  features: z.string().trim(),
  notIncluded: z.string().trim(),
  ctaLabel: z.string().trim().min(1),
});

export interface UpdatePlanState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function updatePricingPlan(
  _prevState: UpdatePlanState,
  formData: FormData
): Promise<UpdatePlanState> {
  const parsed = updatePlanSchema.safeParse({
    planId: formData.get("planId"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    isPopular: formData.get("isPopular") === "on",
    features: formData.get("features"),
    notIncluded: formData.get("notIncluded"),
    ctaLabel: formData.get("ctaLabel"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Champs invalides." };
  }

  const priceValue = parsed.data.price === "" ? null : Number(parsed.data.price);
  if (priceValue !== null && Number.isNaN(priceValue)) {
    return { status: "error", message: "Le prix doit être un nombre, ou vide pour \"sur demande\"." };
  }

  const features = parsed.data.features
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const notIncluded = parsed.data.notIncluded
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const supabase = await createAuthedServerClient();
  const { error } = await supabase
    .from("pricing_plans")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: priceValue,
      is_popular: parsed.data.isPopular,
      features,
      not_included: notIncluded,
      cta_label: parsed.data.ctaLabel,
    })
    .eq("id", parsed.data.planId);

  if (error) {
    console.error("updatePricingPlan: update failed", error);
    return { status: "error", message: "La mise à jour a échoué." };
  }

  updateTag("pricing-plans");

  return { status: "success", message: "Offre mise à jour." };
}
