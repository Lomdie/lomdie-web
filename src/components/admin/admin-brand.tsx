import Image from "next/image";
import { cn } from "@/lib/utils";

export function AdminBrand({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <Image
        src="/icon.png"
        alt="Lomdie"
        width={32}
        height={32}
        className={cn("h-7 w-7 shrink-0 object-contain", className)}
      />
    );
  }

  return (
    <Image
      src="/images/logo-lomdie-v3.png"
      alt="Lomdie — Rencontres de qualité"
      width={858}
      height={291}
      className={cn("h-auto w-32 object-contain", className)}
    />
  );
}
