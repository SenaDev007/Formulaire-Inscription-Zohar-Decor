"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-px bg-blanc/[0.06] z-0" />
        {/* Animated progress line */}
        <motion.div
          className="absolute top-4 left-0 h-px bg-[#C9A227]/60 z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center z-10">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? "rgba(201,162,39,0.15)"
                    : isActive
                    ? "rgba(201,162,39,0.15)"
                    : "rgba(248,246,242,0.04)",
                  borderColor: isCompleted
                    ? "#C9A227"
                    : isActive
                    ? "#C9A227"
                    : "rgba(248,246,242,0.12)",
                  boxShadow: isActive ? "0 0 16px rgba(201,162,39,0.35)" : "none",
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  color: isCompleted ? "#C9A227" : isActive ? "#C9A227" : "#6B6157",
                }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  step
                )}
              </motion.div>

              <span
                className={`mt-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-center hidden sm:block w-16 leading-tight truncate
                  ${
                    isActive
                      ? "text-[#C9A227]"
                      : isCompleted
                      ? "text-[#D4AF37]/80"
                      : "text-[#6B6157]"
                  }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile step label */}
      <div className="mt-3 sm:hidden text-center">
        <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[#6B6157]">
          Étape <span className="text-[#C9A227]">{currentStep}</span>/{totalSteps}
          <span className="text-blanc/60 normal-case tracking-normal font-normal">
            {" "}
            — {labels[currentStep - 1]}
          </span>
        </span>
      </div>
    </div>
  );
}
