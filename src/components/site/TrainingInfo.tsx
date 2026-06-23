"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { TRAINING_INFO } from "@/lib/email";

export function TrainingInfo() {
  const items = [
    {
      icon: CalendarDays,
      label: "Dates",
      value: `Du 09 au 11 juillet 2026`,
      sub: "3 jours intensifs",
      accent: "from-[#C9A227] to-[#E8C766]",
    },
    {
      icon: Clock,
      label: "Durée",
      value: "3 jours de formation",
      sub: "Pratique + théorie",
      accent: "from-[#111111] to-[#2A2A2A]",
    },
    {
      icon: Users,
      label: "Capacité",
      value: "10 places seulement",
      sub: "Suivi personnalisé",
      accent: "from-[#C9A227] to-[#D4AF37]",
    },
    {
      icon: CreditCard,
      label: "Inscription",
      value: "5 000 FCFA",
      sub: "Réserve votre place",
      accent: "from-[#111111] to-[#1A1A1A]",
    },
    {
      icon: Award,
      label: "Attestation",
      value: "Incluse",
      sub: "À la fin du parcours",
      accent: "from-[#C9A227] to-[#E8C766]",
    },
    {
      icon: MapPin,
      label: "Lieu",
      value: "Zongo 2, Cotonou",
      sub: TRAINING_INFO.location,
      long: true,
      accent: "from-[#111111] to-[#2A2A2A]",
    },
  ];

  return (
    <section id="formation" className="py-20 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative gold dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, #C9A227 1px, transparent 1px), radial-gradient(circle at 75% 70%, #C9A227 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-medium text-[#C9A227] tracking-[0.3em] uppercase mb-3"
          >
            Programme
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Tout ce qu'il faut savoir
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
          >
            Une formation intensive, pratique et professionnelle pour maîtriser
            l'art de la résine époxy. Trois jours pour transformer votre
            créativité en expertise et en revenus.
          </motion.p>
          <div className="section-divider w-32 mx-auto mt-6" />
        </div>

        {/* Info cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group card-lift relative bg-blanc rounded-2xl p-6 premium-shadow border border-beige hover:border-[#C9A227]/40 hover:premium-shadow-lg ${
                item.long ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center flex-shrink-0 icon-bounce shadow-lg`}
                >
                  <item.icon className="w-6 h-6 text-blanc" strokeWidth={2} />
                  {/* glow */}
                  <div className="absolute inset-0 rounded-2xl bg-[#C9A227]/30 blur-md -z-10 opacity-0 group-hover:opacity-60 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-[#C9A227] tracking-[0.2em] uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="text-noir font-bold text-base sm:text-lg leading-snug">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-noir rounded-3xl overflow-hidden relative"
        >
          {/* Animated gold glow */}
          <div className="absolute inset-0 opacity-20 bg-pan"
            style={{
              backgroundImage:
                "linear-gradient(120deg, transparent 0%, #C9A227 30%, transparent 60%, #E8C766 80%, transparent 100%)",
            }}
          />
          <div className="relative p-8 sm:p-12 grid sm:grid-cols-3 gap-8 items-center">
            <PriceColumn
              label="Inscription"
              amount="5 000"
              sub="Réservez votre place"
              highlighted={false}
            />
            <div className="hidden sm:block w-px h-24 bg-gradient-to-b from-transparent via-[#C9A227]/40 to-transparent mx-auto" />
            <PriceColumn
              label="Formation complète"
              amount="25 000"
              sub="Inscription + 3 jours inclus"
              highlighted={true}
            />
            <div className="hidden sm:block w-px h-24 bg-gradient-to-b from-transparent via-[#C9A227]/40 to-transparent mx-auto" />
            <div className="text-center sm:text-right">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 mb-3">
                <Award className="w-7 h-7 text-[#C9A227]" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2">
                Attestation
              </p>
              <p className="text-2xl font-bold text-blanc">Incluse</p>
              <p className="text-xs text-blanc/60 mt-1">
                À la fin de la formation
              </p>
            </div>
          </div>
        </motion.div>

        {/* What you'll learn — bonus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            "Techniques de coulage et démoulage",
            "Coloration et inclusion d'éléments",
            "Finitions professionnelles",
            "Stratégies de vente et marketing",
          ].map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-blanc rounded-xl p-4 premium-shadow border border-beige"
            >
              <CheckCircle2 className="w-5 h-5 text-[#C9A227] flex-shrink-0" strokeWidth={2.5} />
              <p className="text-sm text-noir font-medium leading-tight">{item}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PriceColumn({
  label,
  amount,
  sub,
  highlighted,
}: {
  label: string;
  amount: string;
  sub: string;
  highlighted: boolean;
}) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2">
        {label}
      </p>
      <p className="text-4xl sm:text-5xl font-bold text-blanc leading-none">
        {amount}
        <span className="text-xl text-blanc/60 ml-1">FCFA</span>
      </p>
      <p className="text-xs text-blanc/60 mt-2">{sub}</p>
      {highlighted && (
        <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold">
          Recommandé
        </span>
      )}
    </div>
  );
}
