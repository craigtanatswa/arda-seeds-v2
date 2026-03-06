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
