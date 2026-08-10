"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CandidateTextCell({
  value,
  label,
}: {
  value: string | null;
  label: string;
}) {
  if (!value) return null;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="block w-full max-w-56 truncate rounded px-1 py-0.5 text-left hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary"
            title={`Lire ${label.toLowerCase()}`}
          />
        }
      >
        {value}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>{label}</DialogTitle>
        <DialogDescription className="sr-only">
          Contenu complet du champ {label.toLowerCase()}.
        </DialogDescription>
        <p className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6">
          {value}
        </p>
      </DialogContent>
    </Dialog>
  );
}
