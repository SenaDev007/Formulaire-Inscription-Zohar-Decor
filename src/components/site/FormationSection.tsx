"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Check,
  AlertCircle,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TRAINING_INFO } from "@/lib/email";
import type { ParticipantSummary } from "@/app/page";

declare global {
  interface Window {
    FedaPay?: any;
  }
}

const FEDAPAY_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY ||
  "pk_live_Vh_R_snTE4OKn9RyrN9Iy3rP";

export function FormationSection({
  onPaymentComplete,
  onBack,
}: {
  onPaymentComplete: (registrationId: string) => void;
  onBack: () => void;
}) {
  const [searchName, setSearchName] = useState("");
  const [searching, setSearching] = useState(false);
  const [participant, setParticipant] = useState<ParticipantSummary | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const { toast } = useToast();

  const formattedAmount = new Intl.NumberFormat("fr-FR").format(
    TRAINING_INFO.trainingFee
  );

  // Search participant by name
  const handleSearch = async () => {
    if (searchName.trim().length < 2) {
      toast({
        title: "Recherche invalide",
        description: "Entrez au moins 2 caractères.",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    setNotFound(false);
    setParticipant(null);

    try {
      const res = await fetch(
        `/api/participant/search?name=${encodeURIComponent(searchName)}`
      );
      const json = await res.json();

      if (json.success && json.participant) {
        setParticipant(json.participant);

        if (json.participant.status === "PAID_FULL") {
          toast({
            title: "Déjà payé",
            description: "Vous avez déjà payé les frais de formation.",
          });
        } else if (json.participant.status === "UNPAID") {
          toast({
            title: "Inscription non payée",
            description:
              "Vous devez d'abord payer les frais d'inscription (5 000 FCFA) avant de payer les frais de formation.",
            variant: "destructive",
          });
        }
      } else {
        setNotFound(true);
      }
    } catch {
      toast({
        title: "Erreur réseau",
        description: "Réessayez.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  // Pay formation via FedaPay
  const handlePay = () => {
    if (!participant) return;
    if (participant.status !== "PAID_INSCRIPTION") {
      toast({
        title: "Action impossible",
        description:
          "Vous devez d'abord payer les frais d'inscription (5 000 FCFA).",
        variant: "destructive",
      });
      return;
    }

    setPaying(true);

    // Load FedaPay script if needed
    const loadFedaPay = () => {
      if (window.FedaPay) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdn.fedapay.com/checkout.js?v=1.1.7";
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    loadFedaPay().then(() => {
      if (!window.FedaPay) {
        setPaying(false);
        toast({
          title: "Erreur",
          description: "Le système de paiement n'a pas pu charger.",
          variant: "destructive",
        });
        return;
      }

      const widget = window.FedaPay.init({
        public_key: FEDAPAY_PUBLIC_KEY,
        transaction: {
          amount: TRAINING_INFO.trainingFee,
          description: `Frais de formation — ${participant.registrationId}`,
        },
        customer: {
          email: participant.email,
          firstname: participant.prenoms,
          lastname: participant.nomComplet,
        },
        onComplete: (e: any) => {
          setPaying(false);

          if (
            e?.reason === "DIALOG DISMISSED" ||
            e?.reason === "USERCANCELLED"
          ) {
            toast({
              title: "Paiement annulé",
              description: "Vous avez fermé la fenêtre de paiement.",
            });
            return;
          }

          // Payment successful — confirm via API
          fetch("/api/payment/fedapay-confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ participantId: participant.id }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.success) {
                toast({
                  title: "Paiement réussi !",
                  description: "Frais de formation payés avec succès.",
                });
                onPaymentComplete(participant.registrationId);
              } else {
                toast({
                  title: "Erreur de confirmation",
                  description: json.error || "Le paiement n'a pas pu être confirmé.",
                  variant: "destructive",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur réseau",
                description: "Le paiement a abouti mais la confirmation a échoué.",
                variant: "destructive",
              });
            });
        },
      });

      if (widget && widget.open) {
        widget.open();
      }
    });
  };

  return (
    <section className="min-h-screen bg-noir text-blanc relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#C9A227]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#E8C766]/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-blanc/60 hover:text-blanc transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-blanc shadow-[0_2px_12px_rgba(201,162,39,0.3)] border-2 border-[#C9A227] overflow-hidden p-1">
              <img
                src="/logo_zohar_decor.png"
                alt="Zohar Décor"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blanc">
            Souscrire à la formation
          </h1>
          <p className="text-blanc/60 text-sm mt-2 max-w-md mx-auto">
            Recherchez votre inscription par nom, puis payez les frais de
            formation de {formattedAmount} FCFA.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-[#1A1A1A] border border-[#C9A227]/30 rounded-2xl p-6 sm:p-8 mb-4"
        >
          <label className="text-[10px] uppercase tracking-[0.08em] font-semibold text-[#C9A227] mb-2 block">
            Votre nom et prénom
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ex: DOSSOU Marie"
              className="flex-1 px-4 py-3.5 rounded-xl bg-noir text-blanc text-base sm:text-sm placeholder:text-blanc/30 border border-blanc/[0.08] focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/20 focus:outline-none transition-all"
            />
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="bg-[#C9A227] text-noir hover:bg-[#D4AF37] rounded-xl px-6"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#1A1A1A] border border-red-500/30 rounded-xl p-4 mb-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blanc text-sm font-semibold">Aucune inscription trouvée</p>
              <p className="text-blanc/60 text-xs mt-1">
                Vérifiez l'orthographe de votre nom, ou{" "}
                <button
                  onClick={onBack}
                  className="text-[#C9A227] underline"
                >
                  inscrivez-vous d'abord
                </button>
                .
              </p>
            </div>
          </motion.div>
        )}

        {/* Participant found */}
        {participant && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Info card */}
            <div className="bg-[#1A1A1A] border border-[#C9A227]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#C9A227] text-[10px] font-semibold uppercase tracking-wider">
                  Inscription trouvée
                </p>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                    participant.status === "PAID_INSCRIPTION"
                      ? "bg-[#C9A227]/15 text-[#C9A227]"
                      : participant.status === "PAID_FULL"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {participant.status === "PAID_INSCRIPTION"
                    ? "Inscription payée"
                    : participant.status === "PAID_FULL"
                    ? "Formation payée"
                    : "Inscription non payée"}
                </span>
              </div>
              <p className="text-blanc font-bold text-base">
                {participant.prenoms} {participant.nomComplet}
              </p>
              <p className="text-blanc/50 text-xs mt-1 break-all">{participant.email}</p>
              <p className="text-blanc/50 text-xs mt-0.5">{participant.telWhatsApp}</p>
            </div>

            {/* Status messages */}
            {participant.status === "UNPAID" && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blanc text-sm font-semibold">
                    Inscription non payée
                  </p>
                  <p className="text-blanc/60 text-xs mt-1">
                    Vous devez d'abord payer les frais d'inscription (5 000 FCFA)
                    avant de payer les frais de formation.
                  </p>
                  <button
                    onClick={onBack}
                    className="mt-2 text-[#C9A227] text-sm font-semibold underline"
                  >
                    Aller à l'inscription →
                  </button>
                </div>
              </div>
            )}

            {participant.status === "PAID_FULL" && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blanc text-sm font-semibold">
                    Formation déjà payée
                  </p>
                  <p className="text-blanc/60 text-xs mt-1">
                    Vous avez déjà payé l'intégralité de la formation.
                  </p>
                </div>
              </div>
            )}

            {/* Pay button (only if PAID_INSCRIPTION) */}
            {participant.status === "PAID_INSCRIPTION" && (
              <>
                <div className="bg-gradient-to-br from-[#C9A227]/15 to-[#1A1A1A] border border-[#C9A227]/40 rounded-xl p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-blanc/60">
                        Frais de formation
                      </p>
                      <p className="text-3xl font-bold gold-text-gradient mt-1">
                        {formattedAmount}
                        <span className="text-sm font-normal text-blanc/60 ml-1">
                          FCFA
                        </span>
                      </p>
                    </div>
                    <p className="text-[10px] text-blanc/40">Étape 2</p>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="shine-sweep relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C9A227] text-noir font-bold text-base hover:bg-[#D4AF37] active:scale-[0.98] transition-all min-h-[52px] shadow-[0_8px_24px_rgba(201,162,39,0.35)] disabled:opacity-60"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Payer {formattedAmount} FCFA
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-blanc/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Paiement chiffré et sécurisé par FedaPay</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
