import type { ValidatedOrderLine } from "@/lib/order-validation"

export type OrderReceiptInput = {
  orderRef: string
  firstName: string
  lastName: string
  email: string
  phone: string
  collectionName: string
  collectionCity: string
  collectionAddress: string | null
  fulfillmentType: string
  deliveryAddress: string | null
  lines: ValidatedOrderLine[]
  total: number
  paidAt: string | null
}

const PAID_STATUSES = new Set([
  "paid",
  "processing",
  "ready_for_collection",
  "awaiting_customer_collection",
  "awaiting_customer_delivery",
  "out_for_delivery",
  "collected",
  "delivered",
])

export function isOrderPaid(status: string): boolean {
  return PAID_STATUSES.has(status)
}

export function formatCollectionLabel(input: {
  collectionName: string
  collectionCity: string
  collectionAddress: string | null
}): string {
  return `${input.collectionName}, ${input.collectionCity}${
    input.collectionAddress ? ` (${input.collectionAddress})` : ""
  }`
}

export function formatFulfillmentLabel(input: OrderReceiptInput): string {
  if (input.fulfillmentType === "delivery" && input.deliveryAddress) {
    return `Delivery: ${input.deliveryAddress}`
  }
  return `Collection: ${formatCollectionLabel(input)}`
}
