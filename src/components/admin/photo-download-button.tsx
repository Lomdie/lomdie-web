"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function PhotoDownloadButton({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      aria-label="Télécharger la photo"
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
      ) : (
        <Download className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
