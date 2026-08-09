import Image from "next/image";
import { sanitizeContentHtml } from "@/lib/sanitize-html";

export interface BlogArticleData {
  title: string;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
}

export async function BlogArticleView({ post }: { post: BlogArticleData }) {
  const safeContent = post.content ? await sanitizeContentHtml(post.content) : "";

  return (
    <article className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {post.category && (
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            {post.category}
          </p>
        )}
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.published_at && (
          <p className="mt-4 text-sm text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {post.cover_image_url && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="blog-content mt-10"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </div>
    </article>
  );
}
