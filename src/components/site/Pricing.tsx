"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing({ onRegister }: { onRegister: () => void }) {
  const tiers = [
    {
      name: "Inscription",
      price: "5 000",
      description: "Réservez votre place à la formation",
      features: [
        "Place garantie pour la session 2026",
        "Kit d'accueil inclus",
        "Support de cours imprimé",
        "Accès au groupe WhatsApp des participants",
        "Café et eau compris",
      ],
      cta: "M'inscrire",
      highlighted: false,
    },
    {
      name: "Formation complète",
      price: "25 000",
      description: "Inscription + 3 jours de formation intensive",
      features: [
        "Tout ce qui est inclus dans l'inscription",
        "3 jours de formation pratique (09–11 juillet)",
        "Matériel de résine fourni sur place",
        "Créations réalisées à emporter",
        "Attestation de participation officielle",
        "Suivi post-formation (1 mois)",
        "Conseils pour lancer votre activité",
      ],
      cta: "M'inscrire + Formation",
      highlighted: true,
    },
  ];

  return (
    <section id="tarifs" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-medium text-[#C9A227] tracking-[0.3em] uppercase mb-3">
            Tarifs
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Choisissez votre formule
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Un investissement modeste pour une compétence qui peut devenir une
            véritable source de revenus. Paiement en plusieurs options via
            Mobile Money ou carte bancaire.
          </p>
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
              className={`relative rounded-3xl p-8 ${
                tier.highlighted
                  ? "bg-noir text-blanc premium-shadow-lg"
                  : "bg-blanc text-noir premium-shadow border border-beige"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C9A227] text-noir text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
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

              <div className="mb-6">
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
                className={`w-full h-12 rounded-full font-semibold ${
                  tier.highlighted
                    ? "bg-[#C9A227] text-noir hover:bg-[#D4AF37]"
                    : "bg-noir text-blanc hover:bg-[#1A1A1A]"
                }`}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-4">
            Paiement sécurisé via Flexpay
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "MTN MoMo", color: "#FFCC00", textColor: "#000000" },
              { label: "Moov Money", color: "#1F4E9D", textColor: "#FFFFFF" },
              { label: "Celtiis Cash", color: "#E2231A", textColor: "#FFFFFF" },
              { label: "Carte bancaire", color: "#111111", textColor: "#FFFFFF" },
            ].map((m) => (
              <div
                key={m.label}
                className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: m.color,
                  color: m.textColor,
                }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
