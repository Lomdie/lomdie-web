"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLinkCard({
  icon,
  label,
  path,
}: {
  icon: ReactNode;
  label: string;
  path: string;
}) {
  const [copied, setCopied] = useState(false);
  // Ces liens pointent toujours vers le site public, jamais vers admin.lomdie.com
  // (sinon le middleware admin redirigerait vers une route /admin inexistante).
  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://lomdie.com";
  const url = `${publicOrigin}${path}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-4">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{url}</p>
      </div>
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
        {copied ? (
          <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
        {copied ? "Copié" : "Copier"}
      </Button>
    </div>
  );
}
