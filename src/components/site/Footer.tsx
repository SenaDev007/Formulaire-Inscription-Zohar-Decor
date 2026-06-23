"use client";

import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import type { View } from "@/app/page";
import { TRAINING_INFO } from "@/lib/email";

export function Footer({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <footer className="mt-auto bg-noir text-blanc">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blanc border border-[#C9A227]/30">
                <img
                  src="/logo_zohar_decor.png"
                  alt="Zohar Décor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold tracking-wider text-blanc">ZOHAR DÉCOR</p>
                <p className="text-[10px] text-[#C9A227] uppercase tracking-[0.2em]">
                  Résine Époxy
                </p>
              </div>
            </div>
            <p
              className="text-sm text-blanc/60 italic leading-relaxed"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              « {TRAINING_INFO.slogan} »
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-[#C9A227] tracking-[0.2em] uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-blanc/70">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-[#C9A227] transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <a href="#formation" className="hover:text-[#C9A227] transition-colors">
                  Programme
                </a>
              </li>
              <li>
                <a href="#creations" className="hover:text-[#C9A227] transition-colors">
                  Créations
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-[#C9A227] transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C9A227] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-[#C9A227] tracking-[0.2em] uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-blanc/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                <span>{TRAINING_INFO.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                <span className="break-all">{TRAINING_INFO.contactEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed">
                  {TRAINING_INFO.location}
                </span>
              </li>
            </ul>
          </div>

          {/* WhatsApp */}
          <div>
            <h4 className="text-xs font-semibold text-[#C9A227] tracking-[0.2em] uppercase mb-4">
              Écrivez-nous
            </h4>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22900000000"}?text=${encodeURIComponent(
                "Bonjour Zohar Décor, je souhaite des informations sur la formation en résine époxy."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1DA851] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <p className="mt-4 text-xs text-blanc/50">
              Réponse sous 24h, du lundi au samedi.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-blanc/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blanc/50">
            © {new Date().getFullYear()} Zohar Décor. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs text-blanc/50">
            <button
              onClick={() => onNavigate("admin")}
              className="hover:text-[#C9A227] transition-colors"
            >
              Espace Admin
            </button>
            <span className="text-blanc/20">•</span>
            <a href="#" className="hover:text-[#C9A227] transition-colors">
              Conditions d'inscription
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
