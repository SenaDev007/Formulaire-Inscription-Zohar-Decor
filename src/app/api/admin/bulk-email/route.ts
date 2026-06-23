import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendBulkEmail, LOGO_URL } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
  filter: z
    .enum(["all", "paid", "pending", "validated"])
    .optional()
    .default("all"),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let where: Record<string, unknown> = {};
  switch (parsed.data.filter) {
    case "paid":
      where = { status: { in: ["PAID_INSCRIPTION", "PAID_FULL", "VALIDATED"] } };
      break;
    case "pending":
      where = { status: "PENDING" };
      break;
    case "validated":
      where = { status: "VALIDATED" };
      break;
    default:
      where = { status: { not: "CANCELLED" } };
  }

  const participants = await db.participant.findMany({ where });
  const recipients = participants.map((p) => ({ email: p.email, participant: p }));

  const htmlWrap = (msg: string) => `
    <!DOCTYPE html><html><body style="font-family:Helvetica,Arial,sans-serif;background:#F8F6F2;margin:0;padding:32px 0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #EFE8DD;">
        <tr><td style="background:#111111;padding:24px;color:#C9A227;text-align:center;">
          <img src="${LOGO_URL}" alt="Zohar Décor" width="64" height="64"
               style="width:64px;height:64px;border-radius:50%;border:2px solid #C9A227;background:#F8F6F2;padding:3px;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;" />
          <h1 style="margin:0;font-size:20px;letter-spacing:2px;">ZOHAR DÉCOR</h1>
          <p style="margin:4px 0 0;color:#F8F6F2;font-size:11px;letter-spacing:2px;">Des souvenirs qui brillent à jamais</p>
        </td></tr>
        <tr><td style="padding:32px 28px;color:#111;font-size:15px;line-height:1.6;">
          <p style="margin:0 0 16px;">Bonjour,</p>
          ${msg
            .split("\n")
            .map((l) => `<p style="margin:0 0 12px;">${l || "&nbsp;"}</p>`)
            .join("")}
          <p style="margin:24px 0 0;color:#888;font-size:12px;">— L'équipe Zohar Décor</p>
        </td></tr>
      </table>
    </body></html>
  `;

  const { sent, failed } = await sendBulkEmail(
    recipients,
    parsed.data.subject,
    () => htmlWrap(parsed.data.message)
  );

  return NextResponse.json({
    success: true,
    sent,
    failed,
    total: recipients.length,
  });
}
