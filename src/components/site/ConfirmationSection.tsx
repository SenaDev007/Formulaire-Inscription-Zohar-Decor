"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  MessageCircle,
  Mail,
  Download,
  Home,
  Calendar,
  MapPin,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TRAINING_INFO } from "@/lib/email";

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
        setStatus(paid ? "paid" : "pending");
        if (!paid) {
          setPollCount((c) => c + 1);
        } else {
          // Fetch WhatsApp link
          try {
            const waRes = await fetch(
              `/api/whatsapp/confirm-link?registrationId=${encodeURIComponent(registrationId)}`
            );
            const waJson = await waRes.json();
            if (waJson.success) setWhatsappLink(waJson.link);
          } catch {
            /* ignore */
          }
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

  const copyRegId = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.participant.registrationId);
    toast({ title: "Copié", description: "Numéro d'inscription copié." });
  };

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-beige/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-beige/30 px-4">
        <div className="bg-blanc rounded-2xl premium-shadow border border-beige p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-noir mt-4">Inscription introuvable</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Le numéro {registrationId} n'existe pas ou n'a pas pu être retrouvé.
          </p>
          <Button onClick={onBackHome} className="mt-6 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (status === "pending" && data) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-beige/30 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blanc rounded-3xl premium-shadow-lg border border-beige p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#C9A227]/10 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-noir mt-4">
            Paiement en cours...
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Nous vérifions votre paiement. Cette page s'actualise automatiquement.
            {pollCount > 2 && " Cela peut prendre quelques instants."}
          </p>

          <div className="mt-6 bg-beige/50 rounded-xl p-4 text-left">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              N° Inscription
            </p>
            <p className="font-bold text-noir text-lg mt-1">
              {data.participant.registrationId}
            </p>
          </div>

          {data.payment?.paymentUrl && (
            <a
              href={data.payment.paymentUrl}
              className="block mt-4 text-sm text-[#C9A227] hover:underline"
            >
              Retourner à la page de paiement →
            </a>
          )}

          <Button
            onClick={onBackHome}
            variant="outline"
            className="mt-6 rounded-full"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    );
  }

  // PAID
  const amount = data?.payment?.amount ?? TRAINING_INFO.inscriptionFee;
  const formatted = new Intl.NumberFormat("fr-FR").format(amount);

  return (
    <section className="py-12 sm:py-16 bg-beige/30 min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blanc rounded-3xl premium-shadow-lg border border-beige overflow-hidden"
          >
            {/* Success header */}
            <div className="bg-noir px-8 py-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, #C9A227 0%, transparent 60%)",
                  }}
                />
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="relative w-20 h-20 rounded-full bg-[#C9A227] flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-12 h-12 text-noir" strokeWidth={2.5} />
              </motion.div>
              <h1
                className="relative text-2xl sm:text-3xl font-bold text-blanc mt-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Félicitations {data?.participant.prenoms} !
              </h1>
              <p className="relative text-sm text-blanc/70 mt-2">
                Votre inscription a été enregistrée avec succès.
              </p>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Registration ID */}
              <div className="bg-beige/50 rounded-2xl p-5 border border-beige-dark/30">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Numéro d'inscription
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p
                    className="text-2xl sm:text-3xl font-bold text-[#C9A227] tracking-wider"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    {data?.participant.registrationId}
                  </p>
                  <button
                    onClick={copyRegId}
                    className="p-2 rounded-lg hover:bg-blanc transition-colors"
                    aria-label="Copier"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Participant + payment summary */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-blanc rounded-xl p-4 border border-beige">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Participant
                  </p>
                  <p className="font-semibold text-noir mt-1 text-sm">
                    {data?.participant.nomComplet}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {data?.participant.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {data?.participant.telWhatsApp}
                  </p>
                </div>
                <div className="bg-blanc rounded-xl p-4 border border-beige">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Paiement
                  </p>
                  <p className="font-semibold text-noir mt-1 text-sm">
                    {data?.payment?.type === "COMPLET"
                      ? "Formation complète"
                      : "Inscription"}
                  </p>
                  <p className="text-lg font-bold text-[#C9A227] mt-1">
                    {formatted} FCFA
                  </p>
                  {data?.payment?.feexpayTransaction && (
                    <p className="text-[10px] text-muted-foreground mt-1 break-all">
                      Réf : {data.payment.feexpayTransaction}
                    </p>
                  )}
                </div>
              </div>

              {/* Training info */}
              <div className="bg-noir rounded-2xl p-5 text-blanc">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-3">
                  Détails de la formation
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                    <span>
                      Du <strong>{TRAINING_INFO.startDate}</strong> au{" "}
                      <strong>{TRAINING_INFO.endDate} {TRAINING_INFO.year}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                    <span className="text-blanc/80 text-xs leading-relaxed">
                      {TRAINING_INFO.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid sm:grid-cols-2 gap-3">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1DA851] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Voir sur WhatsApp
                  </a>
                )}
                <a
                  href="mailto:?subject=Mon inscription Zohar Décor&body=Mon numéro d'inscription est " 
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-full border-2 border-noir text-noir text-sm font-semibold hover:bg-noir hover:text-blanc transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    if (data) {
                      window.location.href = `mailto:?subject=Inscription Zohar Décor ${data.participant.registrationId}&body=Bonjour, mon numéro d'inscription est ${data.participant.registrationId}. La formation a lieu du ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year} à ${TRAINING_INFO.location}.`;
                    }
                  }}
                >
                  <Mail className="w-4 h-4" />
                  M'envoyer par email
                </a>
              </div>

              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                Un email de confirmation contenant votre reçu a été envoyé à{" "}
                <strong className="text-noir">{data?.participant.email}</strong>.
                Pensez à vérifier vos spams.
              </p>

              <Button
                onClick={onBackHome}
                variant="outline"
                className="w-full h-12 rounded-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
