import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getTenderById } from "@/lib/tenders"
import TenderDocumentDownloadButton from "@/components/tender-document-download-button"
import { Calendar, FileText } from "lucide-react"

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ applied?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tender = await getTenderById(id)
  if (!tender) return { title: "Tender Not Found | ARDA Seeds" }
  return {
    title: `${tender.title} | Tenders | ARDA Seeds`,
    description: tender.summary.slice(0, 160),
  }
}

function formatClosingDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export default async function TenderDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { applied } = await searchParams
  const tender = await getTenderById(id)

  if (!tender) notFound()
  if (tender.status !== "open") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">This tender is no longer open for applications.</p>
        <Button asChild className="mt-4 bg-green-700 hover:bg-green-800">
          <Link href="/tenders">View open tenders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/tenders"
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium mb-8"
        >
          ← Back to tenders
        </Link>

        {applied === "1" && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3">
            Your application has been submitted successfully. We will be in touch.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 border-b">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tender.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
              <span className="flex items-center gap-2 font-medium text-green-700">
                Ref: {tender.reference_number}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-700" />
                Closing date: {formatClosingDate(tender.closing_date)}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{tender.summary}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Full Description</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{tender.description}</div>
            </section>

            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {tender.document_url && (
                <TenderDocumentDownloadButton
                  tenderId={tender.id}
                  variant="outline"
                  className="border-green-700 text-green-700 hover:bg-green-50"
                >
                  Download Tender Document
                </TenderDocumentDownloadButton>
              )}
              <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 text-white">
                <Link href={`/tenders/${tender.id}/apply`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
