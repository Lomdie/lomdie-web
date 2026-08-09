"use client";

import { useActionState, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateSiteContent,
  type UpdateContentState,
} from "@/lib/actions/admin-content";

const RichTextEditor = dynamic(() => import("@/components/admin/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg border border-border/70 text-sm text-muted-foreground">
      Chargement de l&apos;éditeur...
    </div>
  ),
});

const initialState: UpdateContentState = { status: "idle" };

interface ContentFieldFormProps {
  fieldKey: string;
  label: string;
  value: string;
  contentType: string;
}

export function ContentFieldForm({
  fieldKey,
  label,
  value,
  contentType,
}: ContentFieldFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateSiteContent,
    initialState
  );
  const [richValue, setRichValue] = useState(value);

  return (
    <form action={formAction} className="space-y-2 rounded-2xl border border-border/70 bg-card p-5">
      <input type="hidden" name="key" value={fieldKey} />
      <Label htmlFor={fieldKey}>{label}</Label>
      {contentType === "html" ? (
        <>
          <input type="hidden" name="value" value={richValue} />
          <RichTextEditor value={richValue} onChange={setRichValue} />
        </>
      ) : contentType === "richtext" ? (
        <Textarea id={fieldKey} name="value" rows={3} defaultValue={value} required />
      ) : (
        <Input id={fieldKey} name="value" defaultValue={value} required />
      )}

      <div className="flex items-center justify-between pt-1">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        {state.message && (
          <span
            className={
              state.status === "error" ? "text-xs text-destructive" : "text-xs text-primary"
            }
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
