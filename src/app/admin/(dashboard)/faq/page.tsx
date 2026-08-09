import type { Metadata } from "next";
import { FaqItemForm } from "@/components/admin/faq-item-form";
import { FaqCreateForm } from "@/components/admin/faq-create-form";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "FAQ" };

async function getFaqItems() {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("faq_items")
    .select("id, question, answer")
    .order("sort_order");

  return data ?? [];
}

export default async function AdminFaqPage() {
  const items = await getFaqItems();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          FAQ
          <HelpTooltip text="Ajoutez, modifiez ou supprimez les questions/réponses affichées sur la page FAQ du site. L'ordre d'affichage suit l'ordre de création." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces questions apparaissent sur la page FAQ du site public.
        </p>
      </div>

      <FaqCreateForm />

      <div className="space-y-4">
        {items.map((item) => (
          <FaqItemForm
            key={item.id}
            id={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
