import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/images/logo-lomdie-badge.png"
        alt="Lomdie — Rencontres de qualité"
        width={1192}
        height={1192}
        priority
        className="h-14 w-14 sm:h-16 sm:w-16"
      />
    </Link>
  );
}
