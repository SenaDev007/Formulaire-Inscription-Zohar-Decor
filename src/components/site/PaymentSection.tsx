"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone,
  CreditCard,
  CalendarDays,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PAYMENT_PROVIDERS, PAYMENT_OPTIONS } from "@/lib/constants";
import { TRAINING_INFO } from "@/lib/email";
import {
  MTNMoMoLogo,
  MoovMoneyLogo,
  CeltiisCashLogo,
  VisaLogo,
  MastercardLogo,
  FeeXPayLogo,
  WhatsAppIcon,
} from "@/components/brand/PaymentLogos";
import type { ParticipantSummary, PaymentSummary } from "@/app/page";

type Provider = "MTN_MOMO" | "MOOV_MONEY" | "CELTIIS_CASH" | "CARD";
type PaymentType = "INSCRIPTION" | "FORMATION";

const PROVIDER_COMPONENTS: Record<
  Provider,
  { Logo: React.FC<{ size?: number; className?: string }>; label: string; sub: string }
> = {
  MTN_MOMO: { Logo: MTNMoMoLogo, label: "MTN MoMo", sub: "Mobile Money" },
  MOOV_MONEY: { Logo: MoovMoneyLogo, label: "Moov Money", sub: "Mobile Money" },
  CELTIIS_CASH: { Logo: CeltiisCashLogo, label: "Celtiis Cash", sub: "Mobile Money" },
  CARD: { Logo: VisaLogo, label: "Carte bancaire", sub: "Visa / Mastercard" },
};

const SIDEBAR_ITEMS = [
  {
    icon: CalendarDays,
    label: "Dates",
    value: "09 — 11 juillet 2026",
    sub: "Jeu · Ven · Sam",
  },
  {
    icon: Users,
    label: "Places",
    value: "10 max",
    sub: "par cohorte",
  },
];

export function PaymentSection({
  participant,
  onPaymentInitiated,
  onBack,
}: {
  participant: ParticipantSummary;
  onPaymentInitiated: (p: PaymentSummary) => void;
  onBack: () => void;
}) {
  // Auto-determine payment step based on participant status:
  // - UNPAID → Step 1: INSCRIPTION (5 000 FCFA)
  // - PAID_INSCRIPTION → Step 2: FORMATION (20 000 FCFA)
  const [paymentType, setPaymentType] = useState<PaymentType>(
    participant.status === "PAID_INSCRIPTION" ? "FORMATION" : "INSCRIPTION"
  );
  const [provider, setProvider] = useState<Provider>("MTN_MOMO");
  const [providerPhone, setProviderPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const amount =
    paymentType === "FORMATION"
      ? TRAINING_INFO.trainingFee
      : TRAINING_INFO.inscriptionFee;
  const formatted = new Intl.NumberFormat("fr-FR").format(amount);

  const handleSubmit = async () => {
    if (provider !== "CARD" && !providerPhone.trim()) {
      toast({
        title: "Numéro requis",
        description: "Renseignez le numéro Mobile Money qui paiera.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participant.id,
          paymentType,
          provider,
          providerPhone: providerPhone || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast({
          title: "Erreur de paiement",
          description: json.error || "Réessayez.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: json.demoMode ? "Mode démo" : "Paiement initié",
        description: json.demoMode
          ? "Mode démo — vous allez être redirigé pour confirmer."
          : "Vous allez être redirigé vers FeexPay.",
      });
      onPaymentInitiated({
        id: json.payment.id,
        status: json.payment.status,
        amount: json.payment.amount,
        type: json.payment.type,
        provider: json.payment.provider,
        feexpayTransaction: json.payment.feexpayReference,
        paymentUrl: json.payment.paymentUrl,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Erreur réseau",
        description: "Réessayez.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-noir text-blanc relative overflow-hidden">
      {/* Decorative gold blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#C9A227]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#E8C766]/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-14">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-blanc/60 hover:text-blanc transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au formulaire
        </button>

        <div className="lg:grid lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_560px] lg:gap-10 xl:gap-14 lg:items-start">
          {/* ============ LEFT PANEL (sticky summary) ============ */}
          <div className="lg:sticky lg:top-8 mb-8 lg:mb-0">
            <motion.header
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center lg:text-left mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blanc shadow-[0_2px_12px_rgba(201,162,39,0.3)] border-2 border-[#C9A227] overflow-hidden p-1">
                  <img
                    src="/logo_zohar_decor.png"
                    alt="Zohar Décor"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h1
                    className="text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight leading-none"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    <span className="text-blanc">ZOHAR</span>
                    <span className="gold-text-gradient"> DÉCOR</span>
                  </h1>
                  <p className="text-[10px] sm:text-[11px] font-semibold tracking-[5px] text-[#C9A227] uppercase mt-1">
                    Paiement sécurisé
                  </p>
                </div>
              </div>

              <h2
                className="text-lg xs:text-xl sm:text-2xl font-bold text-blanc mt-5 mb-2 leading-snug"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Finalisez votre inscription
              </h2>
              <p className="text-blanc/60 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                Plus qu'une étape : réglez vos frais pour confirmer
                définitivement votre place à la formation.
              </p>

              {/* Registration ID badge */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30">
                <Check className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={3} />
                <span className="text-[#C9A227] text-[11px] xs:text-xs font-semibold">
                  Inscription enregistrée — N° {participant.registrationId}
                </span>
              </div>
            </motion.header>

            {/* Participant card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-[#1A1A1A] border border-[#C9A227]/20 rounded-xl p-4 mb-4"
            >
              <p className="text-[#C9A227] text-[10px] font-semibold uppercase tracking-wider mb-3">
                Participant
              </p>
              <p className="text-blanc font-bold text-base">
                {participant.prenoms} {participant.nomComplet}
              </p>
              <p className="text-blanc/50 text-xs mt-1 break-all">
                {participant.email}
              </p>
              <p className="text-blanc/50 text-xs mt-0.5">
                {participant.telWhatsApp}
              </p>
            </motion.div>

            {/* Info items */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="grid grid-cols-2 gap-2 xs:gap-3 mb-4"
            >
              {SIDEBAR_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="bg-[#1A1A1A] border border-[#C9A227]/20 rounded-xl p-3 text-center"
                >
                  <div className="mb-1.5">
                    <item.icon
                      className="w-5 h-5 text-[#C9A227] mx-auto"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-[#C9A227] text-[9px] xs:text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-blanc text-[11px] xs:text-xs font-bold leading-tight">
                    {item.value}
                  </p>
                  <p className="text-blanc/40 text-[9px] xs:text-[10px] mt-0.5">
                    {item.sub}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Total summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="bg-gradient-to-br from-[#C9A227]/15 to-[#1A1A1A] border border-[#C9A227]/40 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-blanc/60 text-[10px] uppercase tracking-wider">
                  Formule choisie
                </p>
                <p className="text-[#C9A227] text-xs font-bold">
                  {paymentType === "FORMATION" ? "Formation" : "Inscription"}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-blanc/60 text-[10px] uppercase tracking-wider">
                  Total à payer
                </p>
                <p className="text-3xl font-bold gold-text-gradient leading-none">
                  {formatted}
                  <span className="text-sm font-normal text-blanc/60 ml-1">
                    FCFA
                  </span>
                </p>
              </div>
              <p className="text-blanc/40 text-[10px] mt-2">
                {paymentType === "FORMATION" ? "3 jours de formation" : "Réserve votre place + groupe WhatsApp"}
              </p>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mt-4 text-[10px] text-blanc/40"
            >
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                Chiffré SSL
              </span>
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                FeexPay
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                Reçu email
              </span>
            </motion.div>
          </div>

          {/* ============ RIGHT PANEL (payment form) ============ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1A1A1A] border border-[#C9A227]/30 rounded-2xl p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            <div className="mb-6">
              <h3
                className="font-bold text-blanc text-lg mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Paiement
              </h3>
              <p className="text-blanc/50 text-xs">
                {paymentType === "FORMATION"
                  ? "Étape 2 : Frais de formation (20 000 FCFA)"
                  : "Étape 1 : Frais d'inscription (5 000 FCFA)"}
              </p>
            </div>

            {/* Current step card (read-only, determined by participant status) */}
            <div className="rounded-xl p-4 border-2 border-[#C9A227] bg-[#C9A227]/[0.08] mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-blanc text-sm">
                    {paymentType === "FORMATION"
                      ? "Étape 2 — Frais de formation"
                      : "Étape 1 — Inscription"}
                  </p>
                  <p className="text-blanc/40 text-[11px] mt-1">
                    {paymentType === "FORMATION"
                      ? "Participation aux 3 jours de formation"
                      : "Réserve votre place + accès groupe WhatsApp"}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 border-[#C9A227] bg-[#C9A227]">
                  <Check className="w-3 h-3 text-noir" strokeWidth={3} />
                </div>
              </div>
              <p className="text-2xl font-bold text-blanc mt-3">
                {formatted}
                <span className="text-xs font-normal text-blanc/50 ml-1">
                  FCFA
                </span>
              </p>
            </div>

            {paymentType === "FORMATION" && (
              <div className="mb-4 p-3 rounded-lg bg-[#C9A227]/[0.06] border border-[#C9A227]/20 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A227] flex-shrink-0" strokeWidth={3} />
                <p className="text-[11px] text-blanc/60">
                  Inscription (5 000 FCFA) payée. Dernière étape pour participer à la formation.
                </p>
              </div>
            )}

            {/* Provider selection */}
            <Label className="text-[10px] uppercase tracking-[0.08em] font-semibold text-blanc/60 mb-3 block">
              Moyen de paiement
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {PAYMENT_PROVIDERS.map((p) => {
                const cfg = PROVIDER_COMPONENTS[p.id as Provider];
                return (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id as Provider)}
                    className={`flex flex-col items-center gap-2 rounded-xl p-3 border-2 transition-all ${
                      provider === p.id
                        ? "border-[#C9A227] bg-[#C9A227]/[0.08]"
                        : "border-blanc/[0.08] hover:border-[#C9A227]/40"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-blanc p-1">
                      <cfg.Logo size={p.id === "CARD" ? 44 : 36} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-blanc text-[11px] leading-tight">
                        {cfg.label}
                      </p>
                      <p className="text-[9px] text-blanc/40 leading-tight mt-0.5">
                        {cfg.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Provider phone (MoMo only) */}
            {provider !== "CARD" && (
              <div className="mb-6">
                <Label
                  htmlFor="providerPhone"
                  className="text-[10px] uppercase tracking-[0.08em] font-semibold text-blanc/60"
                >
                  Numéro {PROVIDER_COMPONENTS[provider].label}
                </Label>
                <input
                  id="providerPhone"
                  value={providerPhone}
                  onChange={(e) => setProviderPhone(e.target.value)}
                  placeholder="Ex. 97 00 00 00"
                  className="w-full px-4 py-3.5 rounded-xl bg-noir text-blanc text-base sm:text-sm placeholder:text-blanc/30 border border-blanc/[0.08] focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/20 focus:outline-none transition-all"
                />
                <p className="text-[11px] text-blanc/40 mt-1.5">
                  Le paiement sera demandé sur ce numéro via Mobile Money.
                </p>
              </div>
            )}

            {/* Card info box */}
            {provider === "CARD" && (
              <div className="mb-6 p-4 rounded-xl bg-[#C9A227]/[0.06] border border-[#C9A227]/20 flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blanc/60 leading-relaxed">
                  Vous serez redirigé vers la page sécurisée FeexPay pour saisir
                  vos informations de carte (Visa ou Mastercard).
                </p>
              </div>
            )}

            {/* CTA — single unified payment button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="shine-sweep relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C9A227] text-noir font-bold text-base hover:bg-[#D4AF37] active:scale-[0.98] transition-all min-h-[52px] shadow-[0_8px_24px_rgba(201,162,39,0.35)] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initialisation...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Payer {formatted} FCFA via FeexPay
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* FeexPay trust line */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-blanc/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Paiement chiffré et sécurisé par</span>
              <FeeXPayLogo size={56} />
            </div>

            {/* Accepted providers row */}
            <div className="mt-5 pt-5 border-t border-blanc/[0.06]">
              <p className="text-center text-[10px] uppercase tracking-wider text-blanc/40 mb-3">
                Moyens acceptés
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="bg-blanc rounded-lg p-1 border border-blanc/10">
                  <MTNMoMoLogo size={32} />
                </div>
                <div className="bg-blanc rounded-lg p-1 border border-blanc/10">
                  <MoovMoneyLogo size={32} />
                </div>
                <div className="bg-blanc rounded-lg p-1 border border-blanc/10">
                  <CeltiisCashLogo size={32} />
                </div>
                <div className="bg-blanc rounded-lg p-1 border border-blanc/10">
                  <VisaLogo size={42} />
                </div>
                <div className="bg-blanc rounded-lg p-1 border border-blanc/10">
                  <MastercardLogo size={42} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center mt-8 sm:mt-10 pb-4"
        >
          <p className="text-blanc/40 text-xs">
            © {new Date().getFullYear()}{" "}
            <span className="text-blanc font-semibold">Zohar Décor</span> — Des
            souvenirs qui brillent à jamais
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
