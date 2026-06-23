"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FloatingCTA({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-40 bg-[#C9A227] text-noir rounded-full px-6 py-4 premium-shadow-lg flex items-center gap-2 font-semibold hover:bg-[#D4AF37] transition-colors group"
        >
          <span className="text-sm">Je m'inscris</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
