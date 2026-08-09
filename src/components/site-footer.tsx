import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { SocialLinks, WhatsAppIcon } from "@/components/social-links";
import { SiteLogo } from "@/components/site-logo";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/nos-offres", label: "Nos offres" },
  { href: "/notre-methode", label: "Comment ça marche" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cgu", label: "Conditions d'utilisation" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <SiteLogo />
          <p className="text-sm text-muted-foreground">
            Le service de matchmaking dédié à la diaspora camerounaise en France.
          </p>
          <SocialLinks className="pt-2" />
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-foreground">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-foreground">
            Informations
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-foreground">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              contact@lomdie.com
            </li>
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              <Link
                href="https://wa.me/33752234821"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                +33 7 52 23 48 21
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              Paris, France
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
© 2026 Lomdie. Tous droits réservés.
      </div>
    </footer>
  );
}
