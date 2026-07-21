import { Paynow } from "paynow"

export type PaynowPaymentMethod = "ecocash" | "innbucks" | "card"

export type InnBucksPaymentInfo = {
  authorizationCode: string
  deepLinkUrl: string
  qrCodeUrl: string
  expiresAt: string
}

export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.VERCEL_URL?.replace(/\/$/, "")?.replace(/^/, "https://") ||
    "http://localhost:3000"
  )
}

/**
 * Hosted web redirect (card / Zimswitch via Paynow page): omit authemail so guests
 * are not forced through a registered-account login.
 */
export function resolvePaynowAuthEmailForWeb(_customerEmail: string): string | undefined {
  const override = process.env.PAYNOW_AUTH_EMAIL?.trim()
  if (override && process.env.PAYNOW_FORCE_AUTH_EMAIL === "true") {
    return override
  }
  return undefined
}

/**
 * Express checkout (EcoCash / InnBucks) requires a valid authemail.
 * Test integrations often require the merchant's Paynow email — set PAYNOW_AUTH_EMAIL.
 * Live: prefer the customer email so Paynow can associate the payer.
 */
export function resolvePaynowAuthEmailForExpress(customerEmail: string): string {
  const override = process.env.PAYNOW_AUTH_EMAIL?.trim()
  if (override) return override

  if (process.env.PAYNOW_TEST_MODE === "true") {
    throw new Error(
      "EcoCash/InnBucks express checkout needs PAYNOW_AUTH_EMAIL set to your Paynow merchant email while the integration is in test mode."
    )
  }

  const trimmed = customerEmail.trim()
  if (!trimmed) {
    throw new Error("Customer email is required for mobile money payment.")
  }
  return trimmed
}

/** Normalize Zimbabwe mobile numbers toward 07XXXXXXXX format. */
export function normalizeZimbabwePhone(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, "")
  if (digits.startsWith("+263")) digits = "0" + digits.slice(4)
  else if (digits.startsWith("263")) digits = "0" + digits.slice(3)
  return digits
}

export function createPaynowClient(orderRef: string) {
  const id = process.env.PAYNOW_INTEGRATION_ID
  const key = process.env.PAYNOW_INTEGRATION_KEY
  if (!id || !key) {
    throw new Error("Paynow is not configured. Set PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY.")
  }
  const base = getAppBaseUrl()
  return new Paynow(
    id,
    key,
    `${base}/api/paynow/result`,
    `${base}/order/confirmation?ref=${encodeURIComponent(orderRef)}`
  )
}

export function createPaynowVerifier() {
  const id = process.env.PAYNOW_INTEGRATION_ID
  const key = process.env.PAYNOW_INTEGRATION_KEY
  if (!id || !key) {
    throw new Error("Paynow is not configured.")
  }
  const base = getAppBaseUrl()
  return new Paynow(id, key, `${base}/api/paynow/result`, `${base}/order/confirmation`)
}
