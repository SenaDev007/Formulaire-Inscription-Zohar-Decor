/**
 * Brand logos for payment providers and WhatsApp.
 *
 * MTN MoMo, Moov Money, Celtiis Cash use REAL official logos
 * (downloaded from logos-world.net and official sources, stored in /public/logos/).
 *
 * Visa, Mastercard, FedaPay use clean SVG recreations
 * with official brand colors.
 *
 * WhatsApp uses the official modern glyph SVG.
 */

/**
 * Official WhatsApp glyph (modern 2024 version).
 * Green filled circle with white phone handset.
 * Uses WhatsApp brand color #25D366.
 */
export function WhatsAppIcon({
  className = "",
  size = 20,
  colored = true,
}: {
  className?: string;
  size?: number;
  colored?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Filled green circle background */}
      {colored && (
        <path
          fill="#25D366"
          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.22 8.22 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.12c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"
        />
      )}
      {/* White phone handset glyph (the official WhatsApp symbol) */}
      <path
        fill={colored ? "#FFFFFF" : "currentColor"}
        d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.82 15.13c-.25.7-1.45 1.34-2 1.42-.53.08-1.2.11-1.94-.12-.45-.14-1.02-.33-1.76-.65-3.1-1.34-5.12-4.46-5.28-4.66-.16-.21-1.26-1.67-1.26-3.19 0-1.52.8-2.27 1.08-2.58.28-.31.61-.39.82-.39.2 0 .41 0 .58.01.19.01.43-.07.68.52.25.6.85 2.08.93 2.23.08.15.13.33.02.53-.11.2-.16.33-.31.5-.16.18-.32.39-.46.53-.15.15-.31.32-.13.62.18.3.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.48 1.53.31.15.49.13.67-.08.18-.2.77-.9.98-1.21.2-.31.41-.26.68-.16.27.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.73-.18 1.43z"
      />
    </svg>
  );
}

// === MTN MoMo (real image) ===
export function MTNMoMoLogo({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/logos/mtn-momo.png"
      alt="MTN MoMo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      loading="lazy"
    />
  );
}

// === Moov Money (real image) ===
export function MoovMoneyLogo({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/logos/moov-money.jpg"
      alt="Moov Money"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      loading="lazy"
    />
  );
}

// === Celtiis Cash (real image) ===
export function CeltiisCashLogo({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/logos/celtiis-cash.jpg"
      alt="Celtiis Cash"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      loading="lazy"
    />
  );
}

// === Visa (SVG recreation) ===
export function VisaLogo({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 80 50"
      width={size}
      height={size * 0.625}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="80" height="50" rx="6" fill="#FFFFFF" />
      <text
        x="40"
        y="34"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontStyle="italic"
        fontWeight="900"
        fill="#1A1F71"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

// === Mastercard (SVG recreation) ===
export function MastercardLogo({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 80 50"
      width={size}
      height={size * 0.625}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="80" height="50" rx="6" fill="#FFFFFF" />
      <circle cx="32" cy="25" r="14" fill="#EB001B" />
      <circle cx="48" cy="25" r="14" fill="#F79E1B" />
      <path
        d="M40 14.5a14 14 0 0 1 0 21 14 14 0 0 1 0-21z"
        fill="#FF5F00"
      />
    </svg>
  );
}

// === FedaPay (SVG recreation) ===
export function FedaPayLogo({
  className = "",
  size = 56,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 32"
      width={size}
      height={size * 0.32}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="0"
        y="24"
        fontFamily="Arial, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="#F97316"
      >
        Feex
      </text>
      <text
        x="50"
        y="24"
        fontFamily="Arial, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="#1F2937"
      >
        Pay
      </text>
    </svg>
  );
}

export const PAYMENT_LOGOS = {
  MTN_MOMO: MTNMoMoLogo,
  MOOV_MONEY: MoovMoneyLogo,
  CELTIIS_CASH: CeltiisCashLogo,
  CARD: VisaLogo,
} as const;
