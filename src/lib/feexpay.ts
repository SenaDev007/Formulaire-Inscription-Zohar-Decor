/**
 * FeexPay payment integration — V2 REST API.
 *
 * Verified against the official FeexPay JavaScript SDK source
 * (https://api.feexpay.me/feexpay-javascript-sdk/index.js)
 *
 * Base URL:  https://api.feexpay.me
 * Auth:      Bearer token in Authorization header (token must start with "fp_")
 * Content:   application/json (NOT form-encoded like V1)
 *
 * Endpoints (V2):
 *   GET  /api/shop/{shop}/get_shop
 *        → validates shop, returns { name, reference }
 *
 *   POST /api/transactions/requesttopay/integration   (Mobile Money)
 *        headers: Authorization: Bearer {token}
 *        body (JSON): phoneNumber, amount, reseau (MTN|MOOV|CELTIIS),
 *                     shop, token, first_name, email, country, callback_info, ...
 *        → { reference, status, ... }
 *
 *   POST /api/transactions/public/   (Card VISA/MC)
 *        headers: Authorization: Bearer {token}
 *        body (JSON): shop, amount, currency, first_name, last_name, email,
 *                     phoneNumber, adress, city, zip, country, type_card, receiptUrl
 *        → { paymentUrl, ... }
 *
 *   GET  /api/transactions/getrequesttopay/integration/{reference}
 *        headers: Authorization: Bearer {token}
 *        → { status: "SUCCESSFUL"|"SUCCESS"|"PENDING"|"FAILED", reason, reference, ... }
 *
 * DEMO MODE: when FEEXPAY_API_TOKEN or FEEXPAY_SHOP_ID is not set.
 */

const BASE_URL = process.env.FEEXPAY_BASE_URL || "https://api.feexpay.me";
const API_TOKEN = process.env.FEEXPAY_API_TOKEN || "";
const SHOP_ID = process.env.FEEXPAY_SHOP_ID || "";

export const FEEXPAY_DEMO_MODE = !API_TOKEN || !SHOP_ID;

export type FeexPayProvider = "MTN" | "MOOV" | "CELTIIS" | "VISA" | "MASTERCARD";

export type FeexPayInitRequest = {
  amount: number;
  phoneNumber: string;
  provider: FeexPayProvider;
  fullName: string;
  email: string;
  reference: string;
  callbackUrl: string;
  cardFirstName?: string;
  cardLastName?: string;
  country?: string;
  address?: string;
  city?: string;
  zip?: string;
  currency?: string;
};

export type FeexPayInitResponse = {
  status: "SUCCESS" | "FAILED";
  reference?: string;
  paymentUrl?: string;
  message?: string;
  raw?: unknown;
};

export type FeexPayStatus =
  | "PENDING"
  | "SUCCESS"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED";

export type FeexPayStatusResponse = {
  status: FeexPayStatus;
  amount?: number;
  reason?: string;
  reference?: string;
  raw?: unknown;
};

/**
 * Verify the shop is valid by calling GET /api/shop/{shop}/get_shop.
 */
export async function verifyShop(): Promise<string | null> {
  if (FEEXPAY_DEMO_MODE) return "Demo Shop";
  try {
    const res = await fetch(`${BASE_URL}/api/shop/${SHOP_ID}/get_shop`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.name || null;
  } catch {
    return null;
  }
}

/**
 * Initiate a payment. Routes to Mobile Money or Card endpoint based on provider.
 *
 * V2 differences from V1:
 * - Authorization: Bearer {token} in header (not in body)
 * - Content-Type: application/json (not form-encoded)
 * - Card endpoint: /api/transactions/public/ (not /api/transactions/card/inittransact/integration)
 */
export async function initFeexPayPayment(
  payload: FeexPayInitRequest
): Promise<FeexPayInitResponse> {
  if (FEEXPAY_DEMO_MODE) {
    console.warn(
      "[feexpay] DEMO MODE — FEEXPAY_API_TOKEN or FEEXPAY_SHOP_ID not set."
    );
    const fakeRef = `DEMO-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    return {
      status: "SUCCESS",
      reference: fakeRef,
      paymentUrl: `/api/payment/demo-confirm?reference=${encodeURIComponent(
        payload.reference
      )}&feexpayRef=${encodeURIComponent(fakeRef)}`,
      message: "Demo mode: payment URL generated",
    };
  }

  // Verify token format (V2 requires fp_ prefix)
  if (!API_TOKEN.startsWith("fp_")) {
    return {
      status: "FAILED",
      message:
        "Le token FeexPay est invalide (V2). Il doit commencer par 'fp_'. Vérifiez FEEXPAY_API_TOKEN dans vos variables d'environnement.",
    };
  }

  // Validate shop
  const shopName = await verifyShop();
  if (!shopName) {
    return {
      status: "FAILED",
      message: `Shop FeexPay invalide — vérifiez FEEXPAY_SHOP_ID (${SHOP_ID})`,
    };
  }

  const isCard =
    payload.provider === "VISA" || payload.provider === "MASTERCARD";

  if (isCard) {
    // === Card payment (V2: POST /api/transactions/public/) ===
    const body = {
      shop: SHOP_ID,
      amount: payload.amount,
      currency: payload.currency || "XOF",
      first_name: payload.cardFirstName || payload.fullName,
      last_name: payload.cardLastName || payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber.replace(/\D/g, ""),
      adress: payload.address || payload.city || "Cotonou",
      city: payload.city || "Cotonou",
      zip: "00000",
      country: payload.country || "Bénin",
      receiptUrl: payload.callbackUrl,
      type_card: payload.provider,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/transactions/public/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        return {
          status: "FAILED",
          message: `FeexPay HTTP ${res.status}: ${text}`,
        };
      }
      const data = await res.json();
      if (data?.paymentUrl) {
        return {
          status: "SUCCESS",
          paymentUrl: data.paymentUrl,
          raw: data,
        };
      }
      return {
        status: "FAILED",
        message: data?.message || "Aucune URL de paiement retournée",
        raw: data,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { status: "FAILED", message: `FeexPay init error: ${msg}` };
    }
  }

  // === Mobile Money payment (V2: POST /api/transactions/requesttopay/integration) ===
  const body = {
    phoneNumber: payload.phoneNumber.replace(/\D/g, ""),
    amount: payload.amount,
    reseau: payload.provider,
    shop: SHOP_ID,
    token: API_TOKEN,
    first_name: payload.fullName,
    email: payload.email,
    country: payload.country || "Bénin",
    callback_info: payload.callbackUrl,
    description: `Inscription Zohar Décor — ${payload.reference}`,
    currency: payload.currency || "XOF",
    payment_interface: "API",
  };

  try {
    const res = await fetch(
      `${BASE_URL}/api/transactions/requesttopay/integration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return {
        status: "FAILED",
        message: `FeexPay HTTP ${res.status}: ${text}`,
      };
    }
    const data = await res.json();
    if (data?.message === "Network Unavailable" || data?.status === "FAILED") {
      return {
        status: "FAILED",
        message: data?.message || "Réseau indisponible",
        raw: data,
      };
    }
    return {
      status: "SUCCESS",
      reference: data.reference,
      raw: data,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { status: "FAILED", message: `FeexPay init error: ${msg}` };
  }
}

/**
 * Check the status of a FeexPay transaction (V2).
 * Uses Authorization: Bearer header.
 * Status can be "SUCCESSFUL" or "SUCCESS" (both mean success).
 */
export async function checkFeexPayStatus(
  reference: string
): Promise<FeexPayStatusResponse> {
  if (FEEXPAY_DEMO_MODE) {
    return { status: "SUCCESS", amount: 0 };
  }
  try {
    const res = await fetch(
      `${BASE_URL}/api/transactions/getrequesttopay/integration/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      return { status: "FAILED" };
    }
    const data = await res.json();
    return {
      status: (data?.status as FeexPayStatus) || "PENDING",
      amount: data?.amount,
      reason: data?.reason,
      reference: data?.reference,
      raw: data,
    };
  } catch {
    return { status: "FAILED" };
  }
}

/**
 * Webhook verification. FeexPay V2 doesn't sign webhooks with HMAC.
 * The callback is informational — we always re-poll the GET status endpoint.
 */
export function verifyFeexPayWebhook(
  body: string
): { valid: boolean; reference?: string } {
  try {
    const data = JSON.parse(body);
    return { valid: true, reference: data?.reference || data?.transref };
  } catch {
    return { valid: false };
  }
}

/**
 * Map FeexPay status to our internal Payment.status.
 * V2 uses "SUCCESSFUL" as well as "SUCCESS".
 */
export function mapFeexPayStatus(
  s: FeexPayStatus
): "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" {
  switch (s) {
    case "SUCCESS":
    case "SUCCESSFUL":
      return "SUCCESS";
    case "FAILED":
      return "FAILED";
    case "CANCELLED":
    case "EXPIRED":
      return "CANCELLED";
    case "PENDING":
    default:
      return "PENDING";
  }
}

/**
 * Map our internal provider IDs to FeexPay `reseau` values.
 */
export function mapProviderToReseau(provider: string): FeexPayProvider {
  switch (provider) {
    case "MTN_MOMO":
      return "MTN";
    case "MOOV_MONEY":
      return "MOOV";
    case "CELTIIS_CASH":
      return "CELTIIS";
    case "CARD":
      return "VISA";
    case "VISA":
    case "MASTERCARD":
      return provider;
    default:
      return "MTN";
  }
}

// === Backward-compatible aliases (FeeXPay → FeexPay naming) ===
export const initFeeXPayPayment = initFeexPayPayment;
export const checkFeeXPayStatus = checkFeexPayStatus;
export const verifyFeeXPayWebhook = verifyFeexPayWebhook;
export const mapFeeXPayStatus = mapFeexPayStatus;
export type FeeXPayProvider = FeexPayProvider;
export type FeeXPayInitRequest = FeexPayInitRequest;
export type FeeXPayInitResponse = FeexPayInitResponse;
export type FeeXPayStatus = FeexPayStatus;
export type FeeXPayStatusResponse = FeexPayStatusResponse;
