import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { DeleteBlogPostButton } from "@/components/admin/delete-blog-post-button";
import { HelpTooltip } from "@/components/admin/help-tooltip";
import { BlogFilters } from "@/components/admin/blog-filters";

export const metadata: Metadata = { title: "Blog" };

interface BlogPostRow {
  id: string;
  title: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface SearchParams {
  q?: string;
  status?: string;
  category?: string;
}

async function getBlogPosts(filters: SearchParams): Promise<BlogPostRow[]> {
  const supabase = await createAuthedServerClient();
  let query = supabase
    .from("blog_posts")
    .select("id, title, category, is_published, published_at, created_at")
    .order("created_at", { ascending: false });

  if (filters.status === "published") {
    query = query.eq("is_published", true);
  } else if (filters.status === "draft") {
    query = query.eq("is_published", false);
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.q) {
    query = query.ilike("title", `%${filters.q.trim()}%`);
  }

  const { data } = await query;
  return data ?? [];
}

async function getCategories(): Promise<string[]> {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("category")
    .not("category", "is", null);

  const unique = new Set((data ?? []).map((row) => row.category as string));
  return Array.from(unique).sort();
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const [posts, categories] = await Promise.all([
    getBlogPosts(filters),
    getCategories(),
  ]);
  const hasActiveFilters = Boolean(filters.q || filters.status || filters.category);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl">
            Blog
            <HelpTooltip text="Créez un article, rédigez-le avec l'éditeur riche, ajoutez une image de couverture, puis choisissez « Brouillon » pour le préparer tranquillement ou « Publié » pour le rendre visible sur le site. Le bouton « Prévisualiser » montre le rendu final avant publication." />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rédigez et publiez les articles affichés sur le blog du site public.
          </p>
        </div>
        <Button render={<Link href="/admin/blog/nouveau" className="gap-1.5" />}>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Nouvel article
        </Button>
      </div>

      <BlogFilters categories={categories} />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Aucun article ne correspond à ces filtres."
              : "Aucun article pour le moment. Créez le premier avec le bouton ci-dessus."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Créé le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-45 sm:max-w-none">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {post.category || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? "default" : "secondary"}>
                      {post.is_published ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {new Date(post.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteBlogPostButton id={post.id} title={post.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
