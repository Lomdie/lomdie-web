export const candidateMatchStatuses = [
  "proposee",
  "en_discussion",
  "rendez_vous_prevu",
  "en_relation",
  "refusee",
  "terminee",
] as const;

export type CandidateMatchStatus = (typeof candidateMatchStatuses)[number];

export const candidateMatchStatusLabels: Record<CandidateMatchStatus, string> = {
  proposee: "Profil proposé",
  en_discussion: "En discussion",
  rendez_vous_prevu: "Rendez-vous prévu",
  en_relation: "En relation",
  refusee: "Refusée",
  terminee: "Terminée",
};
