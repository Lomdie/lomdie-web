import { cacheLife, cacheTag } from "next/cache";
import { Star, MessageSquareHeart } from "lucide-react";
import { createServerReadClient } from "@/lib/supabase/server";

interface Testimonial {
  id: string;
  author_initials: string;
  quote: string;
  rating: number;
}

async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag("testimonials");
  cacheLife("hours");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_initials, quote, rating")
    .eq("is_published", true)
    .order("sort_order");

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function TestimonialsList() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return (
      <section className="bg-background">
        <div className="mx-auto max-w-md px-6 py-16 text-center">
          <MessageSquareHeart className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
          <p className="mt-4 font-display text-lg">
            Les premiers témoignages arrivent bientôt
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nos premières mises en relation sont encore récentes. Nous
            publierons les retours de nos membres dès qu&apos;ils
            souhaiteront les partager.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-2xl border border-border/70 bg-card p-6"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 fill-primary text-primary"
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              &laquo;&nbsp;{testimonial.quote}&nbsp;&raquo;
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {testimonial.author_initials}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
