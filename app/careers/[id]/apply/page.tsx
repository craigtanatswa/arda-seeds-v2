import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getVacancyById } from "@/lib/careers"
import CareerApplicationForm from "@/components/career-application-form"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const vacancy = await getVacancyById(id)
  if (!vacancy) return { title: "Apply | Careers | ARDA Seeds" }
  return {
    title: `Apply: ${vacancy.title} | Careers | ARDA Seeds`,
    description: `Apply for ${vacancy.title} at ARDA Seeds.`,
  }
}

export default async function ApplyPage({ params }: Props) {
  const { id } = await params
  const vacancy = await getVacancyById(id)

  if (!vacancy) notFound()
  if (vacancy.status !== "open") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">This vacancy is no longer open for applications.</p>
        <Link href="/careers" className="mt-4 inline-block text-green-700 hover:text-green-800 font-medium">
          View open positions
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href={`/careers/${id}`}
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium mb-8"
        >
          ← Back to vacancy
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for {vacancy.title}</h1>
          <p className="text-gray-600 mt-2">Complete the form below to submit your application.</p>
        </div>
        <CareerApplicationForm
          vacancyId={vacancy.id}
          positionAppliedFor={vacancy.title}
          referenceNumber={vacancy.reference_number}
        />
      </div>
    </div>
  )
}
