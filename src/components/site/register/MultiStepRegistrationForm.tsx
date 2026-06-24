"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  NIVEAU_ETUDES_OPTIONS,
  SEXE_OPTIONS,
  SOURCE_OPTIONS,
} from "@/lib/constants";
import { StepIndicator } from "./StepIndicator";
import {
  Label,
  FieldWrapper,
  Input,
  RadioGroup,
  Select,
  Checkbox,
} from "./FormFields";
import type { ParticipantSummary } from "@/app/page";

// === Step schemas ===
const step1Schema = z.object({
  nomComplet: z.string().min(2, "Nom complet requis"),
  prenoms: z.string().min(1, "Prénom(s) requis"),
  sexe: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Sélection requise" }),
  }),
  dateNaissance: z.string().min(4, "Date de naissance requise"),
});

const step2Schema = z.object({
  telWhatsApp: z
    .string()
    .min(8, "Numéro WhatsApp invalide")
    .regex(/^[+]?[\d\s\-().]{8,20}$/, "Format invalide"),
  telSecondaire: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[+]?[\d\s\-().]{8,20}$/.test(v),
      "Format invalide"
    ),
  email: z.string().email("Email invalide"),
  ville: z.string().min(2, "Ville requise"),
});

const step3Schema = z.object({
  profession: z.string().min(2, "Profession requise"),
  niveauEtudes: z.string().min(1, "Niveau d'études requis"),
});

const step4Schema = z.object({
  sourceConnaissance: z.string().min(2, "Source requise"),
  acceptConditions: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

const STEP_LABELS = ["Identité", "Contact", "Profil", "Finalisation"];
const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

export function MultiStepRegistrationForm({
  onRegistered,
}: {
  onRegistered: (p: ParticipantSummary) => void;
}) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Persistent form data across steps
  const [data, setData] = useState<Partial<
    Step1Data & Step2Data & Step3Data & Step4Data
  >>({});

  // Per-step form instances
  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const step3Form = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });
  const step4Form = useForm<Step4Data>({ resolver: zodResolver(step4Schema) });

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmitStep = (stepData: Record<string, unknown>) => {
    setData((prev) => ({ ...prev, ...stepData }));
    if (step < TOTAL_STEPS) {
      goNext();
    } else {
      submitAll({ ...data, ...stepData });
    }
  };

  const submitAll = async (allData: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...allData, website: "" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.errors) {
          const firstErr = Object.values(json.errors)[0]?.[0];
          toast({
            title: "Champ invalide",
            description: firstErr || "Vérifiez vos informations.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Inscription impossible",
          description: json.error || json.hint || "Erreur inconnue.",
          variant: "destructive",
        });
        return;
      }
      onRegistered({
        id: json.participant.id,
        registrationId: json.participant.registrationId,
        nomComplet: json.participant.nomComplet,
        prenoms: json.participant.prenoms,
        email: json.participant.email,
        telWhatsApp: json.participant.telWhatsApp,
        status: json.participant.status,
        paymentType: json.participant.paymentType,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Erreur réseau",
        description: "Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Current form based on step
  const currentForm =
    step === 1
      ? step1Form
      : step === 2
      ? step2Form
      : step === 3
      ? step3Form
      : step4Form;

  return (
    <div>
      <StepIndicator
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        labels={STEP_LABELS}
      />

      <form
        onSubmit={currentForm.handleSubmit(onSubmitStep)}
        className="space-y-5"
      >
        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...currentForm.register("website" as never)}
          className="hidden"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 1 && <Step1 form={step1Form} />}
            {step === 2 && <Step2 form={step2Form} />}
            {step === 3 && <Step3 form={step3Form} />}
            {step === 4 && <Step4 form={step4Form} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-blanc/[0.06]">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-blanc/[0.1] text-blanc/70 text-sm font-semibold hover:bg-blanc/[0.04] hover:text-blanc transition-all min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="shine-sweep relative overflow-hidden flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C9A227] text-noir font-bold text-sm hover:bg-[#D4AF37] active:scale-[0.98] transition-all min-h-[44px] shadow-[0_4px_16px_rgba(201,162,39,0.3)]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : step < TOTAL_STEPS ? (
              <>
                Continuer
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Valider mon inscription
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-blanc/40 pt-1">
          {step < TOTAL_STEPS
            ? `Étape ${step} sur ${TOTAL_STEPS}`
            : "Dernière étape — validez pour continuer vers le paiement"}
        </p>
      </form>
    </div>
  );
}

// ============ STEP 1: Identité ============
function Step1({ form }: { form: ReturnType<typeof useForm<Step1Data>> }) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-blanc text-base mb-1">Identité</h3>
        <p className="text-blanc/50 text-xs">
          Vos informations personnelles de base.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrapper error={errors.nomComplet?.message}>
          <Label htmlFor="nomComplet" required>
            Nom complet
          </Label>
          <Input
            id="nomComplet"
            placeholder="Ex. DOSSOU"
            error={!!errors.nomComplet}
            {...register("nomComplet")}
          />
        </FieldWrapper>

        <FieldWrapper error={errors.prenoms?.message}>
          <Label htmlFor="prenoms" required>
            Prénom(s)
          </Label>
          <Input
            id="prenoms"
            placeholder="Ex. Marie-Grace"
            error={!!errors.prenoms}
            {...register("prenoms")}
          />
        </FieldWrapper>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label required>Sexe</Label>
          <RadioGroup
            name="sexe"
            options={SEXE_OPTIONS.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
            value={form.watch("sexe") || ""}
            onChange={(v) => form.setValue("sexe", v as "M" | "F", { shouldValidate: true })}
            error={errors.sexe?.message}
          />
        </div>

        <FieldWrapper error={errors.dateNaissance?.message}>
          <Label htmlFor="dateNaissance" required>
            Date de naissance
          </Label>
          <Input
            id="dateNaissance"
            type="date"
            error={!!errors.dateNaissance}
            {...register("dateNaissance")}
          />
        </FieldWrapper>
      </div>
    </div>
  );
}

// ============ STEP 2: Contact ============
function Step2({ form }: { form: ReturnType<typeof useForm<Step2Data>> }) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-blanc text-base mb-1">Contact</h3>
        <p className="text-blanc/50 text-xs">
          Comment vous joindre et où vous êtes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrapper error={errors.telWhatsApp?.message}>
          <Label htmlFor="telWhatsApp" required>
            Téléphone WhatsApp
          </Label>
          <Input
            id="telWhatsApp"
            placeholder="Ex. +229 01 97 00 00 00"
            error={!!errors.telWhatsApp}
            {...register("telWhatsApp")}
          />
        </FieldWrapper>

        <FieldWrapper error={errors.telSecondaire?.message}>
          <Label htmlFor="telSecondaire">
            Téléphone secondaire{" "}
            <span className="text-blanc/30 normal-case tracking-normal">
              (optionnel)
            </span>
          </Label>
          <Input
            id="telSecondaire"
            placeholder="Ex. +229 01 96 00 00 00"
            error={!!errors.telSecondaire}
            {...register("telSecondaire")}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper error={errors.email?.message}>
        <Label htmlFor="email" required>
          Adresse Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ex. marie.grace@email.com"
          error={!!errors.email}
          {...register("email")}
        />
      </FieldWrapper>

      <FieldWrapper error={errors.ville?.message}>
        <Label htmlFor="ville" required>
          Ville de résidence
        </Label>
        <Input
          id="ville"
          placeholder="Ex. Cotonou"
          error={!!errors.ville}
          {...register("ville")}
        />
      </FieldWrapper>
    </div>
  );
}

// ============ STEP 3: Profil professionnel ============
function Step3({ form }: { form: ReturnType<typeof useForm<Step3Data>> }) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-blanc text-base mb-1">
          Profil professionnel
        </h3>
        <p className="text-blanc/50 text-xs">
          Pour mieux adapter la formation à votre parcours.
        </p>
      </div>

      <FieldWrapper error={errors.profession?.message}>
        <Label htmlFor="profession" required>
          Profession
        </Label>
        <Input
          id="profession"
          placeholder="Ex. Étudiante, Commerçante, Artisane..."
          error={!!errors.profession}
          {...register("profession")}
        />
      </FieldWrapper>

      <div>
        <Label required>Niveau d'études</Label>
        <Select
          value={form.watch("niveauEtudes") || ""}
          onChange={(v) =>
            form.setValue("niveauEtudes", v, { shouldValidate: true })
          }
          options={NIVEAU_ETUDES_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          placeholder="Sélectionnez"
          error={errors.niveauEtudes?.message}
        />
      </div>
    </div>
  );
}

// ============ STEP 4: Finalisation ============
function Step4({ form }: { form: ReturnType<typeof useForm<Step4Data>> }) {
  const {
    formState: { errors },
  } = form;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-blanc text-base mb-1">Finalisation</h3>
        <p className="text-blanc/50 text-xs">
          Dernière étape avant le paiement.
        </p>
      </div>

      <div>
        <Label required>
          Comment avez-vous connu la formation ?
        </Label>
        <Select
          value={form.watch("sourceConnaissance") || ""}
          onChange={(v) =>
            form.setValue("sourceConnaissance", v, { shouldValidate: true })
          }
          options={SOURCE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          placeholder="Sélectionnez une option"
          error={errors.sourceConnaissance?.message}
        />
      </div>

      <div className="bg-[#C9A227]/[0.06] border border-[#C9A227]/20 rounded-xl p-4">
        <Checkbox
          id="acceptConditions"
          label={
            <span>
              J'accepte les{" "}
              <strong className="text-blanc">conditions d'inscription</strong>.
              Je comprends que les frais d'inscription (5 000 FCFA) ne sont pas
              remboursables et que ma place n'est définitivement réservée
              qu'après paiement. Je m'engage à participer aux 3 jours de
              formation si je choisis la formule complète.
            </span>
          }
          checked={form.watch("acceptConditions") === true}
          onChange={(v) =>
            form.setValue("acceptConditions", v as true, { shouldValidate: true })
          }
          error={errors.acceptConditions?.message}
        />
      </div>

      <div className="bg-noir border border-blanc/[0.08] rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 flex items-center justify-center flex-shrink-0">
          <Send className="w-4 h-4 text-[#C9A227]" />
        </div>
        <div>
          <p className="text-blanc text-xs font-semibold mb-1">
            Prochaine étape : le paiement
          </p>
          <p className="text-blanc/50 text-[11px] leading-relaxed">
            Après validation, vous serez redirigé vers la page de paiement
            sécurisé FeexPay (MTN MoMo, Moov Money, Celtiis Cash, carte
            bancaire).
          </p>
        </div>
      </div>
    </div>
  );
}
