"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "@/app/page";
import { BRAND } from "@/lib/constants";

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
  const goAdmin = () => {
    onNavigate("admin");
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blanc/95 backdrop-blur-md shadow-sm border-b border-beige"
          : "bg-blanc/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={goHome}
            className="flex items-center gap-3 group"
            aria-label="Zohar Décor - Accueil"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-beige border-2 border-[#C9A227] transition-transform group-hover:scale-105">
              <img
                src="/logo_zohar_decor.png"
                alt="Logo Zohar Décor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="font-bold text-noir text-base tracking-wider">
                ZOHAR DÉCOR
              </span>
              <span className="text-[10px] text-[#C9A227] uppercase tracking-[0.2em]">
                Résine Époxy
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={goHome}
              className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors"
            >
              Accueil
            </button>
            <a
              href="#formation"
              className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors"
            >
              Formation
            </a>
            <a
              href="#creations"
              className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors"
            >
              Créations
            </a>
            <a
              href="#tarifs"
              className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors"
            >
              Tarifs
            </a>
            <a
              href="#faq"
              className="px-4 py-2 text-sm font-medium text-noir hover:text-[#C9A227] transition-colors"
            >
              FAQ
            </a>
            <button
              onClick={goAdmin}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-noir transition-colors"
            >
              Admin
            </button>
            <Button
              onClick={goRegister}
              className="ml-2 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full"
            >
              Je m'inscris
            </Button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-noir"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-beige"
          >
            <div className="py-3 flex flex-col gap-1">
              <button
                onClick={goHome}
                className="px-4 py-3 text-left text-sm font-medium text-noir hover:bg-beige/50 rounded-md"
              >
                Accueil
              </button>
              <a
                href="#formation"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md"
              >
                Formation
              </a>
              <a
                href="#creations"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md"
              >
                Créations
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md"
              >
                Tarifs
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-noir hover:bg-beige/50 rounded-md"
              >
                FAQ
              </a>
              <button
                onClick={goAdmin}
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-beige/50 rounded-md"
              >
                Espace Admin
              </button>
              <Button
                onClick={goRegister}
                className="mt-2 bg-noir text-blac hover:bg-[#1A1A1A] rounded-full"
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
