import Link from "next/link";
import { Menu } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { SiteLogo } from "@/components/site-logo";

const navLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/nos-offres", label: "Nos offres" },
  { href: "/notre-methode", label: "Comment ça marche" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <SiteLogo />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <SocialLinks className="gap-2 sm:gap-3" />
          <Link href="/espace-membre" className="hidden h-7 items-center justify-center rounded-lg bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:inline-flex">
            Espace membre
          </Link>

          <details className="group relative lg:hidden">
            <summary className="flex size-8 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-muted" aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </summary>
            <nav className="absolute right-0 top-11 z-50 flex w-72 flex-col gap-1 rounded-xl border border-border/70 bg-background p-4 shadow-xl">
              <div className="mb-3 border-b border-border/70 pb-3"><SiteLogo /></div>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/espace-membre" className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
                  Espace membre
                </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
