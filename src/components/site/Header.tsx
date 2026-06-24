"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "@/app/page";

export function Header({
  onNavigate,
  currentView,
}: {
  onNavigate: (v: View) => void;
  currentView: View;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goHome = () => {
    onNavigate("home");
    setMobileOpen(false);
  };
  const goRegister = () => {
    onNavigate("register");
    setMobileOpen(false);
  };
  const goFormation = () => {
    onNavigate("formation");
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blanc/95 backdrop-blur-md shadow-[0_2px_20px_rgba(17,17,17,0.06)] border-b border-beige/60"
          : "bg-blanc/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={goHome}
            className="flex items-center gap-3 group"
            aria-label="Zohar Décor - Accueil"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blanc shadow-[0_2px_12px_rgba(201,162,39,0.15)] border-2 border-[#C9A227] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(201,162,39,0.3)] group-hover:scale-105 overflow-hidden p-0.5">
              <img
                src="/logo_zohar_decor.png"
                alt="Logo Zohar Décor"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-bold text-noir text-sm sm:text-base tracking-wider">
                ZOHAR DÉCOR
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#C9A227] uppercase tracking-[0.15em] flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                Résine Époxy
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Accueil", action: goHome },
              { label: "Créations", href: "#creations" },
              { label: "Tarifs", href: "#tarifs" },
              { label: "FAQ", href: "#faq" },
              { label: "Formation", action: goFormation },
            ].map((item) =>
              "action" in item ? (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-[#C9A227] transition-all duration-300" />
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-[#C9A227] transition-all duration-300" />
                </a>
              )
            )}
            <Button
              onClick={goRegister}
              className="shine-sweep relative overflow-hidden ml-3 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full h-10 px-6 text-sm font-semibold shadow-[0_4px_14px_rgba(17,17,17,0.15)] hover:shadow-[0_8px_22px_rgba(17,17,17,0.22)] transition-shadow"
            >
              Je m'inscris
            </Button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-noir rounded-lg hover:bg-beige/50 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-beige/60"
          >
            <div className="py-3 flex flex-col gap-1">
              <button
                onClick={goHome}
                className="px-4 py-3 text-left text-sm font-medium text-noir hover:bg-beige/50 rounded-md transition-colors"
              >
                Accueil
              </button>
              <a
                href="#creations"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md transition-colors"
              >
                Créations
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md transition-colors"
              >
                Tarifs
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md transition-colors"
              >
                FAQ
              </a>
              <Button
                onClick={goRegister}
                className="mt-2 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full h-12"
              >
                Je m'inscris maintenant
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
