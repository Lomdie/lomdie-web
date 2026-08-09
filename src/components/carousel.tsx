"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Carousel({
  children,
  itemClassName,
  autoplayMs,
  scrollByPage,
}: {
  children: ReactNode[];
  itemClassName: string;
  autoplayMs?: number;
  scrollByPage?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = scrollByPage ? el.clientWidth : (card?.offsetWidth ?? el.clientWidth) + 24;

    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (direction === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  useEffect(() => {
    if (!autoplayMs) return;
    const id = setInterval(() => scroll(1), autoplayMs);
    return () => clearInterval(id);
  }, [autoplayMs]);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div key={index} className={cn("shrink-0 snap-center", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll(-1)}
          aria-label="Précédent"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll(1)}
          aria-label="Suivant"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}
