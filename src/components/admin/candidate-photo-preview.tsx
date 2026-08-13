"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PhotoDownloadButton } from "@/components/admin/photo-download-button";

export function CandidatePhotoPreview({
  paths,
  candidateName,
}: {
  paths: string[];
  candidateName: string;
}) {
  if (paths.length === 0) return null;

  return (
    <div className="flex min-w-24 gap-1.5">
      {paths.map((path, index) => (
        <CandidatePhotoDialog key={path} path={path} index={index} candidateName={candidateName} />
      ))}
    </div>
  );
}

function photoUrl(path: string, variant: "thumbnail" | "original") {
  const params = new URLSearchParams({ path });
  if (variant === "original") params.set("variant", "original");
  return `/api/admin/candidate-photo?${params.toString()}`;
}

function CandidatePhotoDialog({
  path,
  index,
  candidateName,
}: {
  path: string;
  index: number;
  candidateName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative h-12 w-10 shrink-0">
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="relative h-12 w-10 overflow-hidden rounded-md border border-border bg-secondary focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={`Agrandir la photo ${index + 1} de ${candidateName}`}
              />
            }
          >
            <Image src={photoUrl(path, "thumbnail")} alt="" fill sizes="40px" className="object-cover" unoptimized />
          </DialogTrigger>
          <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
            <DialogTitle className="sr-only">
              Photo {index + 1} de {candidateName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Photo privée réservée à l’équipe Lomdie.
            </DialogDescription>
            {open ? <div className="relative h-[80vh] w-full overflow-hidden rounded-xl bg-ink/95">
              <Image
                src={photoUrl(path, "original")}
                alt={`Photo ${index + 1} de ${candidateName}`}
                fill
                sizes="90vw"
                className="object-contain"
                unoptimized
              />
            </div> : null}
          </DialogContent>
      </Dialog>
      <PhotoDownloadButton
        url={photoUrl(path, "original")}
        filename={`${candidateName.replace(/\s+/g, "-").toLowerCase()}-photo-${index + 1}.jpg`}
        className="right-0.5 top-0.5 h-6 w-6"
      />
    </div>
  );
}
