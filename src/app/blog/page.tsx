import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { Newspaper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/sections/page-header";
import { createServerReadClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils et inspiration pour construire une relation épanouissante.",
};

interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
}

async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  "use cache";
  cacheTag("blog-posts");
  cacheLife("minutes");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, category, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          eyebrow="Blog"
          title="Conseils & inspiration"
          description="Nos articles pour vous accompagner vers une relation épanouissante."
        />

        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16">
            {posts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-video overflow-hidden bg-secondary/30">
                      {post.cover_image_url ? (
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Newspaper className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {post.category && (
                        <p className="text-xs font-medium uppercase tracking-wide text-primary">
                          {post.category}
                        </p>
                      )}
                      <h2 className="mt-2 font-display text-lg leading-snug group-hover:text-primary">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                      {post.published_at && (
                        <p className="mt-4 text-xs text-muted-foreground">
                          {new Date(post.published_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md text-center">
                <Newspaper className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
                <p className="mt-4 font-display text-lg">Premiers articles à venir</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nous préparons nos premiers contenus. Revenez bientôt.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
