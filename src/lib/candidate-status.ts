export const candidateStatuses = [
  "nouvelle_candidature",
  "en_qualification",
  "validee",
  "payee",
  "en_matching",
  "mise_en_relation",
  "cloturee",
] as const;

export type CandidateStatus = (typeof candidateStatuses)[number];

export const candidateStatusLabels: Record<CandidateStatus, string> = {
  nouvelle_candidature: "Nouvelle candidature",
  en_qualification: "En qualification",
  validee: "Validée",
  payee: "Payée",
  en_matching: "En matching",
  mise_en_relation: "Mise en relation",
  cloturee: "Clôturée",
};
