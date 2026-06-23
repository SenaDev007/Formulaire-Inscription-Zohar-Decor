"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Check, Smartphone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PAYMENT_PROVIDERS, PAYMENT_OPTIONS } from "@/lib/constants";
import { TRAINING_INFO } from "@/lib/email";
import type { ParticipantSummary, PaymentSummary } from "@/app/page";

type Provider = "MTN_MOMO" | "MOOV_MONEY" | "CELTIIS_CASH" | "CARD";
type PaymentType = "INSCRIPTION" | "COMPLET";

export function PaymentSection({
  participant,
  onPaymentInitiated,
  onBack,
}: {
  participant: ParticipantSummary;
  onPaymentInitiated: (p: PaymentSummary) => void;
  onBack: () => void;
}) {
  const [paymentType, setPaymentType] = useState<PaymentType>("INSCRIPTION");
  const [provider, setProvider] = useState<Provider>("MTN_MOMO");
  const [providerPhone, setProviderPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const amount =
    paymentType === "COMPLET"
      ? TRAINING_INFO.fullFee
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
        feexpayTransaction: json.payment.feexpayTransaction,
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
    <section className="py-12 sm:py-16 bg-beige/30 min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-noir transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au formulaire
          </button>

          {/* Registration banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-noir rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227]">
                Inscription enregistrée
              </p>
              <p className="text-blanc font-bold text-lg mt-1">
                {participant.nomComplet}
              </p>
              <p className="text-blanc/60 text-sm">{participant.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227]">
                N° Inscription
              </p>
              <p
                className="text-blanc font-bold text-2xl mt-1 tracking-wider"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {participant.registrationId}
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: payment options + provider */}
            <div className="lg:col-span-3 bg-blanc rounded-2xl premium-shadow border border-beige p-6 sm:p-8">
              <h2 className="text-xl font-bold text-noir mb-1">Paiement</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Choisissez votre formule et votre moyen de paiement.
              </p>

              {/* Payment type */}
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                Formule de paiement
              </Label>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentType(opt.id)}
                    className={`text-left rounded-xl p-4 border-2 transition-all ${
                      paymentType === opt.id
                        ? "border-[#C9A227] bg-[#C9A227]/5"
                        : "border-beige hover:border-[#C9A227]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-noir text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {opt.description}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          paymentType === opt.id
                            ? "border-[#C9A227] bg-[#C9A227]"
                            : "border-beige-dark"
                        }`}
                      >
                        {paymentType === opt.id && (
                          <Check className="w-3 h-3 text-noir" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-noir mt-3">
                      {new Intl.NumberFormat("fr-FR").format(opt.amount)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        FCFA
                      </span>
                    </p>
                  </button>
                ))}
              </div>

              {/* Provider */}
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                Moyen de paiement
              </Label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {PAYMENT_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`flex items-center gap-3 rounded-xl p-3 border-2 transition-all ${
                      provider === p.id
                        ? "border-[#C9A227] bg-[#C9A227]/5"
                        : "border-beige hover:border-[#C9A227]/40"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                      style={{
                        backgroundColor: p.color,
                        color: p.textColor,
                      }}
                    >
                      {p.id === "CARD" ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-noir text-xs leading-tight">
                        {p.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                        {p.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Provider phone */}
              {provider !== "CARD" && (
                <div className="mb-6">
                  <Label htmlFor="providerPhone" className="text-noir font-medium">
                    Numéro {PAYMENT_PROVIDERS.find((p) => p.id === provider)?.label}
                  </Label>
                  <Input
                    id="providerPhone"
                    value={providerPhone}
                    onChange={(e) => setProviderPhone(e.target.value)}
                    placeholder="Ex. 97 00 00 00"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Le paiement sera demandé sur ce numéro via Mobile Money.
                  </p>
                </div>
              )}

              {/* CTA */}
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-14 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full font-semibold text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Initialisation...
                  </>
                ) : (
                  <>
                    Payer {formatted} FCFA
                  </>
                )}
              </Button>
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-2">
              <div className="bg-blanc rounded-2xl premium-shadow border border-beige p-6 sticky top-24">
                <h3 className="text-sm font-semibold text-noir uppercase tracking-wider mb-4">
                  Récapitulatif
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">N° Inscription</span>
                    <span className="font-semibold text-noir">
                      {participant.registrationId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participant</span>
                    <span className="font-semibold text-noir">
                      {participant.prenoms} {participant.nomComplet}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold text-noir text-xs break-all">
                      {participant.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Formation</span>
                    <span className="font-semibold text-noir text-xs">
                      09–11 juillet 2026
                    </span>
                  </div>
                  <div className="h-px bg-beige my-3" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Formule</span>
                    <span className="font-semibold text-noir">
                      {paymentType === "COMPLET"
                        ? "Complète"
                        : "Inscription seule"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Moyen</span>
                    <span className="font-semibold text-noir text-xs">
                      {PAYMENT_PROVIDERS.find((p) => p.id === provider)?.label}
                    </span>
                  </div>
                  <div className="h-px bg-beige my-3" />
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-3xl font-bold text-[#C9A227]">
                      {formatted}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        FCFA
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-lg bg-beige/50 text-xs text-muted-foreground leading-relaxed">
                  Paiement sécurisé via FeexPay. Vous recevrez un reçu par email
                  et un message WhatsApp de confirmation après paiement.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
