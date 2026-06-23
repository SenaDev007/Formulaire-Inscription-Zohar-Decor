"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { TrainingInfo } from "@/components/site/TrainingInfo";
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
    if (pay.paymentUrl) {
      // Card payment (or demo mode): redirect to the payment URL
      // - For CARD: FeeXPay returns a hosted page URL
      // - For DEMO: it's our internal /api/payment/demo-confirm endpoint
      // - For MoMo in production: FeeXPay does NOT return a URL — the user
      //   receives a USSD push on their phone, and we poll the status.
      //   In that case, paymentUrl is null and we navigate to confirmation
      //   which will poll until the payment is confirmed.
      window.location.href = pay.paymentUrl;
    } else {
      // Mobile Money (MTN, Moov, Celtiis) — no redirect, the user receives
      // a push on their phone. Navigate to confirmation page which polls.
      navigate("confirmation");
    }
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
                <TrainingInfo />
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
