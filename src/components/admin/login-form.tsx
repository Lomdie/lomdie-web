"use client";

import { useActionState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginFormState } from "@/lib/actions/auth";

const initialState: LoginFormState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Heart className="h-7 w-7 text-primary" strokeWidth={1.5} />
        <h1 className="font-display text-2xl">Espace équipe Lomdie</h1>
        <p className="text-sm text-muted-foreground">
          Connectez-vous pour gérer le site et les candidatures.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {state.status === "error" && state.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
