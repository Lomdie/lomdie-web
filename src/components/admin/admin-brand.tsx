import Image from "next/image";
import { cn } from "@/lib/utils";
import lomdieLogo from "../../../public/images/logo-lomdie-v3.png";

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
      src={lomdieLogo}
      alt="Lomdie — Rencontres de qualité"
      width={858}
      height={291}
      unoptimized
      className={cn("h-auto w-32 object-contain", className)}
    />
  );
}
