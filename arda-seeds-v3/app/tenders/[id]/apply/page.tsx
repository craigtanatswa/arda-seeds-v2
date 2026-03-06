import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTenderById } from "@/lib/tenders"
import TenderApplicationForm from "@/components/tender-application-form"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tender = await getTenderById(id)
  if (!tender) return { title: "Apply | Tenders | ARDA Seeds" }
  return {
    title: `Apply: ${tender.title} | Tenders | ARDA Seeds`,
    description: `Submit your proposal for ${tender.title}.`,
  }
}

export default async function TenderApplyPage({ params }: Props) {
  const { id } = await params
  const tender = await getTenderById(id)

  if (!tender) notFound()
  if (tender.status !== "open") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">This tender is no longer open for applications.</p>
        <Link href="/tenders" className="mt-4 inline-block text-green-700 hover:text-green-800 font-medium">
          View open tenders
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href={`/tenders/${id}`}
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium mb-8"
        >
          ← Back to tender
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for {tender.title}</h1>
          <p className="text-gray-600 mt-2">Complete the form below to submit your proposal.</p>
        </div>
        <TenderApplicationForm tenderId={tender.id} tenderTitle={tender.title} />
      </div>
    </div>
  )
}
