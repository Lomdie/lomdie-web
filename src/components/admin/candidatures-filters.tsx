"use client";

import { useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { candidateStatuses, candidateStatusLabels } from "@/lib/candidate-status";

export function CandidaturesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-48 flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        <Input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(event) => updateParam("q", event.target.value)}
          placeholder="Nom ou email..."
          className="pl-8"
        />
      </div>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(event) => updateParam("status", event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Tous les statuts</option>
        {candidateStatuses.map((status) => (
          <option key={status} value={status}>
            {candidateStatusLabels[status]}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("gender") ?? ""}
        onChange={(event) => updateParam("gender", event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Tous les genres</option>
        <option value="femme">Femme</option>
        <option value="homme">Homme</option>
      </select>

      <select
        defaultValue={searchParams.get("visible") ?? ""}
        onChange={(event) => updateParam("visible", event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Visibilité : toutes</option>
        <option value="yes">Visible publiquement</option>
        <option value="no">Non visible</option>
      </select>

      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => router.push(pathname)}
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
