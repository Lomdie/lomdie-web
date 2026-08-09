import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogArticleView } from "@/components/sections/blog-article-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createAuthedServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Prévisualisation" };

async function getPost(id: string) {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, content, cover_image_url, category, published_at, is_published")
    .eq("id", id)
    .maybeSingle();

  return data;
}

export default async function AdminBlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/70 bg-card px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={`/admin/blog/${id}`} className="gap-1.5" />}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Retour à l&apos;édition
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Prévisualisation
          <Badge variant={post.is_published ? "default" : "secondary"}>
            {post.is_published ? "Publié" : "Brouillon"}
          </Badge>
        </div>
      </div>

      <BlogArticleView post={post} />
    </div>
  );
}
