"use client";

import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTestimonial } from "@/lib/actions/admin-testimonials";

export function TestimonialRow({
  id,
  authorInitials,
  quote,
  rating,
}: {
  id: string;
  authorInitials: string;
  quote: string;
  rating: number;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5">
      <div>
        <div className="flex gap-0.5">
          {Array.from({ length: rating }).map((_, index) => (
            <Star key={index} className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={0} />
          ))}
        </div>
        <p className="mt-2 text-sm">&laquo;&nbsp;{quote}&nbsp;&raquo;</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {authorInitials}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Supprimer ce témoignage"
        onClick={() => deleteTestimonial(id)}
      >
        <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
      </Button>
    </div>
  );
}
