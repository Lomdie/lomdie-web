import Link from "next/link";
import { Reveal } from "@/components/reveal";
import {
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
  TikTokIcon,
} from "@/components/social-links";

const socials = [
  {
    href: "https://www.instagram.com/lomdielove/",
    label: "Instagram",
    handle: "@lomdielove",
    icon: InstagramIcon,
  },
  {
    href: "https://www.linkedin.com/company/lomdie",
    label: "LinkedIn",
    handle: "Lomdie",
    icon: LinkedInIcon,
  },
  {
    href: "https://www.facebook.com/profile.php?id=61591510172762",
    label: "Facebook",
    handle: "Lomdie",
    icon: FacebookIcon,
  },
  {
    href: "https://www.tiktok.com/@lomdie_officiel",
    label: "TikTok",
    handle: "@lomdie_officiel",
    icon: TikTokIcon,
  },
];

export function SocialSection() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Suivez-nous
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">
            Retrouvez-nous sur les réseaux
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {socials.map(({ href, label, handle, icon: Icon }, index) => (
            <Reveal key={label} delay={index * 0.08}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card px-8 py-6 transition-shadow hover:shadow-md"
              >
                <Icon className="h-9 w-9 text-primary" />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{handle}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
