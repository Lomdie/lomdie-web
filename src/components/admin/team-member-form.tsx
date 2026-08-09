"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateTeamMember,
  type UpdateTeamMemberState,
} from "@/lib/actions/admin-team-members";

const initialState: UpdateTeamMemberState = { status: "idle" };

interface TeamMemberFormProps {
  memberId: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
}

export function TeamMemberForm({
  memberId,
  name,
  role,
  bio,
  photoUrl,
}: TeamMemberFormProps) {
  const [preview, setPreview] = useState<string | null>(photoUrl);
  const [state, formAction, isPending] = useActionState(
    updateTeamMember,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-border/70 bg-card p-6"
    >
      <input type="hidden" name="memberId" value={memberId} />

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
          {preview ? (
            <Image
              src={preview}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-7 w-7 text-primary" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor={`photo-${memberId}`}>Photo</Label>
          <Input
            id={`photo-${memberId}`}
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            JPG, PNG ou WebP, 5 Mo maximum. Format portrait recommandé.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`name-${memberId}`}>Prénom</Label>
        <Input id={`name-${memberId}`} name="name" defaultValue={name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`role-${memberId}`}>Rôle</Label>
        <Input id={`role-${memberId}`} name="role" defaultValue={role} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`bio-${memberId}`}>Bio</Label>
        <Textarea id={`bio-${memberId}`} name="bio" rows={4} defaultValue={bio} />
      </div>

      {state.message && (
        <p
          className={
            state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"
          }
        >
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
