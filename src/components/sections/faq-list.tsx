import { cacheLife, cacheTag } from "next/cache";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createServerReadClient } from "@/lib/supabase/server";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

async function getFaqItems(): Promise<FaqItem[]> {
  "use cache";
  cacheTag("faq-items");
  cacheLife("hours");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer")
    .eq("is_published", true)
    .order("sort_order");

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function FaqList() {
  const items = await getFaqItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Accordion multiple={false}>
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-display text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
