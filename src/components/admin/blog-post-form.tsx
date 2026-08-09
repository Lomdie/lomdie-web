"use client";

import { useActionState, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createBlogPost,
  updateBlogPost,
  type BlogFormState,
} from "@/lib/actions/admin-blog";

const RichTextEditor = dynamic(() => import("@/components/admin/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-lg border border-border/70 text-sm text-muted-foreground">
      Chargement de l&apos;éditeur...
    </div>
  ),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface BlogPostFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  isPublished: boolean;
  coverImageUrl: string | null;
}

const emptyPost: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  isPublished: false,
  coverImageUrl: null,
};

const initialState: BlogFormState = { status: "idle" };

export function BlogPostForm({ post = emptyPost }: { post?: BlogPostFormValues }) {
  const isEditing = Boolean(post.id);
  const action = isEditing ? updateBlogPost : createBlogPost;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [content, setContent] = useState(post.content);
  const [coverPreview, setCoverPreview] = useState<string | null>(post.coverImageUrl);
  const [isPublished, setIsPublished] = useState(post.isPublished);

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-6">
      {isEditing && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />

      <div className="space-y-6 rounded-2xl border border-border/70 bg-card p-6">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) {
                setSlug(slugify(event.target.value));
              }
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (adresse de l&apos;article)</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
          />
          <p className="text-xs text-muted-foreground">
            lomdie.com/blog/{slug || "mon-article"}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="excerpt">Résumé</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={post.excerpt}
            placeholder="Affiché dans la liste des articles et sur les réseaux sociaux."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cover">Image de couverture</Label>
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-secondary/30">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Input
                id="cover"
                name="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setCoverPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou WebP, 8 Mo maximum. Format 16:9 recommandé.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Catégorie</Label>
          <Input
            id="category"
            name="category"
            defaultValue={post.category}
            placeholder="Ex. Conseils, Témoignages..."
            className="max-w-xs"
          />
        </div>

        <div className="min-w-0 space-y-1.5">
          <Label>Contenu de l&apos;article</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-6">
        <div className="space-y-1.5">
          <Label>Statut</Label>
          <div className="inline-flex rounded-lg border border-border/70 p-1">
            <button
              type="button"
              onClick={() => setIsPublished(false)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                !isPublished
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Brouillon
            </button>
            <button
              type="button"
              onClick={() => setIsPublished(true)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isPublished
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Publié
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isPublished
              ? "Visible par tous les visiteurs du site."
              : "Visible uniquement en prévisualisation, pas encore sur le site."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              render={
                <Link href={`/admin/blog/${post.id}/preview`} target="_blank" className="gap-1.5" />
              }
            >
              <Eye className="h-4 w-4" strokeWidth={1.5} />
              Prévisualiser
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer l'article"}
          </Button>
        </div>
      </div>

      {state.message && (
        <p
          className={
            state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
