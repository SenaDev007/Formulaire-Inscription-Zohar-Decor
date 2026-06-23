"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRAINING_INFO } from "@/lib/email";

export function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="relative overflow-hidden bg-noir text-blanc">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, #C9A227 1px, transparent 1px), radial-gradient(circle at 75% 70%, #C9A227 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A227]/10 blur-[120px] rounded-full" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 mb-6"
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
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Formation Professionnelle
              <br />
              <span className="gold-text-gradient">en Résine Époxy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-blanc/70 max-w-xl mx-auto lg:mx-0"
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
                className="bg-[#C9A227] text-noir hover:bg-[#D4AF37] rounded-full px-8 h-14 text-base font-semibold tracking-wide"
              >
                Je m'inscris maintenant
              </Button>
              <a
                href="#formation"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-blanc/20 text-blanc hover:bg-blanc/5 transition-colors text-base font-medium"
              >
                Voir le programme
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

          {/* Right: visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden premium-shadow-lg bg-blanc">
              <img
                src="/logo_zohar_decor.png"
                alt="Zohar Décor"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />

              {/* Floating info chips */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                <div className="bg-blanc/95 backdrop-blur-sm rounded-lg p-3 premium-shadow">
                  <div className="flex items-center gap-2 text-noir">
                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Dates
                      </p>
                      <p className="text-sm font-semibold">
                        09–11 juillet 2026
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blanc/95 backdrop-blur-sm rounded-lg p-3 premium-shadow">
                  <div className="flex items-center gap-2 text-noir">
                    <Users className="w-4 h-4 text-[#C9A227]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Places
                      </p>
                      <p className="text-sm font-semibold">10 seulement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating price badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-4 -left-4 sm:-left-8 bg-[#C9A227] text-noir rounded-full px-5 py-2.5 premium-shadow-lg"
            >
              <p className="text-[10px] uppercase tracking-wider font-medium">
                Inscription
              </p>
              <p className="text-xl font-bold leading-none">5 000 FCFA</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
