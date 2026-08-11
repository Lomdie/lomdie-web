import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HeroMotion({ children }: { children: ReactNode }) {
  return (
    <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
      {children}
    </div>
  );
}

export function HeroImageMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700",
        className
      )}
      style={{ animationDelay: "0.15s", animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}
