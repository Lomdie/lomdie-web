"use client";

import { useState, type MouseEvent } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoDownloadButton({
  url,
  filename,
  className,
}: {
  url: string;
  filename: string;
  className?: string;
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setDownloading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Le téléchargement a échoué.");
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
      title="Télécharger la photo"
      className={cn(
        "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-background opacity-100 shadow-sm transition-opacity hover:bg-ink focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100",
        className
      )}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
      ) : (
        <Download className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
