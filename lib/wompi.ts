/**
 * Wompi payment gateway integration
 * Docs: https://docs.wompi.co
 */

const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "";
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY || "";
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET || "";
const WOMPI_API_URL = "https://production.wompi.co/v1";
const WOMPI_SANDBOX_URL = "https://sandbox.wompi.co/v1";

const IS_SANDBOX = process.env.WOMPI_SANDBOX === "true";
const BASE_URL = IS_SANDBOX ? WOMPI_SANDBOX_URL : WOMPI_API_URL;

/** Build an integrity signature for a Wompi transaction
 *  signature = SHA256(reference + amountInCents + currency + integritySecret)
 */
export async function buildWompiSignature(
  reference: string,
  amountInCents: number,
  currency = "COP"
): Promise<string> {
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET || "";
  const raw = `${reference}${amountInCents}${currency}${integritySecret}`;
  const msgBuffer = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Build the Wompi checkout URL (redirect flow) */
export async function buildWompiCheckoutUrl(params: {
  reference: string;
  amountInCents: number;
  currency?: string;
  customerEmail: string;
  redirectUrl: string;
  description?: string;
}): Promise<string> {
  const {
    reference,
    amountInCents,
    currency = "COP",
    customerEmail,
    redirectUrl,
    description,
  } = params;

  const signature = await buildWompiSignature(reference, amountInCents, currency);

  const url = new URL("https://checkout.wompi.co/p/");
  url.searchParams.set("public-key", WOMPI_PUBLIC_KEY);
  url.searchParams.set("currency", currency);
  url.searchParams.set("amount-in-cents", String(amountInCents));
  url.searchParams.set("reference", reference);
  url.searchParams.set("signature:integrity", signature);
  url.searchParams.set("customer-data:email", customerEmail);
  url.searchParams.set("redirect-url", redirectUrl);
  if (description) url.searchParams.set("description", description);

  return url.toString();
}

/** Verify a Wompi webhook event signature */
export async function verifyWompiWebhook(
  payload: string,
  signature: string
): Promise<boolean> {
  const msgBuffer = new TextEncoder().encode(payload + WOMPI_EVENTS_SECRET);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computed = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return computed === signature;
}

/** Get transaction details from Wompi API */
export async function getWompiTransaction(transactionId: string) {
  const res = await fetch(`${BASE_URL}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export { WOMPI_PUBLIC_KEY, IS_SANDBOX };
