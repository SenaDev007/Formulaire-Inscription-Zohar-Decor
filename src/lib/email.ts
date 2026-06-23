import { Resend } from "resend";
import { Participant, Payment } from "@prisma/client";
import { db } from "@/lib/db";

const apiKey = process.env.RESEND_API_KEY;
const fromName = process.env.EMAIL_FROM_NAME || "Zohar Décor";
const fromEmail = process.env.EMAIL_FROM_NOREPLY || "noreply@academiahelm.com";
const fromAddress = `${fromName} <${fromEmail}>`;
const adminNotifyEmail = process.env.RESEND_TO_EMAIL || "";

// Public URL of the WhatsApp group QR code image.
// In production (Vercel), this resolves to /qr-whatsapp-group.jpeg on the deployed domain.
// For emails to render the image, it MUST be a public absolute URL.
const WHATSAPP_QR_URL =
  (process.env.NEXT_PUBLIC_APP_URL || "https://zohar-decor.vercel.app") +
  "/qr-whatsapp-group.jpeg";

export const resend = apiKey ? new Resend(apiKey) : null;

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
  fullFee: 25000,
  contactPhone: process.env.CONTACT_PHONE || "+229 01 62 59 76 92",
  contactEmail: process.env.CONTACT_EMAIL || "auroretheodoraa@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2290162597692",
  whatsappGroupLink:
    process.env.WHATSAPP_GROUP_LINK ||
    "https://chat.whatsapp.com/VOTRE-LIEN-GROUPE",
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
    payment?.type === "COMPLET"
      ? "Inscription + Formation complète"
      : "Frais d'inscription";

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
              <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:1px;">ZOHAR DÉCOR</h1>
              <p style="margin:6px 0 0;color:#F8F6F2;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${TRAINING_INFO.slogan}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="margin:0 0 8px;color:#111111;font-size:20px;">Félicitations ${participant.prenoms} !</h2>
              <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.6;">
                Votre inscription à la <strong>Formation en Résine Époxy</strong> de Zohar Décor a été enregistrée avec succès.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE8DD;border-radius:8px;margin:20px 0;">
                <tr><td style="padding:20px;">
                  <p style="margin:0 0 10px;color:#111;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Numéro d'inscription</p>
                  <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#C9A227;letter-spacing:2px;">${participant.registrationId}</p>
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
                       width="180" height="180"
                       style="display:block;margin:0 auto;border-radius:8px;" />
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

export async function sendConfirmationEmail(
  to: string,
  data: ConfirmationEmailData
): Promise<{ success: boolean; error?: string }> {
  const html = buildConfirmationEmailHtml(data);
  const subject = `Confirmation d'inscription — ${data.participant.registrationId} — Zohar Décor`;

  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set — email not sent. Recipient:",
      to,
      "Subject:",
      subject
    );
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { error } = await resend.emails.send({
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
    if (!resend) {
      console.warn("[email] no Resend — skipping", r.email);
      failed++;
      continue;
    }
    try {
      const { error } = await resend.emails.send({
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
  const amount = payment?.amount ?? TRAINING_INFO.inscriptionFee;
  const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);
  const paymentTypeLabel =
    payment?.type === "COMPLET"
      ? "Formation complète (25 000 FCFA)"
      : payment?.type === "INSCRIPTION"
      ? "Inscription (5 000 FCFA)"
      : "—";

  const headerColor = isPayment ? "#065F46" : "#C9A227";
  const headerBg = isPayment ? "#D1FAE5" : "#FEF3C7";
  const title = isPayment
    ? "💰 Paiement confirmé"
    : "📋 Nouvelle inscription";

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
                  <td style="padding:8px 0;color:${headerColor};font-size:13px;font-weight:700;">${participant.status}</td>
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

  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — admin notification not sent to:", targetEmail);
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const html = buildAdminNotificationHtml(type, participant, payment);
  const subject = isPaymentSubject(type, participant);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: targetEmail,
      subject,
      html,
      // Also reply-to the participant if they have email
      replyTo: participant.email,
    });
    if (error) {
      console.error("[email] admin notification error:", error);
      return { sent: false, error: error.message };
    }
    console.log(`[email] Admin notification sent to ${targetEmail}: ${subject}`);
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
    return `💰 Paiement confirmé — ${participant.registrationId} — ${participant.nomComplet}`;
  }
  return `📋 Nouvelle inscription — ${participant.registrationId} — ${participant.nomComplet}`;
}
