import { cn } from "@/lib/utils"

const TENDER_STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
  shortlisted: "bg-blue-100 text-blue-800",
  awarded: "bg-amber-100 text-amber-800",
}

const TENDER_APP_STATUS_STYLES: Record<string, string> = {
  submitted: "bg-gray-100 text-gray-700",
  shortlisted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  selected: "bg-amber-100 text-amber-800",
}

const APPLICATION_STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const SALES_ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  awaiting_customer_collection: "Awaiting new collection",
  awaiting_customer_delivery: "Awaiting delivery address",
  ready_for_collection: "Ready for collection",
  out_for_delivery: "Out for delivery",
  collected: "Collected",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment failed",
}

export function salesOrderStatusClassName(status: string): string {
  if (status === "pending_payment") return "bg-amber-100 text-amber-800"
  if (status === "payment_failed" || status === "cancelled") return "bg-red-100 text-red-800"
  if (
    status === "paid" ||
    status === "processing" ||
    status === "awaiting_customer_collection" ||
    status === "awaiting_customer_delivery" ||
    status === "ready_for_collection" ||
    status === "out_for_delivery" ||
    status === "collected" ||
    status === "delivered"
  ) {
    return "bg-green-100 text-green-800"
  }
  return "bg-gray-100 text-gray-700"
}

export function SalesOrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
        salesOrderStatusClassName(status)
      )}
    >
      {SALES_ORDER_STATUS_LABELS[status] ?? status.replaceAll("_", " ")}
    </span>
  )
}

export function TenderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded text-sm font-medium capitalize",
        TENDER_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {status}
    </span>
  )
}

export function TenderApplicationStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded text-sm font-medium capitalize",
        TENDER_APP_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {status}
    </span>
  )
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded text-sm font-medium capitalize",
        APPLICATION_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {status}
    </span>
  )
}
