/**
 * FeeXPay payment integration — v2 REST API.
 *
 * Verified against the official FeeXPay PHP SDK source
 * (github.com/foxinnovs/feexpay-sdk-php) and https://docs.feexpay.me
 *
 * Base URL:  https://api.feexpay.me
 * Auth:      Token + shop ID are sent IN THE REQUEST BODY (form-encoded),
 *            NOT as a Bearer header. The shop/merchant ID is a separate
 *            identifier from the API token.
 *
 * Endpoints:
 *   GET  /api/shop/{shop}/get_shop
 *        → validates shop, returns { name: "..." }
 *
 *   POST /api/transactions/requesttopay/integration   (Mobile Money)
 *        body (form): phoneNumber, amount, reseau (MTN|MOOV|CELTIIS),
 *                     token, shop, first_name, email
 *        → { status: "FAILED"|"SUCCESS", reference: "..." }
 *
 *   POST /api/transactions/card/inittransact/integration   (Card VISA/MC)
 *        body (form): phone, amount, reseau (VISA|MASTERCARD),
 *                     token, shop, first_name, last_name, email,
 *                     country, address1, district, currency (XOF|USD|EUR)
 *        → { status: "FAILED"|"SUCCESS", url: "https://...", transref: "..." }
 *
 *   GET  /api/transactions/getrequesttopay/integration/{reference}
 *        → { status: "PENDING"|"SUCCESS"|"FAILED",
 *            amount: number,
 *            payer: { partyId: "..." } }
 *
 * Webhook: FeeXPay calls the `callback_url` (passed during init) with the
 *          transaction reference in the payload. To confirm final status,
 *          we re-poll the GET endpoint. There is no HMAC signature — the
 *          callback is informational.
 *
 * DEMO MODE: when FEEXPAY_API_TOKEN or FEEXPAY_SHOP_ID is not set, this
 * module runs in DEMO mode:
 *   - initFeeXPayPayment returns a fake reference + redirect URL pointing
 *     to our internal /api/payment/demo-confirm endpoint
 *   - The user is redirected to that endpoint, which auto-confirms the
 *     payment for testing.
 */

const BASE_URL = process.env.FEEXPAY_BASE_URL || "https://api.feexpay.me";
const API_TOKEN = process.env.FEEXPAY_API_TOKEN || "";
const SHOP_ID = process.env.FEEXPAY_SHOP_ID || "";
const SANDBOX = (process.env.FEEXPAY_SANDBOX || "true") === "true";

export const FEEXPAY_DEMO_MODE = !API_TOKEN || !SHOP_ID;

export type FeeXPayProvider = "MTN" | "MOOV" | "CELTIIS" | "VISA" | "MASTERCARD";

export type FeeXPayInitRequest = {
  amount: number; // in FCFA (XOF)
  phoneNumber: string; // customer's mobile money or card phone
  provider: FeeXPayProvider; // MTN | MOOV | CELTIIS | VISA | MASTERCARD
  fullName: string; // customer name (used as first_name for MoMo, split for card)
  email: string;
  reference: string; // our internal reference (registrationId)
  callbackUrl: string; // webhook / return URL
  // Card-only fields
  cardFirstName?: string;
  cardLastName?: string;
  country?: string;
  address?: string;
  district?: string;
  currency?: string; // XOF | USD | EUR — default XOF
};

export type FeeXPayInitResponse = {
  status: "SUCCESS" | "FAILED";
  reference?: string; // MoMo reference
  transref?: string; // Card transaction reference
  paymentUrl?: string; // Card only — URL to redirect to
  message?: string;
  raw?: unknown;
};

export type FeeXPayStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED";

export type FeeXPayStatusResponse = {
  status: FeeXPayStatus;
  amount?: number;
  payerPartyId?: string;
  raw?: unknown;
};

/**
 * Verify the shop is valid by calling GET /api/shop/{shop}/get_shop.
 * Returns the merchant name on success, null on failure.
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
 * Mobile Money (MTN, MOOV, CELTIIS): asynchronous — FeeXPay sends a USSD/push
 * to the customer's phone. We get a `reference` back and must poll for status.
 *
 * Card (VISA, MASTERCARD): synchronous redirect — we get a `url` to redirect
 * the customer to. They enter card details on FeeXPay's hosted page, then are
 * redirected back to our callbackUrl.
 */
export async function initFeeXPayPayment(
  payload: FeeXPayInitRequest
): Promise<FeeXPayInitResponse> {
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
      transref: fakeRef,
      // Demo redirect: our internal endpoint auto-confirms the payment
      paymentUrl: `/api/payment/demo-confirm?reference=${encodeURIComponent(
        payload.reference
      )}&feexpayRef=${encodeURIComponent(fakeRef)}`,
      message: "Demo mode: payment URL generated",
    };
  }

  // Validate shop first (optional — fail loudly if invalid)
  const shopName = await verifyShop();
  if (!shopName) {
    return {
      status: "FAILED",
      message: "Shop FeeXPay invalide — vérifiez FEEXPAY_SHOP_ID",
    };
  }

  const isCard =
    payload.provider === "VISA" || payload.provider === "MASTERCARD";

  if (isCard) {
    // === Card payment ===
    const formData = new URLSearchParams();
    formData.append("phone", payload.phoneNumber);
    formData.append("amount", String(payload.amount));
    formData.append("reseau", payload.provider);
    formData.append("token", API_TOKEN);
    formData.append("shop", SHOP_ID);
    formData.append("first_name", payload.cardFirstName || payload.fullName);
    formData.append("last_name", payload.cardLastName || payload.fullName);
    formData.append("email", payload.email);
    formData.append("country", payload.country || "Bénin");
    formData.append("address1", payload.address || "Cotonou");
    formData.append("district", payload.district || "Littoral");
    formData.append("currency", payload.currency || "XOF");

    try {
      const res = await fetch(
        `${BASE_URL}/api/transactions/card/inittransact/integration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: formData.toString(),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        return {
          status: "FAILED",
          message: `FeeXPay HTTP ${res.status}: ${text}`,
        };
      }
      const data = await res.json();
      if (data?.status === "FAILED") {
        return { status: "FAILED", message: data.message || "FAILED", raw: data };
      }
      return {
        status: "SUCCESS",
        transref: data.transref,
        paymentUrl: data.url,
        raw: data,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { status: "FAILED", message: `FeeXPay init error: ${msg}` };
    }
  }

  // === Mobile Money payment ===
  const formData = new URLSearchParams();
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("amount", String(payload.amount));
  formData.append("reseau", payload.provider);
  formData.append("token", API_TOKEN);
  formData.append("shop", SHOP_ID);
  formData.append("first_name", payload.fullName);
  formData.append("email", payload.email);

  try {
    const res = await fetch(
      `${BASE_URL}/api/transactions/requesttopay/integration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return {
        status: "FAILED",
        message: `FeeXPay HTTP ${res.status}: ${text}`,
      };
    }
    const data = await res.json();
    if (data?.status === "FAILED") {
      return { status: "FAILED", message: data.message || "FAILED", raw: data };
    }
    return {
      status: "SUCCESS",
      reference: data.reference,
      raw: data,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { status: "FAILED", message: `FeeXPay init error: ${msg}` };
  }
}

/**
 * Check the status of a FeeXPay transaction by its reference.
 * For card payments, use the `transref`; for MoMo, use the `reference`.
 */
export async function checkFeeXPayStatus(
  reference: string
): Promise<FeeXPayStatusResponse> {
  if (FEEXPAY_DEMO_MODE) {
    return {
      status: "SUCCESS",
      amount: 0,
      payerPartyId: "DEMO",
    };
  }
  try {
    const res = await fetch(
      `${BASE_URL}/api/transactions/getrequesttopay/integration/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );
    if (!res.ok) {
      return { status: "FAILED" };
    }
    const data = await res.json();
    return {
      status: (data?.status as FeeXPayStatus) || "PENDING",
      amount: data?.amount,
      payerPartyId: data?.payer?.partyId,
      raw: data,
    };
  } catch {
    return { status: "FAILED" };
  }
}

/**
 * Webhook verification. FeeXPay doesn't sign webhooks with HMAC (per the SDK
 * source we audited). The callback is informational — to confirm a payment
 * reached its final state, we always re-poll the GET status endpoint.
 *
 * In SANDBOX mode, we accept all webhooks.
 */
export function verifyFeeXPayWebhook(
  body: string
): { valid: boolean; reference?: string } {
  if (SANDBOX) {
    try {
      const data = JSON.parse(body);
      return { valid: true, reference: data?.reference || data?.transref };
    } catch {
      return { valid: true };
    }
  }
  try {
    const data = JSON.parse(body);
    return { valid: true, reference: data?.reference || data?.transref };
  } catch {
    return { valid: false };
  }
}

/**
 * Map FeeXPay status to our internal Payment.status.
 */
export function mapFeeXPayStatus(
  s: FeeXPayStatus
): "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" {
  switch (s) {
    case "SUCCESS":
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
 * Map our internal provider IDs to FeeXPay `reseau` values.
 */
export function mapProviderToReseau(provider: string): FeeXPayProvider {
  switch (provider) {
    case "MTN_MOMO":
      return "MTN";
    case "MOOV_MONEY":
      return "MOOV";
    case "CELTIIS_CASH":
      return "CELTIIS";
    case "CARD":
      return "VISA"; // default to VISA; user can choose VISA/MASTERCARD in card flow
    case "VISA":
    case "MASTERCARD":
      return provider;
    default:
      return "MTN";
  }
}
