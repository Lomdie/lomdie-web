import "server-only";

import sharp from "sharp";

export const CANDIDATE_PHOTO_BUCKET = "candidate-photos";

export function candidateThumbnailPath(originalPath: string) {
  const pathWithoutExtension = originalPath.replace(/\.[^/.]+$/, "");
  return `thumbnails/${pathWithoutExtension}.webp`;
}

export async function createCandidateThumbnail(input: ArrayBuffer | Uint8Array) {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
  return sharp(bytes)
    .rotate()
    .resize({
      width: 320,
      height: 400,
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    })
    .webp({ quality: 72, effort: 4 })
    .toBuffer();
}
