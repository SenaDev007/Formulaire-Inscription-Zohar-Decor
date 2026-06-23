"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";

const creations = [
  {
    id: "porte-cles",
    label: "Porte-clés",
    desc: "Des porte-clés uniques, personnalisés avec photos, fleurs séchées, paillettes et couleurs.",
    icon: "🔑",
    gradient: "from-[#C9A227] to-[#E8C766]",
  },
  {
    id: "stylos",
    label: "Stylos personnalisés",
    desc: "Stylos élégants en résine, idéaux pour cadeaux d'entreprise, mariages et événements.",
    icon: "🖊️",
    gradient: "from-[#111111] to-[#2A2A2A]",
  },
  {
    id: "bijoux",
    label: "Bijoux",
    desc: "Bijoux raffinés en résine époxy : pendentifs, boucles d'oreilles, bracelets uniques.",
    icon: "💍",
    gradient: "from-[#C9A227] to-[#D4AF37]",
  },
  {
    id: "blocs-notes",
    label: "Blocs-notes",
    desc: "Blocs-notes et carnets couverts de résine, parfaits pour offrir ou se faire plaisir.",
    icon: "📓",
    gradient: "from-[#1A1A1A] to-[#3A3A3A]",
  },
  {
    id: "tableaux",
    label: "Tableaux décoratifs",
    desc: "Tableaux d'art en résine pour décorer votre intérieur avec une touche moderne et unique.",
    icon: "🖼️",
    gradient: "from-[#C9A227] to-[#B08D1E]",
  },
  {
    id: "personnalises",
    label: "Créations sur-mesure",
    desc: "Objets décoratifs personnalisés selon vos envies et événements (mariages, anniversaires...).",
    icon: "✨",
    gradient: "from-[#111111] to-[#C9A227]",
  },
];

export function Creations() {
  return (
    <section id="creations" className="py-20 bg-beige/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-medium text-[#C9A227] tracking-[0.3em] uppercase mb-3">
            Nos créations
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Apprenez à créer des pièces d'exception
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Pendant la formation, vous apprendrez à concevoir et réaliser
            chacune de ces créations. Chaque pièce est unique, faite main, et
            peut devenir une source de revenus durable.
          </p>
          <div className="section-divider w-32 mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative bg-blanc rounded-2xl overflow-hidden premium-shadow border border-beige hover:premium-shadow-lg transition-all"
            >
              {/* Top visual band */}
              <div
                className={`relative h-40 bg-gradient-to-br ${c.gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-90 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                    {c.icon}
                  </span>
                </div>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-noir mb-2">{c.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-blanc rounded-2xl p-8 premium-shadow border border-beige text-center"
        >
          <p
            className="text-2xl sm:text-3xl text-noir font-semibold italic"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            « {BRAND.slogan} »
          </p>
          <p className="mt-3 text-sm text-[#C9A227] tracking-[0.3em] uppercase">
            — Zohar Décor
          </p>
        </motion.div>
      </div>
    </section>
  );
}
