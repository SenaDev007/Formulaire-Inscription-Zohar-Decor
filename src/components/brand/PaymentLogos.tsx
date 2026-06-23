/**
 * Official-style brand SVG logos for payment providers and WhatsApp.
 * These are vector recreations respecting the official brand colors.
 */

export function WhatsAppIcon({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.05 31.314l6.144-1.962A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0z" />
      <path
        fill="#FFF"
        d="M25.292 22.618c-.358 1.012-1.78 1.852-2.914 2.1-.776.166-1.788.296-5.196-.926-4.354-1.564-7.158-5.99-7.374-6.276-.206-.286-1.76-2.34-1.76-4.46s1.106-3.156 1.502-3.592c.358-.396.78-.496 1.04-.496.26 0 .52 0 .746.014.24.014.56-.092.876.668.326.78 1.106 2.704 1.204 2.9.098.196.164.426.03.686-.13.266-.196.426-.39.658-.196.234-.41.52-.586.7-.196.196-.4.41-.172.804.226.396 1.006 1.66 2.16 2.69 1.484 1.324 2.736 1.734 3.134 1.932.398.196.63.166.866-.1.236-.266 1-.98 1.266-1.314.266-.336.532-.28.866-.166.336.114 2.134 1.006 2.5 1.19.366.184.61.276.7.43.09.156.09.9-.268 1.91z"
      />
    </svg>
  );
}

export function MTNMoMoLogo({
  className = "",
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="12" fill="#FFCC00" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#000000"
      >
        MTN
      </text>
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="#000000"
      >
        MoMo
      </text>
    </svg>
  );
}

export function MoovMoneyLogo({
  className = "",
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="12" fill="#005BAF" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#FFFFFF"
      >
        MOOV
      </text>
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="#FFFFFF"
      >
        Money
      </text>
    </svg>
  );
}

export function CeltiisCashLogo({
  className = "",
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="12" fill="#E2231A" />
      <text
        x="32"
        y="34"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="900"
        fill="#FFFFFF"
      >
        CELTIIS
      </text>
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fontWeight="900"
        fill="#FFFFFF"
      >
        CASH
      </text>
    </svg>
  );
}

export function VisaLogo({
  className = "",
  size = 40,
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

export function MastercardLogo({
  className = "",
  size = 40,
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

export function FeeXPayLogo({
  className = "",
  size = 40,
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
