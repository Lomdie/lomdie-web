import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { WhyChoose } from "@/components/sections/why-choose";
import { ProfilesTeaser } from "@/components/sections/profiles-teaser";
import { MethodTeaser } from "@/components/sections/method-teaser";
import { TestimonialsTeaser } from "@/components/sections/testimonials-teaser";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { SocialSection } from "@/components/sections/social-section";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getSiteContent } from "@/lib/site-content";

const defaults = {
  "home.hero.eyebrow": "Matchmaking premium",
  "home.hero.title": "Créer des rencontres qui ont du sens.",
  "home.hero.subtitle":
    "Lomdie accompagne les célibataires de la diaspora camerounaise en France dans leur recherche d'une relation sérieuse, authentique et durable.",
};

export default async function Home() {
  const content = await getSiteContent(Object.keys(defaults));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero
          eyebrow={content["home.hero.eyebrow"] ?? defaults["home.hero.eyebrow"]}
          title={content["home.hero.title"] ?? defaults["home.hero.title"]}
          subtitle={content["home.hero.subtitle"] ?? defaults["home.hero.subtitle"]}
        />
        <WhyChoose />
        <ProfilesTeaser />
        <MethodTeaser />
        <TestimonialsTeaser />
        <AboutTeaser />
        <SocialSection />
        <NewsletterBand />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
