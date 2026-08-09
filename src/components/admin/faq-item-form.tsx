"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateFaqItem,
  deleteFaqItem,
  type FaqFormState,
} from "@/lib/actions/admin-faq";

const initialState: FaqFormState = { status: "idle" };

export function FaqItemForm({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateFaqItem,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-2xl border border-border/70 bg-card p-5"
    >
      <input type="hidden" name="id" value={id} />
      <Label htmlFor={`question-${id}`}>Question</Label>
      <Input id={`question-${id}`} name="question" defaultValue={question} required />
      <Label htmlFor={`answer-${id}`}>Réponse</Label>
      <Textarea id={`answer-${id}`} name="answer" rows={3} defaultValue={answer} required />

      {state.message && (
        <p
          className={
            state.status === "error" ? "text-xs text-destructive" : "text-xs text-primary"
          }
        >
          {state.message}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Supprimer cette question"
          onClick={() => deleteFaqItem(id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  );
}
