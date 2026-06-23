import { Participant, Payment } from "@prisma/client";
import { TRAINING_INFO } from "@/lib/email";

/**
 * Excel export using SheetJS (xlsx).
 */
export function buildParticipantsXlsx(participants: Participant[]): Buffer {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require("xlsx");

  const rows = participants.map((p, i) => ({
    "#": i + 1,
    "N° Inscription": p.registrationId,
    "Nom complet": p.nomComplet,
    "Prénom(s)": p.prenoms,
    Sexe: p.sexe,
    "Date de naissance": p.dateNaissance,
    "Téléphone WhatsApp": p.telWhatsApp,
    "Téléphone secondaire": p.telSecondaire || "",
    Email: p.email,
    Ville: p.ville,
    Profession: p.profession,
    "Niveau d'études": p.niveauEtudes,
    "Comment a connu la formation": p.sourceConnaissance,
    Statut: p.status,
    "Type de paiement": p.paymentType || "",
    "Accepte conditions": p.acceptConditions ? "Oui" : "Non",
    "Inscrit le": new Date(p.createdAt).toLocaleString("fr-FR"),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inscrits");

  ws["!cols"] = [
    { wch: 5 }, { wch: 16 }, { wch: 24 }, { wch: 20 }, { wch: 6 },
    { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 28 }, { wch: 16 },
    { wch: 20 }, { wch: 18 }, { wch: 28 }, { wch: 18 }, { wch: 16 },
    { wch: 12 }, { wch: 20 },
  ];

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

export function buildParticipantsPdfAsync(
  participants: (Participant & { payments?: Payment[] })[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfkitModule = require("pdfkit/js/pdfkit.standalone.js");
    const PDFDocument = pdfkitModule.default || pdfkitModule;
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#111111").fontSize(20).font("Helvetica-Bold").text(
      "ZOHAR DÉCOR", { align: "center" }
    );
    doc.fillColor("#C9A227").fontSize(10).font("Helvetica").text(
      TRAINING_INFO.slogan.toUpperCase(), { align: "center" }
    );
    doc.moveDown(0.3);
    doc.fillColor("#111111").fontSize(14).font("Helvetica-Bold").text(
      "Liste des inscrits — Formation en Résine Époxy", { align: "center" }
    );
    doc.fillColor("#666666").fontSize(9).font("Helvetica").text(
      `${TRAINING_INFO.startDate} – ${TRAINING_INFO.endDate} ${TRAINING_INFO.year}`,
      { align: "center" }
    );
    doc.moveDown(0.8);

    const cols = [
      { label: "#", width: 28 },
      { label: "N° Inscription", width: 90 },
      { label: "Nom complet", width: 160 },
      { label: "Téléphone", width: 80 },
      { label: "Email", width: 150 },
      { label: "Statut", width: 70 },
    ];

    let y = doc.y;
    doc.rect(36, y - 4, 521, 22).fill("#111111");
    doc.fillColor("#FFFFFF").fontSize(8).font("Helvetica-Bold");
    let x = 40;
    for (const c of cols) {
      doc.text(c.label, x, y);
      x += c.width;
    }
    y += 22;

    participants.forEach((p, i) => {
      if (y > 770) {
        doc.addPage();
        y = 50;
      }
      const row = [
        { v: String(i + 1), width: 28 },
        { v: p.registrationId, width: 90 },
        { v: p.nomComplet, width: 160 },
        { v: p.telWhatsApp, width: 80 },
        { v: p.email, width: 150 },
        { v: p.status, width: 70 },
      ];
      if (i % 2 === 0) {
        doc.rect(36, y - 4, 521, 18).fill("#F8F6F2");
      }
      doc.fillColor("#111111").font("Helvetica").fontSize(8);
      let xx = 40;
      for (const c of row) {
        doc.text(c.v, xx, y, { width: c.width - 4, ellipsis: true });
        xx += c.width;
      }
      y += 18;
    });

    doc.moveDown(2);
    doc.fillColor("#666666").fontSize(8).font("Helvetica-Oblique").text(
      `Généré le ${new Date().toLocaleString("fr-FR")} — ${participants.length} participant(s) — Zohar Décor`,
      { align: "center" }
    );

    doc.end();
  });
}
