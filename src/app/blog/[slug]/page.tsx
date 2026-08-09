import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { BlogArticleView, type BlogArticleData } from "@/components/sections/blog-article-view";
import { createServerReadClient } from "@/lib/supabase/server";

async function getPostBySlug(slug: string): Promise<(BlogArticleData & { excerpt: string | null }) | null> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("title, excerpt, content, cover_image_url, category, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article introuvable" };
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogArticleView post={post} />;
}

function BlogPostSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
      <div className="mt-3 h-10 w-full animate-pulse rounded bg-secondary" />
      <div className="mt-8 aspect-video w-full animate-pulse rounded-2xl bg-secondary" />
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<BlogPostSkeleton />}>
          <BlogPostContent slug={slug} />
        </Suspense>
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
