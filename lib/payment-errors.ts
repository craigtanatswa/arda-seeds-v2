import type { PaynowPaymentMethod } from "@/lib/paynow"

export function isInsufficientBalanceError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes("insufficient") &&
    (m.includes("balance") || m.includes("fund"))
  )
}

export function walletLabelForMethod(method: PaynowPaymentMethod | ""): string {
  if (method === "innbucks") return "InnBucks"
  if (method === "ecocash") return "EcoCash"
  return "mobile money"
}

export function formatInsufficientBalanceMessage(
  method: PaynowPaymentMethod | "",
  totalUsd: number
): string {
  const wallet = walletLabelForMethod(method)
  return `Your ${wallet} wallet does not have enough funds to pay US$ ${totalUsd.toFixed(2)}. Please top up your wallet and try again, or choose a different payment method.`
}
