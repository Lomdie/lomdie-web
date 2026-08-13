"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setPassword, type SetPasswordState } from "@/lib/actions/auth";
import { AdminBrand } from "@/components/admin/admin-brand";

const initialState: SetPasswordState = { status: "idle" };

export function SetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    setPassword,
    initialState
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <AdminBrand compact />
        <h1 className="font-display text-2xl">Bienvenue chez Lomdie</h1>
        <p className="text-sm text-muted-foreground">
          Choisissez votre mot de passe pour accéder à l&apos;espace équipe.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        {state.status === "error" && state.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Définir mon mot de passe"}
        </Button>
      </form>
    </div>
  );
}
