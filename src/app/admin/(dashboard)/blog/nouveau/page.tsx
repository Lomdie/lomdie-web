import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Nouvel article" };

export default function AdminBlogNewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Nouvel article
          <HelpTooltip text="Le slug (adresse web) se génère automatiquement depuis le titre, mais vous pouvez le modifier. Enregistrez d'abord en brouillon pour pouvoir prévisualiser avant de publier." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rédigez votre article, puis publiez-le quand il est prêt.
        </p>
      </div>

      <BlogPostForm />
    </div>
  );
}
