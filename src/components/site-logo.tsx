import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/images/logo-lomdie.png"
        alt="Lomdie — Rencontres de qualité"
        width={1498}
        height={450}
        priority
        className="h-auto w-[10.5rem] sm:w-[12.5rem]"
      />
    </Link>
  );
}
