import { Resend } from "resend";
import { Participant, Payment } from "@prisma/client";
import { db } from "@/lib/db";

let _resend: Resend | null = null;
let _resendChecked = false;

function getResend(): Resend | null {
  if (_resendChecked) return _resend;
  _resendChecked = true;
  const key = process.env.RESEND_API_KEY;
  if (key && key.length > 5) {
    _resend = new Resend(key);
    console.log("[email] Resend initialized. Key prefix:", key.substring(0, 6) + "...");
  } else {
    console.warn("[email] RESEND_API_KEY not found or too short. Value:", key ? `"${key.substring(0, 3)}..."` : "(empty)");
  }
  return _resend;
}

const fromName = process.env.EMAIL_FROM_NAME || "Zohar Décor";
const fromEmail = process.env.EMAIL_FROM_NOREPLY || "noreply@academiahelm.com";
const fromAddress = `${fromName} <${fromEmail}>`;
const adminNotifyEmail = "auroretheodoraa@gmail.com"; // Hardcoded — always send admin emails here

// Public URLs for email images — hardcoded to Vercel production URL
const APP_URL = "https://formulaire-inscription-zohar-decor.vercel.app";
const WHATSAPP_QR_URL = APP_URL + "/qr-whatsapp-group.jpeg";

// Public URL of the Zohar Décor logo for email headers.
export const LOGO_URL = APP_URL + "/logo_zohar_decor.png";


export const TRAINING_INFO = {
  title: "FORMATION PROFESSIONNELLE EN RÉSINE ÉPOXY",
  subtitle: "Apprenez à créer et vendre des créations personnalisées en résine époxy.",
  startDate: "09 juillet",
  endDate: "11 juillet",
  year: 2026,
  duration: "3 jours de formation intensive",
  location:
    "Zongo 2, von Axe Beni CHC-Presdo, à 100 m du carrefour après EPP La Source, Terre Rouge en allant au CEG Nima.",
  capacity: 10,
  inscriptionFee: 5000,
  trainingFee: 20000,
  attestation: "Attestation de participation incluse.",
  contactPhone: process.env.CONTACT_PHONE || "+229 01 62 59 76 92",
  contactEmail: process.env.CONTACT_EMAIL || "auroretheodoraa@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2290162597692",
  whatsappGroupLink: "https://chat.whatsapp.com/JNMZnOxxjiXHHzyCM2CkRG",
  slogan: "Des souvenirs qui brillent à jamais",
};

export function generateRegistrationId(seq: number): string {
  const year = TRAINING_INFO.year;
  const padded = String(seq).padStart(3, "0");
  return `ZD-${year}-${padded}`;
}

export async function nextRegistrationId(): Promise<string> {
  const count = await db.participant.count();
  return generateRegistrationId(count + 1);
}

type ConfirmationEmailData = {
  participant: Participant;
  payment?: Payment | null;
};

export function buildConfirmationEmailHtml({
  participant,
  payment,
}: ConfirmationEmailData): string {
  const amount = payment?.amount ?? TRAINING_INFO.inscriptionFee;
  const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);
  const paymentTypeLabel =
    payment?.type === "FORMATION"
      ? `Frais de formation (${new Intl.NumberFormat("fr-FR").format(TRAINING_INFO.trainingFee)} FCFA)`
      : `Frais d'inscription (${new Intl.NumberFormat("fr-FR").format(TRAINING_INFO.inscriptionFee)} FCFA)`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Confirmation d'inscription — Zohar Décor</title>
</head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:Helvetica,Arial,sans-serif;color:#111111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F2;min-width:100%;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #EFE8DD;border-radius:12px;overflow:hidden;">
          <tr style="background:#111111;">
            <td align="center" style="padding:32px 24px;color:#C9A227;">
              <img src="${LOGO_URL}" alt="Zohar Décor"
                   width="72" height="72"
                   style="width:72px;height:72px;border-radius:50%;border:2px solid #C9A227;background:#F8F6F2;padding:4px;margin-bottom:12px;display:block;" />
              <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:1px;">ZOHAR DÉCOR</h1>
              <p style="margin:6px 0 0;color:#F8F6F2;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${TRAINING_INFO.slogan}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="margin:0 0 8px;color:#111111;font-size:20px;">
                ${payment?.type === "FORMATION" ? `Confirmation de souscription` : `Félicitations`} ${participant.prenoms} !
              </h2>
              <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.6;">
                ${payment?.type === "FORMATION"
                  ? `Votre souscription aux <strong>frais de formation</strong> de Zohar Décor a été enregistrée avec succès. Vous êtes maintenant officiellement inscrit(e) à la Formation en Résine Époxy.`
                  : `Votre inscription à la <strong>Formation en Résine Époxy</strong> de Zohar Décor a été enregistrée avec succès.`
                }
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE8DD;border-radius:8px;margin:20px 0;">
                <tr><td style="padding:20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Participant</td>
                      <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600;text-align:right;">${participant.nomComplet}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Email</td>
                      <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600;text-align:right;">${participant.email}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Téléphone WhatsApp</td>
                      <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600;text-align:right;">${participant.telWhatsApp}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Type de paiement</td>
                      <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600;text-align:right;">${paymentTypeLabel}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Montant payé</td>
                      <td style="padding:6px 0;color:#C9A227;font-size:15px;font-weight:700;text-align:right;">${formattedAmount} FCFA</td>
                    </tr>
                    ${payment?.feexpayTransaction ? `
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Référence transaction</td>
                      <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600;text-align:right;">${payment.feexpayTransaction}</td>
                    </tr>` : ""}
                  </table>
                </td></tr>
              </table>

              <h3 style="margin:24px 0 8px;color:#111;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Détails de la formation</h3>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Dates :</strong> ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Durée :</strong> ${TRAINING_INFO.duration}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Lieu :</strong> ${TRAINING_INFO.location}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Attestation :</strong> Attestation de participation incluse.</p>

              <div style="margin:24px 0;padding:20px;background:#25D366;border-radius:8px;color:#FFFFFF;text-align:center;">
                <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Étape suivante</p>
                <p style="margin:0 0 12px;font-size:16px;font-weight:700;">Rejoignez le groupe WhatsApp des participants</p>
                <p style="margin:0 0 14px;font-size:13px;opacity:0.95;line-height:1.5;">
                  Échangez avec les autres participants, recevez les annonces importantes
                  et le lien Zoom / Google Meet de la formation.
                </p>

                <!-- QR Code du groupe WhatsApp -->
                <div style="background:#FFFFFF;border-radius:12px;padding:16px;display:inline-block;margin:0 auto 14px;">
                  <img src="${WHATSAPP_QR_URL}" alt="QR Code groupe WhatsApp Zohar Décor"
                       width="200" style="display:block;margin:0 auto;border-radius:8px;height:auto;max-width:200px;" />
                  <p style="margin:10px 0 0;font-size:11px;color:#666;text-align:center;">
                    Scannez ce QR code avec votre téléphone<br/>pour rejoindre le groupe
                  </p>
                </div>

                <br/>
                <a href="${TRAINING_INFO.whatsappGroupLink}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background:#FFFFFF;color:#25D366;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:700;text-decoration:none;">
                  Rejoindre le groupe WhatsApp
                </a>
                <p style="margin:10px 0 0;font-size:11px;opacity:0.85;">
                  ou cliquez sur le bouton ci-dessus si vous êtes sur mobile
                </p>
              </div>

              <!-- Bouton: Confirmer mon paiement à Zohar Décor via WhatsApp -->
              <div style="margin:20px 0;padding:16px;background:#EFE8DD;border-radius:8px;text-align:center;">
                <p style="margin:0 0 10px;font-size:13px;color:#444;font-weight:600;">
                  Notifiez Zohar Décor de votre paiement par WhatsApp
                </p>
                <a href="https://wa.me/${TRAINING_INFO.whatsappNumber}?text=${encodeURIComponent(
                  `Bonjour Zohar Decor,\n\nC'est ${participant.prenoms} ${participant.nomComplet}.\n\nJe viens de payer mes ${payment?.type === "FORMATION" ? "frais de formation" : "frais d'inscription"} via FedaPay.\n\nMerci de confirmer la reception et de reserver ma place.\n\nCordialement,\n${participant.prenoms}`
                )}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background:#25D366;color:#FFFFFF;padding:10px 24px;border-radius:20px;font-size:13px;font-weight:700;text-decoration:none;">
                  Confirmer mon paiement à Zohar Décor
                </a>
              </div>

              <div style="margin:28px 0;padding:20px;background:#111111;border-radius:8px;color:#F8F6F2;">
                <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;color:#C9A227;text-transform:uppercase;">Contact Zohar Décor</p>
                <p style="margin:0;font-size:14px;">Téléphone : ${TRAINING_INFO.contactPhone}<br/>Email : ${TRAINING_INFO.contactEmail}</p>
              </div>

              <p style="margin:0;color:#888;font-size:12px;text-align:center;border-top:1px solid #EFE8DD;padding-top:16px;">
                Zohar Décor — ${TRAINING_INFO.slogan}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// ============================================================
// REGISTRATION CONFIRMATION EMAIL (sent to participant at
// registration time, BEFORE payment)
// Contains: registration confirmation, registration ID, training
// address, next steps (payment), WhatsApp group link + QR code
// ============================================================

export function buildRegistrationConfirmationHtml({
  participant,
}: {
  participant: Participant;
}): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Confirmation d'inscription — Zohar Décor</title>
</head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:Helvetica,Arial,sans-serif;color:#111111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F2;min-width:100%;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #EFE8DD;border-radius:12px;overflow:hidden;">
          <tr style="background:#111111;">
            <td align="center" style="padding:32px 24px;color:#C9A227;">
              <img src="${LOGO_URL}" alt="Zohar Décor"
                   width="72" height="72"
                   style="width:72px;height:72px;border-radius:50%;border:2px solid #C9A227;background:#F8F6F2;padding:4px;margin-bottom:12px;display:block;" />
              <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:1px;">ZOHAR DÉCOR</h1>
              <p style="margin:6px 0 0;color:#F8F6F2;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${TRAINING_INFO.slogan}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="margin:0 0 8px;color:#111111;font-size:20px;">Bonjour ${participant.prenoms} !</h2>
              <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.6;">
                Nous avons bien reçu votre inscription à la <strong>Formation Professionnelle en Résine Époxy</strong>.
                Votre dossier a été enregistré avec succès.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE8DD;border-radius:8px;margin:20px 0;">
                <tr><td style="padding:20px;text-align:center;">
                  <p style="margin:0 0 6px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Votre numéro d'inscription</p>
                  <p style="margin:0;font-size:26px;font-weight:700;color:#C9A227;letter-spacing:2px;">${participant.registrationId}</p>
                </td></tr>
              </table>

              <h3 style="margin:24px 0 8px;color:#111;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Prochaine étape : le paiement</h3>
              <p style="margin:0 0 6px;color:#444;font-size:14px;line-height:1.6;">
                Pour confirmer définitivement votre place, veuillez procéder au paiement de vos frais d'inscription :
              </p>
              <ul style="margin:8px 0 16px 20px;padding:0;color:#444;font-size:14px;line-height:1.8;">
                <li><strong>Inscription :</strong> 5 000 FCFA (réserve votre place)</li>
                <li><strong>Frais de formation :</strong> 20 000 FCFA (3 jours de formation)</li>
              </ul>
              <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.6;">
                Paiement via FeexPay : MTN MoMo, Moov Money, Celtiis Cash, carte bancaire.
              </p>

              <h3 style="margin:24px 0 8px;color:#111;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Détails de la formation</h3>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Dates :</strong> ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Durée :</strong> ${TRAINING_INFO.duration}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Lieu :</strong> ${TRAINING_INFO.location}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Attestation :</strong> Attestation de participation incluse.</p>

              <div style="margin:24px 0;padding:20px;background:#25D366;border-radius:8px;color:#FFFFFF;text-align:center;">
                <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Rejoignez le groupe WhatsApp</p>
                <p style="margin:0 0 12px;font-size:16px;font-weight:700;">Groupe des participants</p>
                <p style="margin:0 0 14px;font-size:13px;opacity:0.95;line-height:1.5;">
                  Échangez avec les autres participants, recevez les annonces importantes
                  et le lien de la formation.
                </p>

                <div style="background:#FFFFFF;border-radius:12px;padding:16px;display:inline-block;margin:0 auto 14px;">
                  <img src="${WHATSAPP_QR_URL}" alt="QR Code groupe WhatsApp Zohar Décor"
                       width="200" style="display:block;margin:0 auto;border-radius:8px;height:auto;max-width:200px;" />
                  <p style="margin:10px 0 0;font-size:11px;color:#666;text-align:center;">
                    Scannez ce QR code avec votre téléphone<br/>pour rejoindre le groupe
                  </p>
                </div>

                <br/>
                <a href="${TRAINING_INFO.whatsappGroupLink}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background:#FFFFFF;color:#25D366;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:700;text-decoration:none;">
                  Rejoindre le groupe WhatsApp
                </a>
              </div>

              <div style="margin:28px 0;padding:20px;background:#111111;border-radius:8px;color:#F8F6F2;">
                <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;color:#C9A227;text-transform:uppercase;">Contact Zohar Décor</p>
                <p style="margin:0;font-size:14px;">Téléphone : ${TRAINING_INFO.contactPhone}<br/>Email : ${TRAINING_INFO.contactEmail}</p>
              </div>

              <p style="margin:0;color:#888;font-size:12px;text-align:center;border-top:1px solid #EFE8DD;padding-top:16px;">
                Zohar Décor — ${TRAINING_INFO.slogan}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export async function sendRegistrationConfirmationEmail(
  to: string,
  participant: Participant
): Promise<{ success: boolean; error?: string }> {
  const html = buildRegistrationConfirmationHtml({ participant });
  const subject = `Inscription reçue — ${participant.registrationId} — Zohar Décor`;

  if (!getResend()) {
    console.warn(
      "[email] RESEND_API_KEY not set — registration email not sent. Recipient:",
      to,
      "Subject:",
      subject
    );
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { error } = await getResend()!.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email] send error:", msg);
    return { success: false, error: msg };
  }
}

export async function sendConfirmationEmail(
  to: string,
  data: ConfirmationEmailData
): Promise<{ success: boolean; error?: string }> {
  const html = buildConfirmationEmailHtml(data);
  const subject = data.payment?.type === "FORMATION"
    ? `Souscription frais de formation — Zohar Décor`
    : `Confirmation d'inscription — Zohar Décor`;

  console.log(`[email] Participant email → TO: ${to} | FROM: ${fromAddress} | SUBJECT: ${subject}`);

  if (!getResend()) {
    console.warn(
      "[email] RESEND_API_KEY not set — email not sent. Recipient:",
      to,
      "Subject:",
      subject
    );
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { error } = await getResend()!.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email] send error:", msg);
    return { success: false, error: msg };
  }
}

export async function sendBulkEmail(
  recipients: { email: string; participant: Participant }[],
  subject: string,
  htmlBody: (p: Participant) => string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    if (!getResend()) {
      console.warn("[email] no Resend — skipping", r.email);
      failed++;
      continue;
    }
    try {
      const { error } = await getResend()!.emails.send({
        from: fromAddress,
        to: r.email,
        subject,
        html: htmlBody(r.participant),
      });
      if (error) {
        console.error("[email] bulk error:", r.email, error);
        failed++;
      } else {
        sent++;
      }
    } catch (e) {
      console.error("[email] bulk exception:", r.email, e);
      failed++;
    }
  }
  return { sent, failed };
}

// ============================================================
// ADMIN NOTIFICATION (RESEND_TO_EMAIL)
// Sends a notification to the admin when a new registration
// or payment confirmation occurs.
// ============================================================

type AdminNotificationType = "NEW_REGISTRATION" | "PAYMENT_CONFIRMED";

export function buildAdminNotificationHtml(
  type: AdminNotificationType,
  participant: Participant,
  payment?: Payment | null
): string {
  const isPayment = type === "PAYMENT_CONFIRMED";
  const isFormation = payment?.type === "FORMATION";
  const amount = payment?.amount ?? TRAINING_INFO.inscriptionFee;
  const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);
  const paymentTypeLabel = isFormation
    ? "Frais de formation (20 000 FCFA)"
    : "Frais d'inscription (5 000 FCFA)";

  const headerColor = isPayment
    ? (isFormation ? "#1E40AF" : "#065F46")
    : "#C9A227";
  const headerBg = isPayment
    ? (isFormation ? "#DBEAFE" : "#D1FAE5")
    : "#FEF3C7";

  const title = isPayment
    ? (isFormation ? "Frais de formation payes" : "Frais d'inscription payes")
    : "Nouvelle inscription";

  // Human-readable status
  const statusLabel = participant.status === "PAID_FULL"
    ? "Paiement effectue — Formation complete"
    : participant.status === "PAID_INSCRIPTION"
    ? "Paiement effectue — Inscription confirmee"
    : participant.status === "UNPAID"
    ? "En attente de paiement"
    : participant.status;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${title} — Zohar Décor Admin</title>
</head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:Helvetica,Arial,sans-serif;color:#111111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F2;min-width:100%;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #EFE8DD;border-radius:12px;overflow:hidden;">
          <tr style="background:${headerColor};">
            <td align="center" style="padding:20px 24px;color:#FFFFFF;">
              <img src="${LOGO_URL}" alt="Zohar Décor"
                   width="56" height="56"
                   style="width:56px;height:56px;border-radius:50%;border:2px solid #FFFFFF;background:#F8F6F2;padding:3px;margin-bottom:8px;display:block;" />
              <h1 style="margin:0;font-size:18px;font-weight:700;letter-spacing:1px;">ZOHAR DÉCOR — ADMIN</h1>
              <p style="margin:4px 0 0;color:#FFFFFF;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.9;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              <div style="background:${headerBg};border-radius:8px;padding:16px;margin-bottom:20px;text-align:center;">
                <p style="margin:0;font-size:24px;font-weight:700;color:${headerColor};letter-spacing:2px;">
                  ${participant.registrationId}
                </p>
                <p style="margin:4px 0 0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;">
                  Numéro d'inscription
                </p>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;width:40%;">Nom complet</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.nomComplet} ${participant.prenoms}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Sexe</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.sexe === "M" ? "Masculin" : "Féminin"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Date de naissance</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.dateNaissance}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Téléphone WhatsApp</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.telWhatsApp}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Téléphone secondaire</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.telSecondaire || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Email</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.email}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Ville</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.ville}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Profession</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.profession}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Niveau d'études</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.niveauEtudes}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Source</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${participant.sourceConnaissance}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Statut</td>
                  <td style="padding:8px 0;color:${headerColor};font-size:13px;font-weight:700;">${statusLabel}</td>
                </tr>
                ${
                  isPayment && payment
                    ? `
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Type de paiement</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${paymentTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Montant payé</td>
                  <td style="padding:8px 0;color:${headerColor};font-size:15px;font-weight:700;">${formattedAmount} FCFA</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Moyen de paiement</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${payment.provider}</td>
                </tr>
                ${
                  payment.feexpayTransaction
                    ? `<tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Réf. transaction</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;font-family:monospace;">${payment.feexpayTransaction}</td>
                </tr>`
                    : ""
                }
                `
                    : ""
                }
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;">Inscrit le</td>
                  <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${new Date(participant.createdAt).toLocaleString("fr-FR")}</td>
                </tr>
              </table>

              <div style="margin-top:20px;padding:14px;background:#25D366;border-radius:8px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#FFFFFF;text-transform:uppercase;letter-spacing:1px;">Lien groupe WhatsApp participants</p>
                <p style="margin:6px 0 4px;font-size:13px;color:#FFFFFF;font-family:monospace;word-break:break-all;">
                  ${TRAINING_INFO.whatsappGroupLink}
                </p>
                <p style="margin:4px 0 0;font-size:11px;color:#FFFFFF;opacity:0.85;">
                  Partagé avec le participant dans son email de confirmation
                </p>
              </div>

              <div style="margin-top:14px;padding:16px;background:#25D366;border-radius:8px;text-align:center;">
                <p style="margin:0 0 6px;font-size:12px;color:#FFFFFF;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                  Confirmer au participant via WhatsApp
                </p>
                <p style="margin:0 0 10px;font-size:12px;color:#FFFFFF;opacity:0.9;">
                  Cliquez pour envoyer une confirmation de réception au participant
                </p>
                <a href="https://wa.me/${participant.telWhatsApp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                  `Bonjour ${participant.prenoms},\n\n✅ Nous confirmons la réception de votre paiement des ${payment?.type === "FORMATION" ? "frais de formation" : "frais d'inscription"}.\n\nVotre place est désormais réservée pour la Formation en Résine Époxy de Zohar Décor.\n\n📅 Dates : ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}\n📍 Lieu : ${TRAINING_INFO.location}\n\n👥 Rejoignez le groupe WhatsApp des participants :\n${TRAINING_INFO.whatsappGroupLink}\n\nÀ très bientôt.\n\nZohar Décor\n${TRAINING_INFO.slogan}`
                )}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background:#FFFFFF;color:#25D366;padding:10px 24px;border-radius:20px;font-size:13px;font-weight:700;text-decoration:none;">
                  Confirmer au participant
                </a>
              </div>

              <div style="margin-top:14px;padding:14px;background:#111111;border-radius:8px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#C9A227;text-transform:uppercase;letter-spacing:1px;">Dashboard admin</p>
                <p style="margin:4px 0 0;font-size:13px;color:#F8F6F2;">
                  Connectez-vous à <strong>/#admin</strong> pour gérer les inscrits
                </p>
              </div>

              <p style="margin:20px 0 0;color:#888;font-size:11px;text-align:center;border-top:1px solid #EFE8DD;padding-top:14px;">
                Notification automatique — Zohar Décor · ${TRAINING_INFO.slogan}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Send an admin notification email to RESEND_TO_EMAIL.
 * Falls back to CONTACT_EMAIL if RESEND_TO_EMAIL is not set.
 * Silently skips if neither is configured.
 */
export async function sendAdminNotification(
  type: AdminNotificationType,
  participant: Participant,
  payment?: Payment | null
): Promise<{ sent: boolean; error?: string }> {
  const targetEmail = adminNotifyEmail || TRAINING_INFO.contactEmail;
  if (!targetEmail) {
    console.warn("[email] No RESEND_TO_EMAIL or CONTACT_EMAIL — admin notification skipped");
    return { sent: false, error: "No admin email configured" };
  }

  if (!getResend()) {
    console.warn("[email] RESEND_API_KEY not set — admin notification not sent to:", targetEmail);
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const html = buildAdminNotificationHtml(type, participant, payment);
  const subject = isPaymentSubject(type, participant);

  console.log(`[email] Admin notification → TO: ${targetEmail} | FROM: ${fromAddress} | SUBJECT: ${subject}`);

  try {
    const { error } = await getResend()!.emails.send({
      from: fromAddress,
      to: targetEmail,
      subject,
      html,
    });
    if (error) {
      console.error("[email] admin notification Resend error:", JSON.stringify(error));
      return { sent: false, error: error.message };
    }
    console.log(`[email] Admin notification SENT to ${targetEmail}`);
    return { sent: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email] admin notification exception:", msg);
    return { sent: false, error: msg };
  }
}

function isPaymentSubject(
  type: AdminNotificationType,
  participant: Participant
): string {
  if (type === "PAYMENT_CONFIRMED") {
    const isForm = participant.paymentType === "FORMATION";
    return isForm
      ? `Frais de formation payes — ${participant.nomComplet} ${participant.prenoms}`
      : `Frais d'inscription payes — ${participant.nomComplet} ${participant.prenoms}`;
  }
  return `Nouvelle inscription — ${participant.nomComplet} ${participant.prenoms}`;
}
