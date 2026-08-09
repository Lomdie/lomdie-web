"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { createAuthedServerClient } from "@/lib/supabase/server";

const blogPostSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().optional(),
  category: z.string().trim().max(80).optional(),
  isPublished: z.boolean(),
});

export interface BlogFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

const MAX_COVER_SIZE = 8 * 1024 * 1024;
const ALLOWED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadCoverImage(
  supabase: Awaited<ReturnType<typeof createAuthedServerClient>>,
  slug: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  if (file.size > MAX_COVER_SIZE) {
    return { error: "L'image de couverture ne doit pas dépasser 8 Mo." };
  }
  if (!ALLOWED_COVER_TYPES.includes(file.type)) {
    return { error: "Formats acceptés pour la couverture : JPG, PNG, WebP." };
  }

  const extension = file.type.split("/")[1];
  const path = `covers/${slug}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("blog-assets")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("uploadCoverImage failed", uploadError);
    return { error: "L'envoi de l'image de couverture a échoué." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("blog-assets").getPublicUrl(path);

  return { url: publicUrl };
}

function parseFormData(formData: FormData) {
  return blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    category: formData.get("category") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });
}

export async function createBlogPost(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const supabase = await createAuthedServerClient();

  const insertData: Record<string, unknown> = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
    category: parsed.data.category || null,
    is_published: parsed.data.isPublished,
    published_at: parsed.data.isPublished ? new Date().toISOString() : null,
  };

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    const { url, error } = await uploadCoverImage(supabase, parsed.data.slug, cover);
    if (error) {
      return { status: "error", message: error };
    }
    insertData.cover_image_url = url;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    console.error("createBlogPost failed", error);
    if (error.code === "23505") {
      return { status: "error", message: "Ce slug existe déjà, choisissez-en un autre." };
    }
    return { status: "error", message: "La création a échoué." };
  }

  updateTag("blog-posts");
  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlogPost(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const id = formData.get("id") as string;
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const supabase = await createAuthedServerClient();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("is_published, published_at")
    .eq("id", id)
    .single();

  const updateData: Record<string, unknown> = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
    category: parsed.data.category || null,
    is_published: parsed.data.isPublished,
    published_at:
      parsed.data.isPublished && !existing?.published_at
        ? new Date().toISOString()
        : (existing?.published_at ?? null),
  };

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    const { url, error } = await uploadCoverImage(supabase, parsed.data.slug, cover);
    if (error) {
      return { status: "error", message: error };
    }
    updateData.cover_image_url = url;
  }

  const { error } = await supabase.from("blog_posts").update(updateData).eq("id", id);

  if (error) {
    console.error("updateBlogPost failed", error);
    if (error.code === "23505") {
      return { status: "error", message: "Ce slug existe déjà, choisissez-en un autre." };
    }
    return { status: "error", message: "La mise à jour a échoué." };
  }

  updateTag("blog-posts");
  return { status: "success", message: "Article enregistré." };
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await createAuthedServerClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  updateTag("blog-posts");
}
