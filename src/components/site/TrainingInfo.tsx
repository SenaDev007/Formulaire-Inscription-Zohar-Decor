"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CreditCard,
} from "lucide-react";
import { TRAINING_INFO } from "@/lib/email";

export function TrainingInfo() {
  const items = [
    {
      icon: Calendar,
      label: "Dates",
      value: `Du ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}`,
    },
    {
      icon: Clock,
      label: "Durée",
      value: TRAINING_INFO.duration,
    },
    {
      icon: MapPin,
      label: "Lieu",
      value: TRAINING_INFO.location,
      long: true,
    },
    {
      icon: Users,
      label: "Places",
      value: `${TRAINING_INFO.capacity} places seulement`,
    },
    {
      icon: CreditCard,
      label: "Frais d'inscription",
      value: `${new Intl.NumberFormat("fr-FR").format(TRAINING_INFO.inscriptionFee)} FCFA`,
    },
    {
      icon: Award,
      label: "Attestation",
      value: TRAINING_INFO.attestation,
    },
  ];

  return (
    <section id="formation" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-medium text-[#C9A227] tracking-[0.3em] uppercase mb-3">
            Programme
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Tout ce qu'il faut savoir
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Une formation intensive, pratique et professionnelle pour maîtriser
            l'art de la résine époxy. Trois jours pour transformer votre
            créativité en expertise et en revenus.
          </p>
          <div className="section-divider w-32 mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`bg-blanc rounded-2xl p-6 premium-shadow border border-beige hover:border-[#C9A227]/40 transition-colors ${
                item.long ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-beige flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="text-noir font-semibold text-base leading-snug">
                    {item.value}
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
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, #C9A227 0%, transparent 50%)",
              }}
            />
          </div>
          <div className="relative p-8 sm:p-12 grid sm:grid-cols-3 gap-8 items-center">
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2">
                Inscription
              </p>
              <p className="text-4xl font-bold text-blanc">
                5 000 <span className="text-xl text-blanc/60">FCFA</span>
              </p>
              <p className="text-xs text-blanc/60 mt-1">
                Réservez votre place
              </p>
            </div>
            <div className="text-center border-l border-r border-blanc/10 sm:px-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2">
                Formation complète
              </p>
              <p className="text-4xl font-bold text-blanc">
                25 000 <span className="text-xl text-blanc/60">FCFA</span>
              </p>
              <p className="text-xs text-blanc/60 mt-1">
                Inscription + 3 jours inclus
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2">
                Attestation
              </p>
              <p className="text-2xl font-bold text-blanc">
                Incluse
              </p>
              <p className="text-xs text-blanc/60 mt-1">
                À la fin de la formation
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
