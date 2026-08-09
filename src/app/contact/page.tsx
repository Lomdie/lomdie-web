import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Parlons de votre avenir sentimental. Notre équipe est à votre écoute.",
};

const infos = [
  { icon: Mail, content: "contact@lomdie.com" },
  {
    icon: Phone,
    content: (
      <Link
        href="https://wa.me/33752234821"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary"
      >
        +33 7 52 23 48 21
      </Link>
    ),
  },
  { icon: MapPin, content: "Paris, France" },
  { icon: Clock, content: "Lun - Ven : 9h - 20h · Sam : 10h - 17h" },
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Contact
            </p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">
              Parlons de votre avenir sentimental.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Notre équipe est à votre écoute.
            </p>

            <ul className="mt-10 space-y-4">
              {infos.map(({ icon: Icon, content }, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  {content}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-8">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
