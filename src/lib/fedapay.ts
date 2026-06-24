/**
 * FedaPay payment integration.
 *
 * Based on the SERMA-HUB model: the user is redirected to a FedaPay hosted
 * checkout page. After payment, FedaPay redirects back to our site with
 * ?payment=success in the URL.
 *
 * No backend SDK needed — FedaPay handles the entire payment flow on their
 * hosted page (MTN MoMo, Moov Money, Celtiis Cash, Visa, Mastercard).
 *
 * Required env var:
 *   FEDAPAY_CHECKOUT_URL — your FedaPay checkout link (e.g. https://me.fedapay.com/xxx)
 *
 * You can create different checkout links for different amounts in your
 * FedaPay dashboard: https://dashboard.fedapay.com
 */

const FEDAPAY_CHECKOUT_URL = process.env.FEDAPAY_CHECKOUT_URL || "";

export function getFedaPayCheckoutUrl(amount: number, returnUrl: string): string | null {
  if (!FEDAPAY_CHECKOUT_URL) {
    console.warn("[fedapay] FEDAPAY_CHECKOUT_URL not set — payment will not work");
    return null;
  }

  // Append the return URL so FedaPay redirects back after payment
  const separator = FEDAPAY_CHECKOUT_URL.includes("?") ? "&" : "?";
  return `${FEDAPAY_CHECKOUT_URL}${separator}redirect_url=${encodeURIComponent(returnUrl)}`;
}

/**
 * Check if the current URL indicates a successful FedaPay payment.
 * FedaPay redirects with ?payment=success or ?status=approved
 */
export function isFedaPayPaymentSuccess(url: string): boolean {
  const params = new URL(url).searchParams;
  return params.get("payment") === "success" || params.get("status") === "approved";
}
