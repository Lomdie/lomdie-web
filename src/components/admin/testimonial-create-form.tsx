"use client";

import { useActionState, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTestimonial,
  type TestimonialFormState,
} from "@/lib/actions/admin-testimonials";

const initialState: TestimonialFormState = { status: "idle" };

export function TestimonialCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createTestimonial,
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
        Ajouter un témoignage
      </p>

      <Label htmlFor="quote">Témoignage (reformulé, jamais un copier-coller brut de conversation)</Label>
      <Textarea id="quote" name="quote" rows={3} required />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="authorInitials">Initiales</Label>
          <Input id="authorInitials" name="authorInitials" placeholder="A. M." required />
        </div>
        <div>
          <Label htmlFor="rating">Note</Label>
          <Select name="rating" defaultValue="5">
            <SelectTrigger id="rating" className="w-full">
              <SelectValue>
                {(value: string) => `${value} étoile${Number(value) > 1 ? "s" : ""}`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} étoile{n > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
