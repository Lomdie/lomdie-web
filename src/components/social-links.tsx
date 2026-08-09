import Link from "next/link";
import { cn } from "@/lib/utils";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.2 10v6.3M8.2 7.7v.02M12.1 16.3V10M12.1 12.6c0-1.5 1-2.6 2.3-2.6 1.3 0 2.1.9 2.1 2.5v3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.6 8.4h1.4V6.1h-1.6c-1.7 0-2.8 1-2.8 2.8v1.4H9.1v2.3h1.5V18h2.3v-5.4h1.6l.3-2.3h-1.9V9.1c0-.5.2-.7.7-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.5 3.5c.4 1.9 1.7 3.2 3.7 3.5v2.6c-1.3.1-2.6-.3-3.7-1v6.1c0 2.9-2.1 5.1-4.9 5.1-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c.3 0 .6 0 .9.1v2.7a2.3 2.3 0 0 0-.9-.2 2.4 2.4 0 1 0 2.3 3.2c.1-.3.1-.6.1-.9V3.5h2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppIcon({
  className,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.34 12.77L3.5 20.5l4.36-1.14A8.5 8.5 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.7 8.4c.2-.4.4-.5.7-.5h.5c.2 0 .4 0 .5.4.2.5.6 1.6.6 1.7.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.2.1.4.1.5-.1.2-.2.6-.7.8-1 .2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.3.1.2.1.9-.2 1.4-.3.5-1.4 1.1-1.9 1.1-.5 0-1.1.1-3.5-1-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1-1.3-1-2.5 0-1.2.6-1.8.8-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socials = [
  { href: "https://www.instagram.com/lomdielove/", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.linkedin.com/company/lomdie", label: "LinkedIn", icon: LinkedInIcon },
  {
    href: "https://www.facebook.com/profile.php?id=61591510172762",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://www.tiktok.com/@lomdie_officiel",
    label: "TikTok",
    icon: TikTokIcon,
  },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socials.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon className="h-[18px] w-[18px]" />
        </Link>
      ))}
    </div>
  );
}
