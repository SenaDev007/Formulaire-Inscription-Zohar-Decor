"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, ArrowRight, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MTNMoMoLogo,
  MoovMoneyLogo,
  CeltiisCashLogo,
  VisaLogo,
  MastercardLogo,
} from "@/components/brand/PaymentLogos";

export function Pricing({ onRegister, onFormation }: { onRegister: () => void; onFormation: () => void }) {
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
            Formation en 2 étapes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
          >
            Une formation unique en résine époxy. L'inscription est obligatoire
            et précède la formation. Paiement sécurisé via FedaPay.
          </motion.p>
          <div className="section-divider w-32 mx-auto mt-6" />
        </div>

        {/* 2-step process */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 relative">
            {/* Connector arrow (desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center premium-shadow-lg">
                <ArrowRight className="w-6 h-6 text-noir" strokeWidth={2.5} />
              </div>
            </div>

            {/* Étape 1: Inscription */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-blanc rounded-3xl p-8 premium-shadow border border-beige card-lift hover:border-[#C9A227]/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[10px] font-bold tracking-wider uppercase text-[#C9A227]">
                  Étape 1
                </span>
                <Users className="w-5 h-5 text-[#C9A227]" />
              </div>

              <h3 className="text-xl font-bold text-noir mb-1">Inscription</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Réserve votre place à la formation
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-noir">5 000</span>
                <span className="ml-2 text-lg text-muted-foreground">FCFA</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {[
                  "Place garantie pour la session 2026",
                  "Accès au groupe WhatsApp des participants",
                  "Numéro d'inscription unique (ZD-2026-XXX)",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-beige flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#C9A227]" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-noir leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onRegister}
                className="shine-sweep relative overflow-hidden w-full h-12 rounded-full bg-noir text-blanc hover:bg-[#1A1A1A] font-semibold"
              >
                M'inscrire
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Étape 2: Formation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative bg-noir text-blanc rounded-3xl p-8 premium-shadow-xl border border-[#C9A227]/30 card-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227] text-noir text-[10px] font-bold tracking-wider uppercase">
                  Étape 2
                </span>
                <BookOpen className="w-5 h-5 text-[#C9A227]" />
              </div>

              <h3 className="text-xl font-bold text-[#C9A227] mb-1">Frais de formation</h3>
              <p className="text-sm text-blanc/70 mb-4">
                Participation aux 3 jours de formation
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blanc">20 000</span>
                <span className="ml-2 text-lg text-blanc/60">FCFA</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {[
                  "3 jours de formation pratique (09–11 juillet)",
                  "Matériel de résine fourni sur place",
                  "Créations réalisées à emporter",
                  "Attestation de participation officielle",
                  "Conseils pour lancer votre activité",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-noir" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-blanc/90 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-blanc/5 border border-[#C9A227]/20 rounded-xl p-3 text-center mb-4">
                <p className="text-xs text-blanc/60">
                  Disponible après paiement de l'inscription
                </p>
              </div>

              <Button
                onClick={onFormation}
                className="shine-sweep relative overflow-hidden w-full h-12 rounded-full bg-[#C9A227] text-noir hover:bg-[#D4AF37] font-semibold shadow-[0_8px_24px_rgba(201,162,39,0.4)]"
              >
                Souscrire à la formation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-beige border border-[#C9A227]/20">
              <span className="text-sm text-muted-foreground">Total formation :</span>
              <span className="text-2xl font-bold gold-text-gradient">25 000 FCFA</span>
              <span className="text-xs text-muted-foreground">(5 000 + 20 000)</span>
            </div>
          </motion.div>

          {/* Payment methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-w-4xl mx-auto"
          >
            <div className="bg-blanc rounded-3xl p-6 sm:p-8 premium-shadow border border-beige">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#C9A227]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-bold text-noir text-base">
                      Paiement 100% sécurisé via FedaPay
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      MTN MoMo · Moov Money · Celtiis Cash · Visa · Mastercard
                    </p>
                  </div>
                </div>

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
      </div>
    </section>
  );
}
