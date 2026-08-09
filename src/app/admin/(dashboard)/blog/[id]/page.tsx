import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Modifier l'article" };

async function getBlogPost(id: string) {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, category, is_published, cover_image_url")
    .eq("id", id)
    .maybeSingle();

  return data;
}

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Modifier l&apos;article
          <HelpTooltip text="Modifiez le contenu avec l'éditeur riche, changez l'image de couverture, puis basculez sur « Publié » quand l'article est prêt à être vu sur le site. « Prévisualiser » montre le rendu final avant publication." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{post.title}</p>
      </div>

      <BlogPostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          category: post.category ?? "",
          isPublished: post.is_published,
          coverImageUrl: post.cover_image_url,
        }}
      />
    </div>
  );
}
