import type { Metadata } from "next"
import QuoteRequestForm from "@/components/quote-request-form"

export const metadata: Metadata = {
  title: "Request a Quote | ARDA Seeds",
  description:
    "Request a quote for ARDA Seeds products. Our team will get back to you with pricing and availability information.",
}

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to request pricing information for our products. Our team will get back to you with a
          detailed quotation.
        </p>

        <QuoteRequestForm />
      </div>
    </div>
  )
}
