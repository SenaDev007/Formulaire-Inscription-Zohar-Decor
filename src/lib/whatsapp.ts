import { Participant } from "@prisma/client";
import { TRAINING_INFO } from "@/lib/email";

/**
 * WhatsApp integration via direct link (wa.me).
 * No WhatsApp Business API required — the user clicks the link,
 * WhatsApp opens with the prefilled message.
 */

export function normalizePhone(phone: string): string {
  // Strip everything except digits
  let digits = phone.replace(/[^\d]/g, "");
  // Benin country code is 229; if the number starts with 0 and is 10 digits, prepend 229
  if (digits.startsWith("0") && digits.length === 10) {
    digits = "229" + digits.substring(1);
  }
  // If it starts with "+229" already handled above; ensure leading 229 if 9 digits
  if (!digits.startsWith("229") && digits.length === 9) {
    digits = "229" + digits;
  }
  return digits;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

export function buildConfirmationWhatsAppMessage(p: Participant): string {
  return `Bonjour ${p.prenoms},

✅ Votre inscription à la Formation en Résine Époxy de Zohar Décor a été validée.

📋 Numéro d'inscription :
${p.registrationId}

📅 Dates :
${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}

📍 Lieu :
${TRAINING_INFO.location}

💰 Nous avons bien reçu votre paiement.

👥 Rejoignez le groupe WhatsApp des participants :
${TRAINING_INFO.whatsappGroupLink}

Échangez avec les autres participants et recevez toutes les annonces importantes.

À très bientôt.

Zohar Décor
${TRAINING_INFO.slogan}`;
}

export function buildBulkWhatsAppLink(
  recipients: Participant[],
  defaultMessage: (p: Participant) => string
): { phone: string; link: string; name: string; registrationId: string }[] {
  return recipients.map((p) => ({
    phone: p.telWhatsApp,
    name: p.nomComplet,
    registrationId: p.registrationId,
    link: buildWhatsAppLink(p.telWhatsApp, defaultMessage(p)),
  }));
}

export function buildAdminWhatsAppBulkMessage(): string {
  return `Bonjour,

Nous vous contactons de la part de Zohar Décor concernant la Formation en Résine Époxy (${TRAINING_INFO.startDate}–${TRAINING_INFO.endDate} ${TRAINING_INFO.year}).

Pour toute question, contactez-nous au ${TRAINING_INFO.contactPhone}.

Merci,
Zohar Décor — ${TRAINING_INFO.slogan}`;
}
