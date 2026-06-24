// Constants used across client and server

export const PAYMENT_PROVIDERS = [
  {
    id: "MTN_MOMO",
    label: "MTN Mobile Money",
    description: "Paiement via MTN MoMo",
    color: "#FFCC00",
    textColor: "#000000",
  },
  {
    id: "MOOV_MONEY",
    label: "Moov Money",
    description: "Paiement via Moov Money",
    color: "#005BAF",
    textColor: "#FFFFFF",
  },
  {
    id: "CELTIIS_CASH",
    label: "Celtiis Cash",
    description: "Paiement via Celtiis Cash",
    color: "#E2231A",
    textColor: "#FFFFFF",
  },
  {
    id: "CARD",
    label: "Carte bancaire",
    description: "Visa / Mastercard via FeexPay",
    color: "#111111",
    textColor: "#FFFFFF",
  },
] as const;

export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number]["id"];

export const PAYMENT_OPTIONS = [
  {
    id: "INSCRIPTION",
    label: "Étape 1 — Inscription",
    amount: 100, // TEST: 100 FCFA (normal: 5000)
    description: "Réserve votre place + accès groupe WhatsApp",
  },
  {
    id: "FORMATION",
    label: "Étape 2 — Frais de formation",
    amount: 100, // TEST: 100 FCFA (normal: 20000)
    description: "Participation aux 3 jours de formation",
  },
] as const;

export type PaymentOptionId = (typeof PAYMENT_OPTIONS)[number]["id"];

export const SEXE_OPTIONS = [
  { value: "M", label: "Masculin" },
  { value: "F", label: "Féminin" },
] as const;

export const NIVEAU_ETUDES_OPTIONS = [
  { value: "Aucun", label: "Aucun diplôme" },
  { value: "CEP", label: "CEP" },
  { value: "BEPC", label: "BEPC" },
  { value: "BAC", label: "Baccalauréat" },
  { value: "BAC+2", label: "BAC+2 / BTS / DUT" },
  { value: "BAC+3", label: "Licence (BAC+3)" },
  { value: "BAC+5", label: "Master / Ingénieur (BAC+5)" },
  { value: "Doctorat", label: "Doctorat" },
  { value: "Autre", label: "Autre" },
] as const;

export const SOURCE_OPTIONS = [
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Ami / Proche", label: "Recommandation d'un ami ou proche" },
  { value: "Affiche", label: "Affiche / Flyer" },
  { value: "Radio", label: "Radio" },
  { value: "Recherche Google", label: "Recherche Google" },
  { value: "TikTok", label: "TikTok" },
  { value: "Autre", label: "Autre" },
] as const;

export const BRAND = {
  name: "Zohar Décor",
  slogan: "Des souvenirs qui brillent à jamais",
  gold: "#C9A227",
  noir: "#111111",
  blanc: "#F8F6F2",
  beige: "#EFE8DD",
  training: {
    title: "FORMATION PROFESSIONNELLE EN RÉSINE ÉPOXY",
    subtitle:
      "Apprenez à créer et vendre des créations personnalisées en résine époxy.",
    startDate: "09 juillet",
    endDate: "11 juillet",
    year: 2026,
    duration: "3 jours de formation intensive",
    location:
      "Zongo 2, von Axe Beni CHC-Presdo, à 100 m du carrefour après EPP La Source, Terre Rouge en allant au CEG Nima.",
    capacity: 10,
    inscriptionFee: 5000,
    trainingFee: 20000,
    attestation: "Attestation de participation incluse.",
  },
  // Icons are now Lucide React components defined directly in Creations.tsx
  creations: [
    { id: "porte-cles", label: "Porte-clés" },
    { id: "stylos", label: "Stylos personnalisés" },
    { id: "bijoux", label: "Bijoux" },
    { id: "blocs-notes", label: "Blocs-notes" },
    { id: "tableaux", label: "Tableaux décoratifs" },
  ],
};
