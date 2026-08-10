"use client";

import { useState } from "react";

export function CandidateTextCell({
  value,
  label,
}: {
  value: string | null;
  label: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!value) return null;

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? "Réduire" : "Lire"} ${label.toLowerCase()}`}
      onClick={() => setIsExpanded((expanded) => !expanded)}
      className={`block rounded px-1 py-0.5 text-left align-top hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary ${
        isExpanded
          ? "w-96 whitespace-pre-wrap break-words leading-6"
          : "w-56 truncate"
      }`}
    >
      {value}
    </button>
  );
}
