"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import type { View } from "@/app/page";
import { TRAINING_INFO } from "@/lib/email";
import { WhatsAppIcon } from "@/components/brand/PaymentLogos";

export function Footer({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <footer className="mt-auto bg-noir text-blanc relative overflow-hidden">
      {/* Decorative gold glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-[#C9A227]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blanc shadow-[0_2px_12px_rgba(201,162,39,0.2)] border-2 border-[#C9A227] overflow-hidden p-1">
                <img
                  src="/logo_zohar_decor.png"
                  alt="Zohar Décor"
                  className="w-full h-full object-cover rounded-full"
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
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Accueil
                </button>
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
              href={`https://wa.me/${TRAINING_INFO.whatsappNumber}?text=${encodeURIComponent(
                "Bonjour Zohar Décor, je souhaite des informations sur la formation en résine époxy."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1DA851] transition-colors premium-shadow"
            >
              <WhatsAppIcon size={18} className="text-white" />
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
