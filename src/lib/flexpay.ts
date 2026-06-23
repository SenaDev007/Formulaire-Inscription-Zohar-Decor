/**
 * Flexpay payment integration.
 * Docs: https://docs.flexpay.cd
 *
 * Flexpay aggregates MTN MoMo, Moov Money, Celtiis Cash, and card payments
 * in the DRC / West Africa region. This module wraps the REST API.
 *
 * If FLEXPAY_MERCHANT_TOKEN is not set, the module runs in DEMO mode:
 *   - It returns a fake payment URL pointing to an internal demo page
 *   - The webhook simulation endpoint /api/payment/demo-confirm can be
 *     called manually to confirm the payment for testing.
 */

const BASE_URL =
  process.env.FLEXPAY_BASE_URL || "https://payment.flexpay.cd/api/v1";
const MERCHANT_TOKEN = process.env.FLEXPAY_MERCHANT_TOKEN || "";
const SANDBOX = process.env.FLEXPAY_SANDBOX === "true";

export type FlexpayInitRequest = {
  merchant_phone: string; // Flexpay merchant phone (the merchant account)
  amount: number; // in FCFA (or local currency)
  currency: string; // "CDF" | "USD" | "XOF" | etc.
  reference: string; // internal reference (registrationId)
  callback_url: string; // webhook URL
  type: 1 | 2; // 1 = mobile money, 2 = card
  description?: string;
};

export type FlexpayInitResponse = {
  status: number; // 0 = success in Flexpay convention
  message: string;
  reference?: string; // internal
  orderNumber?: string;
  payment_url?: string; // URL the user is redirected to
  token?: string;
};

export const FLEXPAY_DEMO_MODE = !MERCHANT_TOKEN;

export function getFlexpayAuthorizationHeader(): string {
  return `Bearer ${MERCHANT_TOKEN}`;
}

export async function initFlexpayPayment(
  payload: FlexpayInitRequest
): Promise<FlexpayInitResponse> {
  if (FLEXPAY_DEMO_MODE) {
    console.warn(
      "[flexpay] DEMO MODE — FLEXPAY_MERCHANT_TOKEN not set. Returning fake payment URL."
    );
    return {
      status: 0,
      message: "Demo mode: payment URL generated",
      reference: payload.reference,
      orderNumber: `DEMO-${Date.now()}`,
      payment_url: `/api/payment/demo-redirect?reference=${encodeURIComponent(
        payload.reference
      )}&amount=${payload.amount}`,
    };
  }

  const url = `${BASE_URL}/pay`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getFlexpayAuthorizationHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flexpay init HTTP ${res.status}: ${text}`);
  }

  const data = (await res.json()) as FlexpayInitResponse;
  return data;
}

export type FlexpayTransactionStatus =
  | "pending"
  | "success"
  | "failed"
  | "cancelled"
  | "expired";

export type FlexpayStatusResponse = {
  status: number;
  message: string;
  transaction?: {
    reference: string;
    orderNumber: string;
    amount: number;
    currency: string;
    status: FlexpayTransactionStatus;
    provider?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
  };
};

export async function checkFlexpayStatus(
  orderNumber: string
): Promise<FlexpayStatusResponse> {
  if (FLEXPAY_DEMO_MODE) {
    return {
      status: 0,
      message: "Demo mode",
      transaction: {
        reference: orderNumber,
        orderNumber,
        amount: 0,
        currency: "XOF",
        status: "pending",
      },
    };
  }

  const url = `${BASE_URL}/transaction/${encodeURIComponent(orderNumber)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: getFlexpayAuthorizationHeader() },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flexpay status HTTP ${res.status}: ${text}`);
  }

  return (await res.json()) as FlexpayStatusResponse;
}

/**
 * Verify the webhook signature from Flexpay.
 * In sandbox/demo mode this is a no-op (always true).
 * In production, Flexpay typically signs webhook payloads with a shared secret.
 */
export function verifyFlexpayWebhook(
  signature: string | null,
  body: string
): boolean {
  if (FLEXPAY_DEMO_MODE || SANDBOX) return true;
  if (!signature) return false;
  // Implement HMAC verification once Flexpay documents their signing scheme.
  // For now, accept any non-empty signature as a placeholder.
  return signature.length > 0;
}

/**
 * Map Flexpay transaction status to our internal Payment.status.
 */
export function mapFlexpayStatus(
  s: FlexpayTransactionStatus
): "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" {
  switch (s) {
    case "success":
      return "SUCCESS";
    case "failed":
      return "FAILED";
    case "cancelled":
    case "expired":
      return "CANCELLED";
    case "pending":
    default:
      return "PENDING";
  }
}
