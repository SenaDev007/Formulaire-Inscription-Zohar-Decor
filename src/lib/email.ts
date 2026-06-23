import { Resend } from "resend";
import { Participant, Payment } from "@prisma/client";
import { db } from "@/lib/db";

const apiKey = process.env.RESEND_API_KEY;
const fromName = process.env.EMAIL_FROM_NAME || "Zohar Décor";
const fromEmail = process.env.EMAIL_FROM_NOREPLY || "noreply@academiahelm.com";
const fromAddress = `${fromName} <${fromEmail}>`;

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
  contactPhone: process.env.CONTACT_PHONE || "+22900000000",
  contactEmail: process.env.CONTACT_EMAIL || "contact@zohardecor.com",
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
                    ${payment?.flexpayTransaction ? `
                    <tr>
                      <td style="padding:6px 0;color:#666;font-size:13px;">Référence transaction</td>
                      <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600;text-align:right;">${payment.flexpayTransaction}</td>
                    </tr>` : ""}
                  </table>
                </td></tr>
              </table>

              <h3 style="margin:24px 0 8px;color:#111;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Détails de la formation</h3>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Dates :</strong> ${TRAINING_INFO.startDate} au ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Durée :</strong> ${TRAINING_INFO.duration}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Lieu :</strong> ${TRAINING_INFO.location}</p>
              <p style="margin:0 0 6px;color:#444;font-size:14px;"><strong>Attestation :</strong> Attestation de participation incluse.</p>

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
