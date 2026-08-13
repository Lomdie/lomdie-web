import { NextRequest } from "next/server";
import {
  CANDIDATE_PHOTO_BUCKET,
  candidateThumbnailPath,
  createCandidateThumbnail,
} from "@/lib/candidate-photo";
import { createAuthedServerClient } from "@/lib/supabase/server";

function isValidPhotoPath(path: string) {
  return path.length <= 500 && !path.startsWith("/") && !path.includes("..") && !path.startsWith("thumbnails/");
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") ?? "";
  const originalRequested = request.nextUrl.searchParams.get("variant") === "original";

  if (!isValidPhotoPath(path)) {
    return new Response("Photo invalide", { status: 400 });
  }

  const supabase = await createAuthedServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return new Response("Non autorisé", { status: 401 });
  }

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id")
    .contains("photo_urls", [path])
    .limit(1)
    .maybeSingle();

  if (!candidate) {
    return new Response("Photo introuvable", { status: 404 });
  }

  let output: Blob | Buffer;
  let contentType: string;

  if (originalRequested) {
    const { data, error } = await supabase.storage.from(CANDIDATE_PHOTO_BUCKET).download(path);
    if (error || !data) return new Response("Photo introuvable", { status: 404 });
    output = data;
    contentType = data.type || "application/octet-stream";
  } else {
    const thumbnailPath = candidateThumbnailPath(path);
    const thumbnailResult = await supabase.storage.from(CANDIDATE_PHOTO_BUCKET).download(thumbnailPath);

    if (thumbnailResult.data) {
      output = thumbnailResult.data;
    } else {
      const originalResult = await supabase.storage.from(CANDIDATE_PHOTO_BUCKET).download(path);
      if (originalResult.error || !originalResult.data) {
        return new Response("Photo introuvable", { status: 404 });
      }

      const thumbnail = await createCandidateThumbnail(await originalResult.data.arrayBuffer());
      const { error: uploadError } = await supabase.storage
        .from(CANDIDATE_PHOTO_BUCKET)
        .upload(thumbnailPath, thumbnail, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true,
        });
      if (uploadError) console.error("candidate-photo: thumbnail upload failed", uploadError);
      output = thumbnail;
    }
    contentType = "image/webp";
  }

  const bytes = output instanceof Blob
    ? new Uint8Array(await output.arrayBuffer())
    : new Uint8Array(output);

  return new Response(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": originalRequested
        ? "private, max-age=3600"
        : "private, max-age=604800, immutable",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
