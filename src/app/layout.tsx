import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "normal",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

const description =
  "Lomdie accompagne les célibataires de la diaspora camerounaise dans leur recherche d'une relation sérieuse, authentique et durable.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lomdie — Rencontres de qualité",
    template: "%s — Lomdie",
  },
  description,
  openGraph: {
    title: "Lomdie — Rencontres de qualité",
    description,
    siteName: "Lomdie",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lomdie — Rencontres de qualité",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
