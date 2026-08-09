import type { Metadata } from "next";
import { TestimonialCreateForm } from "@/components/admin/testimonial-create-form";
import { TestimonialRow } from "@/components/admin/testimonial-row";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Témoignages" };

async function getTestimonials() {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, author_initials, quote, rating")
    .order("sort_order");

  return data ?? [];
}

export default async function AdminTemoignagesPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Témoignages
          <HelpTooltip text="Les initiales seules suffisent (jamais de nom complet, pour la discrétion des membres). Utilisez le nombre d'étoiles pour la note. Reformulez toujours les retours clients avec leur sens d'origine, jamais un copier-coller de conversation WhatsApp." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reformulez toujours les retours clients avec leur sens d&apos;origine,
          jamais un copier-coller de conversation WhatsApp.
        </p>
      </div>

      <TestimonialCreateForm />

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <TestimonialRow
            key={testimonial.id}
            id={testimonial.id}
            authorInitials={testimonial.author_initials}
            quote={testimonial.quote}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </div>
  );
}
