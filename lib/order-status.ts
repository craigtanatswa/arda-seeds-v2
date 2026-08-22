export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Payment received",
  processing: "Preparing your order",
  awaiting_customer_collection: "Action needed — new collection point",
  awaiting_customer_delivery: "Action needed — delivery address",
  ready_for_collection: "Ready for collection",
  out_for_delivery: "Out for delivery",
  collected: "Collected",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment failed",
}

export const ORDER_STATUS_DESCRIPTIONS: Record<string, string> = {
  pending_payment: "We are waiting for Paynow to confirm your payment.",
  paid: "Your payment is confirmed. Our sales team is preparing your order.",
  processing: "Our sales team is preparing your order.",
  awaiting_customer_collection:
    "Stock is not available at your chosen collection point. Please reply to our email to choose another location.",
  awaiting_customer_delivery:
    "Stock is not available at your chosen collection point. Please reply to our email with your delivery address.",
  ready_for_collection: "Your order is ready. Please collect it from your chosen collection point.",
  out_for_delivery: "Your order is on its way to your delivery address.",
  collected: "This order has been collected.",
  delivered: "This order has been delivered.",
  cancelled: "This order has been cancelled.",
  payment_failed: "Payment was not completed. You can place a new order from the products page.",
}

export type OrderTrackStep = {
  id: string
  label: string
}

export function getOrderTrackSteps(fulfillmentType: string): OrderTrackStep[] {
  if (fulfillmentType === "delivery") {
    return [
      { id: "payment", label: "Payment" },
      { id: "preparing", label: "Preparing" },
      { id: "out_for_delivery", label: "Out for delivery" },
      { id: "delivered", label: "Delivered" },
    ]
  }

  return [
    { id: "payment", label: "Payment" },
    { id: "preparing", label: "Preparing" },
    { id: "ready_for_collection", label: "Ready for collection" },
    { id: "collected", label: "Collected" },
  ]
}

export function getOrderTrackStepIndex(status: string): number {
  switch (status) {
    case "pending_payment":
    case "payment_failed":
      return 0
    case "paid":
    case "processing":
    case "awaiting_customer_collection":
    case "awaiting_customer_delivery":
      return 1
    case "ready_for_collection":
    case "out_for_delivery":
      return 2
    case "collected":
    case "delivered":
      return 3
    default:
      return -1
  }
}

export function formatOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status.replaceAll("_", " ")
}

export function formatOrderStatusDescription(status: string): string {
  return ORDER_STATUS_DESCRIPTIONS[status] ?? "We are updating this order."
}
