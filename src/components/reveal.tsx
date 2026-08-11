import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700",
        className
      )}
      style={delay ? { animationDelay: `${delay}s`, animationFillMode: "both" } : undefined}
    >
      {children}
    </div>
  );
}

interface RevealGroupProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  stagger?: number;
}

export function RevealGroup({
  children,
  className,
  itemClassName,
  stagger = 0.1,
}: RevealGroupProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} delay={index * stagger} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
