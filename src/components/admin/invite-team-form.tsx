"use client";

import { useActionState, useRef } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  inviteTeamMember,
  type InviteTeamMemberState,
} from "@/lib/actions/admin-team";

const initialState: InviteTeamMemberState = { status: "idle" };

export function InviteTeamForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    inviteTeamMember,
    initialState
  );

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5"
    >
      <p className="flex items-center gap-2 text-sm font-medium text-primary">
        <UserPlus className="h-4 w-4" strokeWidth={1.5} />
        Inviter un membre de l&apos;équipe
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        La personne reçoit un email pour créer son mot de passe et accéder à
        cet espace.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="invite-email" className="sr-only">
            Adresse email
          </Label>
          <Input
            id="invite-email"
            name="email"
            type="email"
            placeholder="prenom@lomdie.com"
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi..." : "Envoyer l'invitation"}
        </Button>
      </div>

      {state.message && (
        <p
          className={
            state.status === "error" ? "mt-2 text-xs text-destructive" : "mt-2 text-xs text-primary"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
