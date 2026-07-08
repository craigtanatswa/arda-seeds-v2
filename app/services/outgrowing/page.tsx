import type { Metadata } from "next"
import ServicePageContent from "@/components/service-page-content"
import { getServiceById } from "@/lib/service-data"

export const metadata: Metadata = {
  title: "Outgrowing Programme | ARDA Seeds",
  description:
    "Join ARDA Seeds' outgrower programme — we provide foundation seed and inputs; you produce certified seed and repay us in the agreed quantity.",
}

export default function OutgrowingPage() {
  const service = getServiceById("outgrowing")!

  return <ServicePageContent service={service} />
}
