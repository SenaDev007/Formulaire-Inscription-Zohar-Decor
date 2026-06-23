"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NIVEAU_ETUDES_OPTIONS,
  SEXE_OPTIONS,
  SOURCE_OPTIONS,
} from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import type { ParticipantSummary } from "@/app/page";

const schema = z.object({
  nomComplet: z.string().min(2, "Nom complet requis"),
  prenoms: z.string().min(1, "Prénom(s) requis"),
  sexe: z.enum(["M", "F"], { errorMap: () => ({ message: "Sélection requise" }) }),
  dateNaissance: z.string().min(4, "Date de naissance requise"),
  telWhatsApp: z.string().min(8, "Téléphone WhatsApp requis"),
  telSecondaire: z.string().optional(),
  email: z.string().email("Email invalide"),
  ville: z.string().min(2, "Ville requise"),
  profession: z.string().min(2, "Profession requise"),
  niveauEtudes: z.string().min(1, "Niveau d'études requis"),
  sourceConnaissance: z.string().min(2, "Source requise"),
  acceptConditions: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
});

type FormData = z.infer<typeof schema>;

export function RegistrationForm({
  onRegistered,
  onBack,
}: {
  onRegistered: (p: ParticipantSummary) => void;
  onBack: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sexe: undefined,
      niveauEtudes: "",
      sourceConnaissance: "",
      acceptConditions: false as unknown as true,
    },
  });

  const sexe = watch("sexe");
  const niveauEtudes = watch("niveauEtudes");
  const sourceConnaissance = watch("sourceConnaissance");
  const acceptConditions = watch("acceptConditions");

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: "", // honeypot
        }),
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
          description: json.error || "Erreur inconnue.",
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
      reset();
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

  return (
    <section className="py-12 sm:py-16 bg-beige/30 min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-noir transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>

          <div className="bg-blanc rounded-3xl premium-shadow border border-beige overflow-hidden">
            {/* Header band */}
            <div className="bg-noir px-8 py-8 text-center">
              <h1
                className="text-2xl sm:text-3xl font-bold text-blanc"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Formulaire d'inscription
              </h1>
              <p className="mt-2 text-sm text-[#C9A227] tracking-[0.2em] uppercase">
                Formation en Résine Époxy · 09–11 juillet 2026
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-8 space-y-6"
            >
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website" as never)}
                className="hidden"
                aria-hidden="true"
              />

              {/* Names */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomComplet" className="text-noir font-medium">
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nomComplet"
                    {...register("nomComplet")}
                    placeholder="Ex. DOSSOU"
                    className="mt-1.5"
                  />
                  {errors.nomComplet && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.nomComplet.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="prenoms" className="text-noir font-medium">
                    Prénom(s) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prenoms"
                    {...register("prenoms")}
                    placeholder="Ex. Marie-Grace"
                    className="mt-1.5"
                  />
                  {errors.prenoms && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.prenoms.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Sexe + Date de naissance */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-noir font-medium">
                    Sexe <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={sexe}
                    onValueChange={(v) => setValue("sexe", v as "M" | "F", { shouldValidate: true })}
                    className="mt-2 flex gap-4"
                  >
                    {SEXE_OPTIONS.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`sexe-${opt.value}`} />
                        <Label htmlFor={`sexe-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.sexe && (
                    <p className="text-xs text-red-500 mt-1">{errors.sexe.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dateNaissance" className="text-noir font-medium">
                    Date de naissance <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    {...register("dateNaissance")}
                    className="mt-1.5"
                  />
                  {errors.dateNaissance && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.dateNaissance.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phones */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telWhatsApp" className="text-noir font-medium">
                    Téléphone WhatsApp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="telWhatsApp"
                    {...register("telWhatsApp")}
                    placeholder="Ex. +229 01 97 00 00 00"
                    className="mt-1.5"
                  />
                  {errors.telWhatsApp && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.telWhatsApp.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="telSecondaire" className="text-noir font-medium">
                    Téléphone secondaire <span className="text-muted-foreground text-xs">(optionnel)</span>
                  </Label>
                  <Input
                    id="telSecondaire"
                    {...register("telSecondaire")}
                    placeholder="Ex. +229 01 96 00 00 00"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Email + Ville */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-noir font-medium">
                    Adresse Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Ex. marie.grace@email.com"
                    className="mt-1.5"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ville" className="text-noir font-medium">
                    Ville de résidence <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ville"
                    {...register("ville")}
                    placeholder="Ex. Cotonou"
                    className="mt-1.5"
                  />
                  {errors.ville && (
                    <p className="text-xs text-red-500 mt-1">{errors.ville.message}</p>
                  )}
                </div>
              </div>

              {/* Profession + Niveau d'études */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profession" className="text-noir font-medium">
                    Profession <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="profession"
                    {...register("profession")}
                    placeholder="Ex. Étudiante, Commerçante, Artisane..."
                    className="mt-1.5"
                  />
                  {errors.profession && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.profession.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-noir font-medium">
                    Niveau d'études <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={niveauEtudes}
                    onValueChange={(v) => setValue("niveauEtudes", v, { shouldValidate: true })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIVEAU_ETUDES_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.niveauEtudes && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.niveauEtudes.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Source */}
              <div>
                <Label className="text-noir font-medium">
                  Comment avez-vous connu la formation ? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={sourceConnaissance}
                  onValueChange={(v) =>
                    setValue("sourceConnaissance", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Sélectionnez une option" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sourceConnaissance && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.sourceConnaissance.message}
                  </p>
                )}
              </div>

              {/* Conditions */}
              <div className="bg-beige/50 rounded-xl p-4 border border-beige-dark/30">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptConditions"
                    checked={acceptConditions === true}
                    onCheckedChange={(v) =>
                      setValue("acceptConditions", v as true, { shouldValidate: true })
                    }
                    className="mt-1 data-[state=checked]:bg-[#C9A227] data-[state=checked]:border-[#C9A227]"
                  />
                  <Label
                    htmlFor="acceptConditions"
                    className="text-sm text-noir font-normal cursor-pointer leading-relaxed"
                  >
                    J'accepte les conditions d'inscription. Je comprends que les
                    frais d'inscription (5 000 FCFA) ne sont pas remboursables et
                    que ma place n'est définitivement réservée qu'après paiement.
                    Je m'engage à participer aux 3 jours de formation si je
                    choisis la formule complète.
                  </Label>
                </div>
                {errors.acceptConditions && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.acceptConditions.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full font-semibold text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      Continuer vers le paiement
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                <p className="mt-3 text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  Vos données sont protégées et ne seront jamais partagées.
                </p>
              </div>
            </form>
          </div>

          {/* Mini summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid sm:grid-cols-3 gap-3 text-center"
          >
            <div className="bg-blanc rounded-xl p-4 premium-shadow border border-beige">
              <p className="text-2xl font-bold text-[#C9A227]">3 jours</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Formation intensive
              </p>
            </div>
            <div className="bg-blanc rounded-xl p-4 premium-shadow border border-beige">
              <p className="text-2xl font-bold text-[#C9A227]">10 places</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Capacité maximale
              </p>
            </div>
            <div className="bg-blanc rounded-xl p-4 premium-shadow border border-beige">
              <p className="text-2xl font-bold text-[#C9A227]">2026</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Édition juillet
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
