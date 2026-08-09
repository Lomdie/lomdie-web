import { NextResponse } from "next/server";
import { createAuthedServerClient } from "@/lib/supabase/server";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const supabase = await createAuthedServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "L'image ne doit pas dépasser 8 Mo." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formats acceptés : JPG, PNG, WebP, GIF." },
      { status: 400 }
    );
  }

  const extension = file.type.split("/")[1];
  const path = `content/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("blog-assets")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    console.error("upload-image: upload failed", uploadError);
    return NextResponse.json({ error: "L'envoi de l'image a échoué." }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("blog-assets").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
