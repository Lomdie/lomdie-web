"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, type RequestResetState } from "@/lib/actions/auth";
import { AdminBrand } from "@/components/admin/admin-brand";

const initialState: RequestResetState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <AdminBrand compact />
        <h1 className="font-display text-2xl">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground">
          Indiquez votre email, nous vous envoyons un lien de réinitialisation.
        </p>
      </div>

      {state.status === "success" ? (
        <p className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-center text-sm text-foreground">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>

          {state.status === "error" && state.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Envoi..." : "Envoyer le lien"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/admin/login" className="font-medium text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
