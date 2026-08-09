"use client";

import { useActionState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/newsletter";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterBand() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="border-b border-border/70 bg-background">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Mail className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="font-display text-lg">
              Conseils, coulisses et nouvelles du matchmaking
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Recevez nos conseils et nos nouveautés directement dans votre boîte mail.
            </p>
          </div>
        </div>

        {state.status === "success" ? (
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
            {state.message}
          </div>
        ) : (
          <form action={formAction} className="flex w-full max-w-sm gap-2">
            <Input
              type="email"
              name="email"
              placeholder="Votre email"
              required
              autoComplete="email"
            />
            <Button type="submit" disabled={isPending} className="shrink-0 gap-1.5">
              {isPending ? "..." : <ArrowRight className="h-4 w-4" strokeWidth={1.5} />}
            </Button>
          </form>
        )}
      </Reveal>
      {state.status === "error" && state.message && (
        <p className="mx-auto max-w-6xl px-6 pb-6 text-center text-xs text-destructive">
          {state.message}
        </p>
      )}
    </section>
  );
}
