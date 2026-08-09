"use client";

import { Trash2, CircleCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { removeTeamMember } from "@/lib/actions/admin-team";

interface TeamMemberRowProps {
  id: string;
  email: string;
  hasAcceptedInvite: boolean;
  isCurrentUser: boolean;
}

export function TeamMemberRow({
  id,
  email,
  hasAcceptedInvite,
  isCurrentUser,
}: TeamMemberRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4">
      <div className="flex items-center gap-3">
        {hasAcceptedInvite ? (
          <CircleCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        )}
        <div>
          <p className="text-sm font-medium">
            {email} {isCurrentUser && <span className="text-muted-foreground">(vous)</span>}
          </p>
          <Badge variant="secondary" className="mt-1">
            {hasAcceptedInvite ? "Actif" : "Invitation en attente"}
          </Badge>
        </div>
      </div>

      {!isCurrentUser && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Retirer ${email}`}
          onClick={() => removeTeamMember(id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
        </Button>
      )}
    </div>
  );
}
