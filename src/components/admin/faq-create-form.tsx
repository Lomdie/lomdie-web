"use client";

import { useActionState, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFaqItem, type FaqFormState } from "@/lib/actions/admin-faq";

const initialState: FaqFormState = { status: "idle" };

export function FaqCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createFaqItem,
    initialState
  );

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="space-y-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5"
    >
      <p className="flex items-center gap-2 text-sm font-medium text-primary">
        <Plus className="h-4 w-4" strokeWidth={1.5} />
        Ajouter une question
      </p>
      <Label htmlFor="new-question">Question</Label>
      <Input id="new-question" name="question" required />
      <Label htmlFor="new-answer">Réponse</Label>
      <Textarea id="new-answer" name="answer" rows={3} required />

      {state.message && (
        <p
          className={
            state.status === "error" ? "text-xs text-destructive" : "text-xs text-primary"
          }
        >
          {state.message}
        </p>
      )}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Ajout..." : "Ajouter"}
      </Button>
    </form>
  );
}
