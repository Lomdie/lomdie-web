"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  updateCandidate,
  type UpdateCandidateState,
} from "@/lib/actions/admin-candidates";
import { candidateStatuses, candidateStatusLabels } from "@/lib/candidate-status";

const initialState: UpdateCandidateState = { status: "idle" };

interface CandidateEditFormProps {
  candidateId: string;
  currentStatus: string;
  currentNotes: string | null;
  isPubliclyListed: boolean;
  currentCity: string | null;
  currentOccupation: string | null;
  currentBirthDate: string | null;
  isPaid: boolean;
}

export function CandidateEditForm({
  candidateId,
  currentStatus,
  currentNotes,
  isPubliclyListed,
  currentCity,
  currentOccupation,
  currentBirthDate,
  isPaid,
}: CandidateEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCandidate,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="candidateId" value={candidateId} />

      <div className="space-y-1.5">
        <Label htmlFor="status">Statut</Label>
        <Select name="status" defaultValue={currentStatus}>
          <SelectTrigger id="status">
            <SelectValue>
              {(value: string) =>
                candidateStatusLabels[value as keyof typeof candidateStatusLabels] ?? value
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {candidateStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {candidateStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={currentBirthDate ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" defaultValue={currentCity ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="occupation">Métier</Label>
          <Input id="occupation" name="occupation" defaultValue={currentOccupation ?? ""} />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="isPaid" name="isPaid" defaultChecked={isPaid} />
        <Label htmlFor="isPaid" className="font-normal">Paiement confirmé manuellement</Label>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="isPubliclyListed"
          name="isPubliclyListed"
          defaultChecked={isPubliclyListed}
        />
        <div className="flex-1">
          <Label htmlFor="isPubliclyListed" className="font-normal">
            Afficher ce profil (anonymisé) sur la page publique
          </Label>
        </div>
        <Tooltip>
          <TooltipTrigger render={<button type="button" aria-label="Aide" />}>
            <Info className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent>
            Seuls le genre, l&apos;âge (calculé depuis la date de naissance), la
            ville et le métier sont visibles. Jamais de nom, ni de photo
            nette. Remplissez les 3 champs ci-dessus pour que le profil soit
            complet.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="adminNotes">Notes internes</Label>
        <Textarea
          id="adminNotes"
          name="adminNotes"
          rows={5}
          defaultValue={currentNotes ?? ""}
          placeholder="Visibles uniquement par l'équipe Lomdie."
        />
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
