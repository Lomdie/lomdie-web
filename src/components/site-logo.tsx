import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/images/logo-lomdie-v3.png"
        alt="Lomdie — Rencontres de qualité"
        width={858}
        height={291}
        priority
        className="h-auto w-40 sm:w-[10.125rem]"
      />
    </Link>
  );
}
