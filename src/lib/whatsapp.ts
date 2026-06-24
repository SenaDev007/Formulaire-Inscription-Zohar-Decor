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

  // Remove leading + if present (already stripped by regex above)
  // Benin numbers: format is 01XXXXXXXX (10 digits with leading 0)
  // For wa.me, we need: 229 + 01XXXXXXXX = 22901XXXXXXXX (12 digits)

  // If starts with +229 or 229, keep as is (already has country code)
  if (digits.startsWith("229")) {
    // Keep the full number including the 0 after 229
    // e.g. 2290162597692 stays as is
    return digits;
  }

  // If starts with 0 (local format like 0162597692), prepend 229
  if (digits.startsWith("0")) {
    return "229" + digits;
  }

  // If 8 digits without 0 prefix, prepend 2290
  if (digits.length <= 9) {
    return "2290" + digits;
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
