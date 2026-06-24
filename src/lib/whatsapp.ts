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

/**
 * Message FROM the participant TO Zohar Décor.
 * The participant clicks the WhatsApp button to inform Zohar Décor that
 * they have paid their fees. Opens WhatsApp addressed to Zohar Décor's number.
 */
export function buildParticipantToZoharMessage(p: Participant): string {
  const paymentType = p.paymentType === "FORMATION" ? "frais de formation" : "frais d'inscription";
  return `Bonjour Zohar Décor,

C'est ${p.prenoms} ${p.nomComplet}.

Je viens de payer mes ${paymentType} via FedaPay.

Merci de confirmer la réception et de réserver ma place pour la formation.

Cordialement,
${p.prenoms}`;
}

/**
 * Message FROM Zohar Décor TO the participant.
 * The admin (or the confirmation page) can send this to the participant
 * to confirm that their fees have been received and their place is reserved.
 * Opens WhatsApp addressed to the participant's number.
 */
export function buildZoharToParticipantMessage(p: Participant): string {
  const paymentType = p.paymentType === "FORMATION" ? "frais de formation" : "frais d'inscription";
  return `Bonjour ${p.prenoms},

✅ Nous confirmons la réception de votre paiement des ${paymentType}.

Votre place est désormais réservée pour la Formation en Résine Époxy de Zohar Décor.

📅 Dates : ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}
📍 Lieu : ${TRAINING_INFO.location}

👥 Rejoignez le groupe WhatsApp des participants :
${TRAINING_INFO.whatsappGroupLink}

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
