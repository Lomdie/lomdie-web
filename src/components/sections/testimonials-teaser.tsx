import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
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

export async function TestimonialsTeaser() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl">
            Ils ont vécu l&apos;expérience Lomdie
          </h2>
          <Link
            href="/temoignages"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Tous les témoignages
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>

        <div className="mt-10">
          <Carousel
            itemClassName="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            autoplayMs={6000}
            scrollByPage
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="h-full rounded-2xl border border-border/70 bg-card p-6"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
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
          </Carousel>
        </div>
      </div>
    </section>
  );
}
