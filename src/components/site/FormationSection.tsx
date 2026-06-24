"use client";

import { useState, useEffect } from "react";
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
  User,
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
  const [allParticipants, setAllParticipants] = useState<ParticipantSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ParticipantSummary | null>(null);
  const [paying, setPaying] = useState(false);
  const { toast } = useToast();

  const formattedAmount = new Intl.NumberFormat("fr-FR").format(
    TRAINING_INFO.trainingFee
  );

  // Fetch all participants who paid inscription (PAID_INSCRIPTION)
  useEffect(() => {
    fetch("/api/participant/eligible")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setAllParticipants(json.participants);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter participants by search query
  // Split the query into words and check if ALL words are found in the
  // combined "prenoms + nomComplet + email + telWhatsApp" string
  const filtered = searchQuery.trim()
    ? (() => {
        const words = searchQuery.toLowerCase().trim().split(/\s+/);
        return allParticipants.filter((p) => {
          const haystack = `${p.prenoms} ${p.nomComplet} ${p.email} ${p.telWhatsApp}`.toLowerCase();
          // Every word must be found somewhere in the haystack
          return words.every((word) => haystack.includes(word));
        });
      })()
    : allParticipants;

  // Pay formation via FedaPay
  const handlePay = () => {
    if (!selected) return;

    setPaying(true);

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
          description: `Frais de formation — ${selected.registrationId}`,
        },
        customer: {
          email: selected.email,
          firstname: selected.prenoms,
          lastname: selected.nomComplet,
        },
        onComplete: (e: any) => {
          setPaying(false);

          if (
            e?.reason === "DIALOG DISMISSED" ||
            e?.reason === "USERCANCELLED"
          ) {
            toast({ title: "Paiement annulé" });
            return;
          }

          // Confirm via API
          fetch("/api/payment/fedapay-confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ participantId: selected.id }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.success) {
                toast({ title: "Paiement réussi !" });
                onPaymentComplete(selected.registrationId);
              } else {
                toast({
                  title: "Erreur de confirmation",
                  description: json.error,
                  variant: "destructive",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur réseau",
                variant: "destructive",
              });
            });
        },
      });

      if (widget && widget.open) widget.open();
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
            Sélectionnez votre nom dans la liste des participants ayant payé
            l'inscription, puis payez les frais de formation de{" "}
            {formattedAmount} FCFA.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-[#1A1A1A] border border-[#C9A227]/30 rounded-2xl p-4 mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blanc/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher votre nom..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-noir text-blanc text-sm placeholder:text-blanc/30 border border-blanc/[0.08] focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/20 focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Participants list */}
        <div className="bg-[#1A1A1A] border border-[#C9A227]/20 rounded-2xl p-4 mb-4 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 text-[#C9A227] animate-spin mx-auto" />
              <p className="text-blanc/40 text-xs mt-2">Chargement...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-blanc/30 mx-auto mb-2" />
              <p className="text-blanc/40 text-sm">
                {allParticipants.length === 0
                  ? "Aucun participant éligible. Vous devez d'abord payer les frais d'inscription."
                  : "Aucun résultat pour cette recherche."}
              </p>
              {allParticipants.length === 0 && (
                <button
                  onClick={onBack}
                  className="mt-3 text-[#C9A227] text-sm font-semibold underline"
                >
                  Aller à l'inscription →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => p.status !== "PAID_FULL" && setSelected(p)}
                  disabled={p.status === "PAID_FULL"}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    p.status === "PAID_FULL"
                      ? "border-green-500/20 bg-green-500/[0.03] opacity-60 cursor-not-allowed"
                      : selected?.id === p.id
                      ? "border-[#C9A227] bg-[#C9A227]/[0.08]"
                      : "border-blanc/[0.06] hover:border-[#C9A227]/30 hover:bg-blanc/[0.02]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-blanc text-sm font-semibold truncate">
                      {p.prenoms} {p.nomComplet}
                    </p>
                    <p className="text-blanc/40 text-xs truncate">{p.email}</p>
                  </div>
                  {p.status === "PAID_FULL" ? (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/15 text-green-400 font-semibold flex-shrink-0">
                      Formation payée
                    </span>
                  ) : selected?.id === p.id ? (
                    <Check className="w-4 h-4 text-[#C9A227] flex-shrink-0" strokeWidth={3} />
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected participant + payment */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Info card */}
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
          </motion.div>
        )}
      </div>
    </section>
  );
}
