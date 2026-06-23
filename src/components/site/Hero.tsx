"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRAINING_INFO } from "@/lib/email";

const LEARN_ITEMS = [
  "Techniques de coulage et démoulage",
  "Coloration et inclusion d'éléments",
  "Finitions professionnelles",
  "Stratégies de vente et marketing",
];

export function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <section id="formation" className="relative overflow-hidden bg-noir text-blanc">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="/hero-resin-workshop.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-40"
        />
        {/* Gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/85 to-noir/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/40" />
      </div>

      {/* Decorative gold glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#C9A227]/15 blur-[140px] rounded-full glow-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#E8C766]/10 blur-[120px] rounded-full glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/40 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-xs font-medium text-[#C9A227] tracking-[0.2em] uppercase">
                Édition 2026 · 10 places seulement
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-shadow-luxe"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Formation Professionnelle
              <br />
              <span className="gold-shimmer">en Résine Époxy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-blanc/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {TRAINING_INFO.subtitle} Apprenez à créer et vendre des créations
              personnalisées et uniques, faites main, qui marquent les esprits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Button
                onClick={onRegister}
                size="lg"
                className="shine-sweep relative overflow-hidden bg-[#C9A227] text-noir hover:bg-[#D4AF37] rounded-full px-8 h-14 text-base font-semibold tracking-wide shadow-[0_8px_24px_rgba(201,162,39,0.35)] hover:shadow-[0_12px_32px_rgba(201,162,39,0.5)] transition-shadow"
              >
                Je m'inscris maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <a
                href="#creations"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-blanc/30 text-blanc hover:bg-blanc/10 backdrop-blur-sm transition-all text-base font-medium"
              >
                Voir les créations
              </a>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-sm text-[#C9A227] italic tracking-wide"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              « {TRAINING_INFO.slogan} »
            </motion.p>
          </div>

          {/* Right: comprehensive program card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden premium-shadow-xl backdrop-blur-md bg-blanc/10 border border-blanc/20 p-1">
              <div className="rounded-[20px] bg-noir/60 backdrop-blur-lg p-5 sm:p-7">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C9A227] mb-5 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  La formation en bref
                </p>

                {/* Detail rows */}
                <div className="space-y-4">
                  <DetailRow
                    icon={<Calendar className="w-5 h-5" />}
                    label="Dates"
                    value="09 — 11 juillet 2026"
                    sub="Jeu · Ven · Sam"
                  />
                  <Divider />
                  <DetailRow
                    icon={<Clock className="w-5 h-5" />}
                    label="Durée"
                    value="3 jours intensifs"
                    sub="Pratique + théorie"
                  />
                  <Divider />
                  <DetailRow
                    icon={<MapPin className="w-5 h-5" />}
                    label="Lieu"
                    value="Zongo 2, Cotonou"
                    sub={TRAINING_INFO.location}
                    long
                  />
                  <Divider />
                  <DetailRow
                    icon={<Users className="w-5 h-5" />}
                    label="Places"
                    value="10 seulement"
                    sub="Pour un suivi personnalisé"
                  />
                  <Divider />
                  <DetailRow
                    icon={<Award className="w-5 h-5" />}
                    label="Attestation"
                    value="Incluse"
                    sub="À la fin du parcours"
                  />
                </div>

                {/* Price tags */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-blanc/5 border border-blanc/10 p-3 sm:p-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-blanc/50 mb-1">
                      Inscription
                    </p>
                    <p className="text-xl sm:text-2xl font-bold gold-text-gradient">
                      5 000
                    </p>
                    <p className="text-[10px] text-blanc/60">FCFA</p>
                  </div>
                  <div className="rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/40 p-3 sm:p-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A227] mb-1">
                      Complète
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-blanc">25 000</p>
                    <p className="text-[10px] text-blanc/60">FCFA · 3 jours inclus</p>
                  </div>
                </div>

                {/* What you'll learn */}
                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A227] font-semibold mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ce que vous apprendrez
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LEARN_ITEMS.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 bg-blanc/5 rounded-lg p-2.5 border border-blanc/[0.06]"
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5"
                          strokeWidth={2.5}
                        />
                        <span className="text-[11px] text-blanc/80 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -top-4 -left-4 sm:-left-6 bg-[#C9A227] text-noir rounded-full px-5 py-2.5 premium-shadow-xl pulse-gold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">
                Premium
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-12 sm:h-16"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#F8F6F2"
            d="M0,32 C240,72 480,72 720,40 C960,8 1200,8 1440,32 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
  );
}

function DetailRow({
  icon,
  label,
  value,
  sub,
  long = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  long?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0 text-[#C9A227]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-blanc/50">
          {label}
        </p>
        <p className="text-sm sm:text-base font-semibold text-blanc leading-tight mt-0.5">
          {value}
        </p>
        <p
          className={`text-xs text-blanc/60 mt-0.5 ${
            long ? "leading-relaxed" : ""
          }`}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}
