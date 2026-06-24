/**
 * FeexPay payment integration — V2 REST API.
 *
 * Documentation: https://docs.feexpay.me/?section=api-rest-integrations&version=v2
 *
 * Base URL:  https://api-v2.feexpay.me
 * Auth:      Authorization: Bearer <api-key> (token must start with "fp_")
 * Content:   application/json
 *
 * Endpoints (V2):
 *   POST /api/transactions/public/requesttopay/mtn        (MTN Bénin)
 *   POST /api/transactions/public/requesttopay/moov       (Moov Bénin)
 *   POST /api/transactions/public/requesttopay/celtiis_bj (Celtiis Bénin)
 *   POST /api/transactions/public/requesttopay/coris      (Coris Bénin — 2-step OTP)
 *
 * Card payment:
 *   POST /api/transactions/public/   (Visa/Mastercard → returns paymentUrl)
 *
 * Status check:
 *   GET /api/transactions/{reference}
 *
 * Body fields: phoneNumber (required, 10 digits with 229 prefix), amount (required),
 *              shop (required), first_name, last_name, description, callback_info
 */

const BASE_URL = "https://api-v2.feexpay.me";
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
 * Operator-specific endpoint paths (V2)
 */
function getOperatorEndpoint(provider: FeexPayProvider): string | null {
  switch (provider) {
    case "MTN":
      return "/api/transactions/public/requesttopay/mtn";
    case "MOOV":
      return "/api/transactions/public/requesttopay/moov";
    case "CELTIIS":
      return "/api/transactions/public/requesttopay/celtiis_bj";
    case "VISA":
    case "MASTERCARD":
      return "/api/transactions/public/";
    default:
      return null;
  }
}

/**
 * Initiate a payment via FeexPay V2 API.
 *
 * Mobile Money (MTN, Moov, Celtiis): sends a push to the customer's phone.
 * Returns a reference that we poll for status.
 *
 * Card (Visa, Mastercard): returns a paymentUrl to redirect the customer to.
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

  const endpoint = getOperatorEndpoint(payload.provider);
  if (!endpoint) {
    return {
      status: "FAILED",
      message: `Opérateur non supporté: ${payload.provider}`,
    };
  }

  const isCard =
    payload.provider === "VISA" || payload.provider === "MASTERCARD";

  // Build request body
  const phone = payload.phoneNumber.replace(/\D/g, "");

  if (isCard) {
    // === Card payment ===
    const body = {
      shop: SHOP_ID,
      amount: payload.amount,
      currency: payload.currency || "XOF",
      first_name: payload.cardFirstName || payload.fullName,
      last_name: payload.cardLastName || payload.fullName,
      email: payload.email,
      phoneNumber: phone,
      adress: payload.address || payload.city || "Cotonou",
      city: payload.city || "Cotonou",
      zip: payload.zip || "00000",
      country: payload.country || "Bénin",
      receiptUrl: payload.callbackUrl,
      type_card: payload.provider,
    };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = `FeexPay HTTP ${res.status}`;
        try {
          const errData = JSON.parse(text);
          errorMsg += `: ${errData.message || text}`;
        } catch {
          errorMsg += `: ${text}`;
        }
        return { status: "FAILED", message: errorMsg };
      }
      const data = await res.json();
      if (data?.paymentUrl) {
        return { status: "SUCCESS", paymentUrl: data.paymentUrl, raw: data };
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

  // === Mobile Money payment ===
  const body: Record<string, unknown> = {
    phoneNumber: phone,
    amount: payload.amount,
    shop: SHOP_ID,
    first_name: payload.fullName,
    description: `Inscription Zohar Decor ${payload.reference}`,
    callback_info: payload.callbackUrl,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      let errorMsg = `FeexPay HTTP ${res.status}`;
      try {
        const errData = JSON.parse(text);
        errorMsg += `: ${errData.message || text}`;
      } catch {
        errorMsg += `: ${text}`;
      }
      return { status: "FAILED", message: errorMsg };
    }
    const data = await res.json();

    // Moov can return FAILED immediately (e.g. insufficient balance)
    if (data?.status === "FAILED") {
      return {
        status: "FAILED",
        message: data?.response_operator?.description?.[0] || data?.message || "Paiement échoué",
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
 * Check the status of a FeexPay transaction by its reference.
 * V2 endpoint: GET /api/transactions/{reference}
 */
export async function checkFeexPayStatus(
  reference: string
): Promise<FeexPayStatusResponse> {
  if (FEEXPAY_DEMO_MODE) {
    return { status: "SUCCESS", amount: 0 };
  }
  try {
    const res = await fetch(
      `${BASE_URL}/api/transactions/${encodeURIComponent(reference)}`,
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
 * Map our internal provider IDs to FeexPay V2 operator names.
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

// === Backward-compatible aliases ===
export const initFeeXPayPayment = initFeexPayPayment;
export const checkFeeXPayStatus = checkFeexPayStatus;
export const verifyFeeXPayWebhook = verifyFeexPayWebhook;
export const mapFeeXPayStatus = mapFeexPayStatus;
export type FeeXPayProvider = FeexPayProvider;
export type FeeXPayInitRequest = FeexPayInitRequest;
export type FeeXPayInitResponse = FeexPayInitResponse;
export type FeeXPayStatus = FeexPayStatus;
export type FeeXPayStatusResponse = FeexPayStatusResponse;
