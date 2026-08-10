"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CandidatePhotoPreview({
  urls,
  candidateName,
}: {
  urls: string[];
  candidateName: string;
}) {
  if (urls.length === 0) return <span className="text-muted-foreground">—</span>;

  return (
    <div className="flex min-w-24 gap-1.5">
      {urls.map((url, index) => (
        <Dialog key={url}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-secondary focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={`Agrandir la photo ${index + 1} de ${candidateName}`}
              />
            }
          >
            <Image src={url} alt="" fill sizes="40px" className="object-cover" unoptimized />
          </DialogTrigger>
          <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
            <DialogTitle className="sr-only">
              Photo {index + 1} de {candidateName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Photo privée réservée à l’équipe Lomdie.
            </DialogDescription>
            <div className="relative h-[80vh] w-full overflow-hidden rounded-xl bg-ink/95">
              <Image
                src={url}
                alt={`Photo ${index + 1} de ${candidateName}`}
                fill
                sizes="90vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
