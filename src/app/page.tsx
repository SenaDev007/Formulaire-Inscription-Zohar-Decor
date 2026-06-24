"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Creations } from "@/components/site/Creations";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { RegistrationForm } from "@/components/site/RegistrationForm";
import { PaymentSection } from "@/components/site/PaymentSection";
import { ConfirmationSection } from "@/components/site/ConfirmationSection";
import { AdminSection } from "@/components/site/AdminSection";
import { FloatingCTA } from "@/components/site/FloatingCTA";

export type View =
  | "home"
  | "register"
  | "payment"
  | "confirmation"
  | "admin";

export type ParticipantSummary = {
  id: string;
  registrationId: string;
  nomComplet: string;
  prenoms: string;
  email: string;
  telWhatsApp: string;
  status: string;
  paymentType?: string | null;
};

export type PaymentSummary = {
  id: string;
  status: string;
  amount: number;
  type: string;
  provider: string;
  feexpayTransaction?: string | null;
  paymentUrl?: string | null;
  createdAt: string;
};

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [participant, setParticipant] = useState<ParticipantSummary | null>(null);
  const [payment, setPayment] = useState<PaymentSummary | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Read view from URL hash on mount + hash changes
  useEffect(() => {
    // === SERMA-HUB pattern: detect FedaPay payment success redirect ===
    const params = new URLSearchParams(window.location.search);
    const isPaid = params.get("payment") === "success" || params.get("status") === "approved";
    if (isPaid) {
      // Clean URL immediately
      window.history.replaceState({}, "", window.location.pathname);

      // Read saved participant data from localStorage
      const saved = localStorage.getItem("zd_pending_payment");
      if (!saved) {
        // Use setTimeout to avoid setState in effect
        setTimeout(() => setView("home"), 0);
        return;
      }

      let parsed: { participantId: string; registrationId: string; prenoms: string };
      try {
        parsed = JSON.parse(saved);
      } catch {
        setTimeout(() => setView("home"), 0);
        return;
      }

      // Send confirmation to API
      fetch("/api/payment/fedapay-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: parsed.participantId }),
      })
        .then((res) => res.json())
        .then((json) => {
          localStorage.removeItem("zd_pending_payment");
          if (json.success && json.registrationId) {
            setRegistrationId(json.registrationId);
            setView("confirmation");
          } else {
            setView("home");
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(() => { setTimeout(() => setView("home"), 0);
          setView("home");
        });
      return;
    }

    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "admin") setView("admin");
      else if (h === "register") setView("register");
      else if (h === "home" || h === "") setView("home");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const navigate = useCallback((v: View) => {
    setView(v);
    if (v === "home") {
      window.location.hash = "";
    } else {
      window.location.hash = v;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRegistered = (p: ParticipantSummary) => {
    setParticipant(p);
    setRegistrationId(p.registrationId);
    navigate("payment");
    toast({
      title: "Inscription enregistrée",
      description: `Votre numéro : ${p.registrationId}. Procédez au paiement.`,
    });
  };

  const handlePaymentInitiated = (pay: PaymentSummary) => {
    setPayment(pay);
    // FedaPay checkout completed — go to confirmation page
    navigate("confirmation");
  };

  const handlePaymentComplete = () => {
    navigate("confirmation");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onNavigate={navigate} currentView={view} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {view === "home" && (
              <>
                <Hero onRegister={() => navigate("register")} />
                <Creations />
                <Pricing onRegister={() => navigate("register")} />
                <FAQ />
              </>
            )}

            {view === "register" && (
              <RegistrationForm
                onRegistered={handleRegistered}
                onBack={() => navigate("home")}
              />
            )}

            {view === "payment" && participant && (
              <PaymentSection
                participant={participant}
                onPaymentInitiated={handlePaymentInitiated}
                onBack={() => navigate("register")}
              />
            )}

            {view === "confirmation" && registrationId && (
              <ConfirmationSection
                registrationId={registrationId}
                onBackHome={() => navigate("home")}
              />
            )}

            {view === "admin" && <AdminSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigate} />
      <FloatingCTA show={view === "home"} onClick={() => navigate("register")} />
    </div>
  );
}
