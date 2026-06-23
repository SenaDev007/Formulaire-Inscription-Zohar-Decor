"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MTNMoMoLogo,
  MoovMoneyLogo,
  CeltiisCashLogo,
  VisaLogo,
  MastercardLogo,
} from "@/components/brand/PaymentLogos";

export function Pricing({ onRegister }: { onRegister: () => void }) {
  const tiers = [
    {
      name: "Inscription",
      price: "5 000",
      description: "Réservez votre place à la formation",
      features: ["Accès au groupe WhatsApp des participants"],
      cta: "M'inscrire",
      highlighted: false,
    },
    {
      name: "Formation complète",
      price: "25 000",
      description: "3 jours inclus",
      features: [
        "Tout ce qui est inclus dans l'inscription",
        "3 jours de formation pratique (09–11 juillet)",
        "Matériel de résine fourni sur place",
        "Créations réalisées à emporter",
        "Attestation de participation officielle",
        "Conseils pour lancer votre activité",
      ],
      cta: "M'inscrire + Formation",
      highlighted: true,
    },
  ];

  return (
    <section id="tarifs" className="py-20 sm:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-medium text-[#C9A227] tracking-[0.3em] uppercase mb-3"
          >
            Tarifs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Choisissez votre formule
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
          >
            Un investissement modeste pour une compétence qui peut devenir une
            véritable source de revenus. Paiement en plusieurs options via
            Mobile Money ou carte bancaire.
          </motion.p>
          <div className="section-divider w-32 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 card-lift ${
                tier.highlighted
                  ? "bg-noir text-blanc premium-shadow-xl border border-[#C9A227]/30"
                  : "bg-blanc text-noir premium-shadow border border-beige hover:border-[#C9A227]/40"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#C9A227] text-noir text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-1.5 premium-shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommandé
                </div>
              )}

              <h3
                className={`text-xl font-bold mb-1 ${
                  tier.highlighted ? "text-[#C9A227]" : "text-noir"
                }`}
              >
                {tier.name}
              </h3>
              <p
                className={`text-sm mb-6 ${
                  tier.highlighted ? "text-blanc/70" : "text-muted-foreground"
                }`}
              >
                {tier.description}
              </p>

              <div className="mb-6 flex items-baseline">
                <span className="text-5xl font-bold">{tier.price}</span>
                <span
                  className={`ml-2 text-lg ${
                    tier.highlighted ? "text-blanc/60" : "text-muted-foreground"
                  }`}
                >
                  FCFA
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tier.highlighted
                          ? "bg-[#C9A227] text-noir"
                          : "bg-beige text-[#C9A227]"
                      }`}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span
                      className={`text-sm leading-snug ${
                        tier.highlighted ? "text-blanc/90" : "text-noir"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onRegister}
                className={`shine-sweep relative overflow-hidden w-full h-14 rounded-full font-semibold text-base ${
                  tier.highlighted
                    ? "bg-[#C9A227] text-noir hover:bg-[#D4AF37] shadow-[0_8px_24px_rgba(201,162,39,0.4)]"
                    : "bg-noir text-blanc hover:bg-[#1A1A1A]"
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Single payment CTA block with official provider logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-blanc rounded-3xl p-6 sm:p-8 premium-shadow border border-beige">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#C9A227]" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-bold text-noir text-base">
                    Paiement 100% sécurisé via FeeXPay
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    MTN MoMo · Moov Money · Celtiis Cash · Visa · Mastercard
                  </p>
                </div>
              </div>

              {/* Official provider logos */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="bg-blanc rounded-lg p-1 premium-shadow border border-beige">
                  <MTNMoMoLogo size={36} />
                </div>
                <div className="bg-blanc rounded-lg p-1 premium-shadow border border-beige">
                  <MoovMoneyLogo size={36} />
                </div>
                <div className="bg-blanc rounded-lg p-1 premium-shadow border border-beige">
                  <CeltiisCashLogo size={36} />
                </div>
                <div className="bg-blanc rounded-lg p-1 premium-shadow border border-beige">
                  <VisaLogo size={48} />
                </div>
                <div className="bg-blanc rounded-lg p-1 premium-shadow border border-beige">
                  <MastercardLogo size={48} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
