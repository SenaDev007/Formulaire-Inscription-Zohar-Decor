"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  CreditCard,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { ParticipantSummary } from "@/app/page";
import { TRAINING_INFO } from "@/lib/email";
import { MultiStepRegistrationForm } from "./register/MultiStepRegistrationForm";

const INFO_ITEMS = [
  {
    icon: CalendarDays,
    label: "Dates",
    value: "09 — 11 juillet 2026",
    sub: "Jeu · Ven · Sam",
  },
  {
    icon: Clock,
    label: "Durée",
    value: "3 jours intensifs",
    sub: "Pratique + théorie",
  },
  {
    icon: CreditCard,
    label: "Inscription",
    value: "5 000 FCFA",
    sub: "Réserve votre place",
  },
  {
    icon: Users,
    label: "Places",
    value: "10 max",
    sub: "par cohorte",
  },
];

const CREATIONS_LIST = [
  "Porte-clés personnalisés (fleurs, photos, paillettes)",
  "Stylos élégants en résine (cadeaux d'entreprise)",
  "Bijoux raffinés (pendentifs, boucles d'oreilles)",
  "Blocs-notes et carnets décorés",
  "Tableaux d'art abstraits en résine",
  "Créations sur-mesure pour événements",
];

export function RegistrationForm({
  onRegistered,
  onBack,
}: {
  onRegistered: (p: ParticipantSummary) => void;
  onBack: () => void;
}) {
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
          Retour à l'accueil
        </button>

        <div className="lg:grid lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_560px] lg:gap-10 xl:gap-14 lg:items-start">
          {/* ============ LEFT PANEL (branding + info, sticky) ============ */}
          <div className="lg:sticky lg:top-8 mb-8 lg:mb-0">
            <motion.header
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center lg:text-left mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-full bg-blanc shadow-[0_2px_12px_rgba(201,162,39,0.3)] border-2 border-[#C9A227] overflow-hidden p-1">
                  <img
                    src="/logo_zohar_decor.png"
                    alt="Zohar Décor"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h1
                    className="font-syne text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight leading-none"
                    style={{
                      fontFamily:
                        "var(--font-playfair), Georgia, serif",
                    }}
                  >
                    <span className="text-blanc">ZOHAR</span>
                    <span className="gold-text-gradient"> DÉCOR</span>
                  </h1>
                  <p className="text-[10px] sm:text-[11px] font-semibold tracking-[5px] sm:tracking-[6px] text-[#C9A227] uppercase mt-1.5">
                    Résine Époxy
                  </p>
                </div>
              </div>

              <h2
                className="text-lg xs:text-xl sm:text-2xl font-bold text-blanc mt-5 mb-2 leading-snug"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Inscription à la Formation
              </h2>
              <p className="text-blanc/60 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                Apprenez à créer et vendre des créations personnalisées en
                résine époxy. Places limitées — inscrivez-vous dès maintenant.
              </p>

              {/* Live badge */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30">
                <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse flex-shrink-0" />
                <span className="text-[#C9A227] text-[11px] xs:text-xs font-semibold">
                  Inscriptions ouvertes — 10 places disponibles
                </span>
              </div>
            </motion.header>

            {/* Info items grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 xs:gap-3 mb-5 sm:mb-6"
            >
              {INFO_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
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
                </motion.div>
              ))}
            </motion.div>

            {/* What you'll create */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-3 mb-5 sm:mb-6"
            >
              <p className="text-[#C9A227] text-[10px] xs:text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Ce que vous apprendrez à créer
              </p>

              <div className="bg-[#1A1A1A] border border-[#C9A227]/20 rounded-xl p-3 xs:p-4">
                <ul className="space-y-1.5">
                  {CREATIONS_LIST.map((obj) => (
                    <li
                      key={obj}
                      className="flex items-start gap-1.5"
                    >
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-px"
                        aria-hidden="true"
                      />
                      <span className="text-blanc/80 text-[11px] xs:text-xs leading-snug">
                        {obj}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Location + contact card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1A1A1A] border border-[#C9A227]/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <MapPin
                  className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-blanc font-semibold text-[10px] xs:text-xs uppercase tracking-wider mb-1">
                    Lieu de la formation
                  </p>
                  <p className="text-blanc/70 text-xs leading-relaxed break-words">
                    {TRAINING_INFO.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award
                  className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-blanc font-semibold text-[10px] xs:text-xs uppercase tracking-wider mb-1">
                    Attestation
                  </p>
                  <p className="text-blanc/70 text-xs leading-relaxed">
                    {TRAINING_INFO.attestation}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center gap-3 mt-4"
            >
              <a
                href={`tel:${TRAINING_INFO.contactPhone}`}
                className="inline-flex items-center gap-1.5 text-[#C9A227] text-xs font-semibold hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                {TRAINING_INFO.contactPhone}
              </a>
              <span className="text-blanc/20">·</span>
              <a
                href={`mailto:${TRAINING_INFO.contactEmail}`}
                className="inline-flex items-center gap-1.5 text-[#C9A227] text-xs font-semibold hover:text-[#D4AF37] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="break-all">{TRAINING_INFO.contactEmail}</span>
              </a>
            </motion.div>
          </div>

          {/* ============ RIGHT PANEL (multi-step form) ============ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1A1A1A] border border-[#C9A227]/30 rounded-2xl p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            <MultiStepRegistrationForm onRegistered={onRegistered} />
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
