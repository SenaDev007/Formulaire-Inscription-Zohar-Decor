"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Mail,
  Home,
  Calendar,
  MapPin,
  Copy,
  RotateCcw,
  MessageCircle,
  Phone,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TRAINING_INFO } from "@/lib/email";
import { WhatsAppIcon } from "@/components/brand/PaymentLogos";

type Status = "loading" | "paid" | "pending" | "error";

type ConfirmationData = {
  participant: {
    id: string;
    registrationId: string;
    nomComplet: string;
    prenoms: string;
    email: string;
    telWhatsApp: string;
    status: string;
    paymentType?: string | null;
    createdAt: string;
  };
  payment: {
    id: string;
    status: string;
    amount: number;
    type: string;
    provider: string;
    feexpayTransaction?: string | null;
    paymentUrl?: string | null;
    createdAt: string;
  } | null;
};

export function ConfirmationSection({
  registrationId,
  onBackHome,
}: {
  registrationId: string;
  onBackHome: () => void;
}) {
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [zoharConfirmLink, setZoharConfirmLink] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/confirmation?registrationId=${encodeURIComponent(registrationId)}`
        );
        const json = await res.json();
        if (!mounted) return;
        if (!json.success) {
          setStatus("error");
          return;
        }
        setData(json);
        const paid =
          json.participant?.status === "PAID_INSCRIPTION" ||
          json.participant?.status === "PAID_FULL" ||
          json.participant?.status === "VALIDATED";
        // Check if payment failed
        const failed = json.payment?.status === "FAILED";
        if (paid) {
          setStatus("paid");
          // Fetch WhatsApp link
          try {
            const waRes = await fetch(
              `/api/whatsapp/confirm-link?registrationId=${encodeURIComponent(registrationId)}`
            );
            const waJson = await waRes.json();
            if (waJson.success) setWhatsappLink(waJson.link);
            // Also fetch the Zohar → participant confirmation link
            try {
              const wa2Res = await fetch(
                `/api/whatsapp/zohar-to-participant?registrationId=${encodeURIComponent(registrationId)}`
              );
              const wa2Json = await wa2Res.json();
              if (wa2Json.success) setZoharConfirmLink(wa2Json.link);
            } catch { /* ignore */ }
          } catch {
            /* ignore */
          }
        } else if (failed) {
          setStatus("error");
          if (interval) clearInterval(interval);
        } else {
          setStatus("pending");
          setPollCount((c) => c + 1);
        }
      } catch {
        if (mounted) setStatus("error");
      }
    };

    poll();
    interval = setInterval(poll, 4000);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, [registrationId]);

  // === Confetti on success ===
  useEffect(() => {
    if (status !== "paid") return;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#C9A227", "#E8C766", "#FFFFFF"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#C9A227", "#E8C766", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [status]);

  const copyRegId = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.participant.registrationId);
    toast({ title: "Copié", description: "Numéro d'inscription copié." });
  };

  // === Loading state ===
  if (status === "loading") {
    return (
      <section className="min-h-screen bg-noir flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin mx-auto" />
          <p className="mt-4 text-blanc/60 text-sm">
            Vérification du paiement...
          </p>
        </div>
      </section>
    );
  }

  // === Error state ===
  if (status === "error") {
    // Determine the specific error reason
    const paymentStatus = data?.payment?.status;
    const isPaymentFailed = paymentStatus === "FAILED";

    // Map FeexPay failure reasons to user-friendly messages
    let errorTitle = "Inscription introuvable";
    let errorMsg = `Le numéro ${registrationId} n'existe pas ou n'a pas pu être retrouvé.`;

    if (isPaymentFailed) {
      errorTitle = "Paiement échoué";
      errorMsg =
        "Votre paiement n'a pas abouti. Vérifiez que :\n" +
        "• Votre numéro est bien enregistré au Mobile Money (MTN, Moov ou Celtiis)\n" +
        "• Votre solde est suffisant\n" +
        "• Vous n'avez pas de limite bloquant les transactions\n\n" +
        "Réessayez avec un autre numéro ou un autre moyen de paiement.";
    }

    return (
      <section className="min-h-screen bg-noir flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] rounded-2xl border border-red-500/30 p-8 max-w-md text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-blanc mt-4">
            {errorTitle}
          </h2>
          <p className="text-sm text-blanc/60 mt-2 whitespace-pre-line">
            {errorMsg}
          </p>
          <div className="mt-6 space-y-3">
            <Button
              onClick={() => window.history.back()}
              className="w-full bg-[#C9A227] text-noir hover:bg-[#D4AF37] rounded-full"
            >
              Réessayer le paiement
            </Button>
            <Button
              onClick={onBackHome}
              variant="outline"
              className="w-full rounded-full border-blanc/20 text-blanc hover:bg-blanc/5"
            >
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  // === Pending state ===
  if (status === "pending" && data) {
    const isMoMo = data.payment?.provider && data.payment.provider !== "CARD";
    return (
      <section className="min-h-screen bg-noir flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] rounded-2xl border border-[#C9A227]/30 p-8 max-w-md text-center shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <div className="w-16 h-16 rounded-full bg-[#C9A227]/15 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-blanc mt-4">
            Paiement en cours...
          </h1>
          <p className="text-sm text-blanc/60 mt-2">
            {isMoMo ? (
              <>
                <strong className="text-blanc">Confirmez le paiement sur votre téléphone.</strong>
                <br />Une notification Mobile Money a été envoyée au numéro{" "}
                <strong className="text-blanc">{data.participant.telWhatsApp}</strong>.
                Validez-la pour finaliser.
              </>
            ) : (
              "Nous vérifions votre paiement. Cette page s'actualise automatiquement."
            )}
            {pollCount > 3 && " Cela peut prendre quelques instants."}
          </p>

          <div className="mt-6 bg-[#0A0A0A] rounded-xl p-4 text-left border border-[#C9A227]/20">
            <p className="text-[10px] uppercase tracking-wider text-blanc/40">
              N° Inscription
            </p>
            <p className="font-bold text-[#C9A227] text-lg mt-1">
              {data.participant.registrationId}
            </p>
          </div>

          {data.payment?.paymentUrl && (
            <a
              href={data.payment.paymentUrl}
              className="block mt-4 text-sm text-[#C9A227] hover:text-[#D4AF37] transition-colors"
            >
              Retourner à la page de paiement →
            </a>
          )}

          <Button
            onClick={onBackHome}
            variant="outline"
            className="mt-6 rounded-full border-blanc/20 text-blanc hover:bg-blanc/5"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </section>
    );
  }

  // === PAID — Success screen with confetti ===
  const amount = data?.payment?.amount ?? TRAINING_INFO.inscriptionFee;
  const formatted = new Intl.NumberFormat("fr-FR").format(amount);

  return (
    <section className="min-h-screen bg-noir text-blanc relative overflow-hidden">
      {/* Decorative gold blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#C9A227]/8 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#E8C766]/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#C9A227]/15 border-2 border-[#C9A227] mx-auto mb-6 flex items-center justify-center shadow-[0_0_32px_rgba(201,162,39,0.4)]"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            >
              <CheckCircle2
                className="w-12 h-12 sm:w-14 sm:h-14 text-[#C9A227]"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1
              className="text-2xl sm:text-3xl font-bold text-blanc mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Félicitations {data?.participant.prenoms} !
            </h1>
            <p className="text-blanc/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Votre inscription a été enregistrée avec succès. Un email de
              confirmation avec votre reçu a été envoyé à{" "}
              <strong className="text-blanc">
                {data?.participant.email}
              </strong>
              .
            </p>
          </motion.div>
        </motion.div>

        {/* Registration ID card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-8 bg-gradient-to-br from-[#C9A227]/15 to-[#1A1A1A] border border-[#C9A227]/40 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-blanc/50 mb-1">
                Numéro d'inscription
              </p>
              <p
                className="text-2xl sm:text-3xl font-bold gold-text-gradient tracking-wider"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {data?.participant.registrationId}
              </p>
            </div>
            <button
              onClick={copyRegId}
              className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#C9A227]/20 hover:border-[#C9A227]/50 transition-colors"
              aria-label="Copier"
            >
              <Copy className="w-4 h-4 text-[#C9A227]" />
            </button>
          </div>
        </motion.div>

        {/* Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 text-left"
        >
          <div className="bg-[#1A1A1A] rounded-xl p-3 border border-[#C9A227]/20">
            <Calendar className="w-4 h-4 text-[#C9A227] mb-1.5" />
            <p className="text-[#C9A227] text-[9px] font-semibold uppercase tracking-wider mb-0.5">
              Dates
            </p>
            <p className="text-blanc text-[11px] font-bold leading-tight">
              09 — 11 juillet
            </p>
            <p className="text-blanc/40 text-[9px]">2026</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-3 border border-[#C9A227]/20">
            <Award className="w-4 h-4 text-[#C9A227] mb-1.5" />
            <p className="text-[#C9A227] text-[9px] font-semibold uppercase tracking-wider mb-0.5">
              Paiement
            </p>
            <p className="text-blanc text-[11px] font-bold leading-tight">
              {formatted} FCFA
            </p>
            <p className="text-blanc/40 text-[9px]">
              {data?.payment?.type === "FORMATION" ? "Formation" : "Inscription"}
            </p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-3 border border-[#C9A227]/20">
            <Mail className="w-4 h-4 text-[#C9A227] mb-1.5" />
            <p className="text-[#C9A227] text-[9px] font-semibold uppercase tracking-wider mb-0.5">
              Email
            </p>
            <p className="text-blanc text-[11px] font-bold leading-tight">
              Reçu envoyé
            </p>
            <p className="text-blanc/40 text-[9px]">vérifiez spam</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-3 border border-[#C9A227]/20">
            <Phone className="w-4 h-4 text-[#C9A227] mb-1.5" />
            <p className="text-[#C9A227] text-[9px] font-semibold uppercase tracking-wider mb-0.5">
              Contact
            </p>
            <p className="text-blanc text-[11px] font-bold leading-tight">
              {TRAINING_INFO.contactPhone}
            </p>
            <p className="text-blanc/40 text-[9px]">WhatsApp</p>
          </div>
        </motion.div>

        {/* Training details card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-4 bg-[#1A1A1A] border border-[#C9A227]/20 rounded-xl p-5"
        >
          <p className="text-[#C9A227] text-[10px] font-semibold uppercase tracking-wider mb-3">
            Détails de la formation
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
              <span className="text-blanc/80">
                Du <strong className="text-blanc">09 juillet</strong> au{" "}
                <strong className="text-blanc">11 juillet 2026</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
              <span className="text-blanc/70 text-xs leading-relaxed">
                {TRAINING_INFO.location}
              </span>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Group CTA — highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-4 bg-gradient-to-br from-[#25D366]/20 to-[#1A1A1A] border border-[#25D366]/40 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center flex-shrink-0">
              <WhatsAppIcon size={20} className="text-[#25D366]" />
            </div>
            <div>
              <p className="text-[#25D366] text-[10px] font-semibold uppercase tracking-wider mb-1">
                Étape suivante
              </p>
              <p className="text-blanc font-bold text-sm leading-tight">
                Rejoignez le groupe WhatsApp des participants
              </p>
            </div>
          </div>
          <p className="text-blanc/60 text-[11px] leading-relaxed mb-3">
            Échangez avec les autres participants, recevez les annonces importantes
            et le lien de la formation.
          </p>
          <a
            href={TRAINING_INFO.whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shine-sweep relative overflow-hidden w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1DA851] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
          >
            <WhatsAppIcon size={18} className="text-white" />
            Rejoindre le groupe
          </a>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="mt-6 space-y-3"
        >
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-[#25D366]/40 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/10 transition-all"
            >
              <WhatsAppIcon size={18} className="text-[#25D366]" />
              Confirmer mon paiement à Zohar Décor
            </a>
          )}

          {zoharConfirmLink && (
            <a
              href={zoharConfirmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#1DA851] transition-all shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
            >
              <WhatsAppIcon size={18} className="text-white" />
              Confirmation de Zohar Décor (place réservée)
            </a>
          )}

          <button
            onClick={onBackHome}
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-[#C9A227]/30 text-blanc/70 text-sm font-semibold hover:bg-blanc/5 hover:text-blanc transition-all"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-[11px] text-blanc/40 mt-6 leading-relaxed"
        >
          Conservez précieusement votre numéro d'inscription. Pour toute
          question, contactez-nous au {TRAINING_INFO.contactPhone} ou par email à{" "}
          {TRAINING_INFO.contactEmail}.
        </motion.p>

        {/* Reset button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onBackHome}
          className="mx-auto mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C9A227]/30 text-[#C9A227] text-sm font-semibold hover:bg-[#C9A227]/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Nouvelle inscription
        </motion.button>
      </div>
    </section>
  );
}
