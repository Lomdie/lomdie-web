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
      if (key !== "page") params.delete("page");
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

  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => !["page", "sort"].includes(key)
  );
  const selectClassName = "h-9 rounded-md border border-input bg-background px-3 text-sm";

  return (
    <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4">
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
        className={selectClassName}
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
        className={selectClassName}
      >
        <option value="">Tous les genres</option>
        <option value="femme">Femme</option>
        <option value="homme">Homme</option>
      </select>

      <select
        defaultValue={searchParams.get("visible") ?? ""}
        onChange={(event) => updateParam("visible", event.target.value)}
        className={selectClassName}
      >
        <option value="">Visibilité : toutes</option>
        <option value="yes">Visible publiquement</option>
        <option value="no">Non visible</option>
      </select>

      <select
        value={searchParams.get("sort") ?? "date_desc"}
        onChange={(event) =>
          updateParam("sort", event.target.value === "date_desc" ? "" : event.target.value)
        }
        className={selectClassName}
        aria-label="Trier par date de candidature"
      >
        <option value="date_desc">Plus récentes d’abord</option>
        <option value="date_asc">Plus anciennes d’abord</option>
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

      <details open={hasFilters && Array.from(searchParams.keys()).some((key) => !["q", "status", "gender", "visible", "page", "sort"].includes(key))}>
        <summary className="cursor-pointer text-sm font-medium text-primary">
          Filtres avancés de matching
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input defaultValue={searchParams.get("city") ?? ""} onChange={(e) => updateParam("city", e.target.value)} placeholder="Ville" />
          <Input defaultValue={searchParams.get("country") ?? ""} onChange={(e) => updateParam("country", e.target.value)} placeholder="Pays" />
          <Input defaultValue={searchParams.get("occupation") ?? ""} onChange={(e) => updateParam("occupation", e.target.value)} placeholder="Métier" />
          <select defaultValue={searchParams.get("marital") ?? ""} onChange={(e) => updateParam("marital", e.target.value)} className={selectClassName}>
            <option value="">Toutes situations</option>
            <option value="celibataire">Célibataire</option>
            <option value="divorce">Divorcé(e)</option>
            <option value="veuf">Veuf/veuve</option>
          </select>
          <Input defaultValue={searchParams.get("tribe") ?? ""} onChange={(e) => updateParam("tribe", e.target.value)} placeholder="Tribu ou tribu recherchée" />
          <Input defaultValue={searchParams.get("religion") ?? ""} onChange={(e) => updateParam("religion", e.target.value)} placeholder="Religion ou religion recherchée" />
          <Input type="number" min="18" max="99" defaultValue={searchParams.get("minAge") ?? ""} onChange={(e) => updateParam("minAge", e.target.value)} placeholder="Âge minimum" />
          <Input type="number" min="18" max="99" defaultValue={searchParams.get("maxAge") ?? ""} onChange={(e) => updateParam("maxAge", e.target.value)} placeholder="Âge maximum" />
          <Input type="number" min="120" max="230" defaultValue={searchParams.get("minHeight") ?? ""} onChange={(e) => updateParam("minHeight", e.target.value)} placeholder="Taille min. (cm)" />
          <Input type="number" min="120" max="230" defaultValue={searchParams.get("maxHeight") ?? ""} onChange={(e) => updateParam("maxHeight", e.target.value)} placeholder="Taille max. (cm)" />
          <Input type="number" min="0" defaultValue={searchParams.get("maxChildren") ?? ""} onChange={(e) => updateParam("maxChildren", e.target.value)} placeholder="Nombre max. d’enfants" />
          <select defaultValue={searchParams.get("photos") ?? ""} onChange={(e) => updateParam("photos", e.target.value)} className={selectClassName}>
            <option value="">Photos : toutes</option>
            <option value="yes">Avec photos</option>
            <option value="no">Sans photo</option>
          </select>
          <select defaultValue={searchParams.get("offer") ?? ""} onChange={(e) => updateParam("offer", e.target.value)} className={selectClassName}>
            <option value="">Toutes les offres</option>
            <option value="reseau">Réseau</option>
            <option value="signature">Signature</option>
            <option value="hunter">Hunter</option>
          </select>
        </div>
      </details>
    </div>
  );
}
