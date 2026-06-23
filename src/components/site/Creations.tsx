"use client";

import { motion } from "framer-motion";
import { KeyRound, PenTool, Gem, BookMarked, Frame, Wand2, ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

const creations = [
  {
    id: "porte-cles",
    label: "Porte-clés",
    desc: "Des porte-clés uniques, personnalisés avec photos, fleurs séchées, paillettes et couleurs.",
    icon: KeyRound,
    image: "/creations/porte-cles.png",
  },
  {
    id: "stylos",
    label: "Stylos personnalisés",
    desc: "Stylos élégants en résine, idéaux pour cadeaux d'entreprise, mariages et événements.",
    icon: PenTool,
    image: "/creations/stylos.png",
  },
  {
    id: "bijoux",
    label: "Bijoux",
    desc: "Bijoux raffinés en résine époxy : pendentifs, boucles d'oreilles, bracelets uniques.",
    icon: Gem,
    image: "/creations/bijoux.png",
  },
  {
    id: "blocs-notes",
    label: "Blocs-notes",
    desc: "Blocs-notes et carnets couverts de résine, parfaits pour offrir ou se faire plaisir.",
    icon: BookMarked,
    image: "/creations/blocs-notes.png",
  },
  {
    id: "tableaux",
    label: "Tableaux décoratifs",
    desc: "Tableaux d'art en résine pour décorer votre intérieur avec une touche moderne et unique.",
    icon: Frame,
    image: "/creations/tableaux.png",
  },
  {
    id: "personnalises",
    label: "Créations sur-mesure",
    desc: "Objets décoratifs personnalisés selon vos envies et événements (mariages, anniversaires...).",
    icon: Wand2,
    image: "/creations/sur-mesure.png",
  },
];

export function Creations() {
  return (
    <section id="creations" className="py-20 sm:py-24 bg-beige/30 relative overflow-hidden">
      {/* Subtle gold pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C9A227 1px, transparent 1px)",
          backgroundSize: "32px 32px",
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
            Nos créations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Apprenez à créer des pièces d'exception
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
          >
            Pendant la formation, vous apprendrez à concevoir et réaliser
            chacune de ces créations. Chaque pièce est unique, faite main, et
            peut devenir une source de revenus durable.
          </motion.p>
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
              className="group relative bg-blanc rounded-2xl overflow-hidden premium-shadow border border-beige card-lift hover:premium-shadow-lg hover:border-[#C9A227]/40"
            >
              {/* Image with overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />

                {/* Icon badge floating on image */}
                <div className="absolute top-4 right-4 w-11 h-11 rounded-xl bg-blanc/95 backdrop-blur-sm flex items-center justify-center premium-shadow icon-bounce">
                  <c.icon className="w-5 h-5 text-[#C9A227]" strokeWidth={2} />
                </div>

                {/* Label on image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-blanc text-shadow-luxe">
                    {c.label}
                  </h3>
                </div>

                {/* Hover "voir plus" arrow */}
                <div className="absolute inset-0 bg-noir/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <ArrowUpRight className="w-6 h-6 text-noir" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
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
          className="mt-14 relative bg-noir rounded-3xl overflow-hidden premium-shadow-xl"
        >
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 50%, #C9A227 0%, transparent 60%)",
              }}
            />
          </div>
          <div className="relative p-8 sm:p-12 text-center">
            <p
              className="text-2xl sm:text-3xl text-blanc font-semibold italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              « {BRAND.slogan} »
            </p>
            <p className="mt-3 text-sm text-[#C9A227] tracking-[0.3em] uppercase">
              — Zohar Décor
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
