import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getVacancyById } from "@/lib/careers"
import { MapPin, Building2, Calendar, Briefcase, CheckCircle } from "lucide-react"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const vacancy = await getVacancyById(id)
  if (!vacancy) return { title: "Vacancy Not Found | ARDA Seeds" }
  return {
    title: `${vacancy.title} | Careers | ARDA Seeds`,
    description: vacancy.description.slice(0, 160),
  }
}

function formatClosingDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export default async function VacancyDetailPage({ params }: Props) {
  const { id } = await params
  const vacancy = await getVacancyById(id)

  if (!vacancy) notFound()
  if (vacancy.status !== "open") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">This vacancy is no longer open for applications.</p>
        <Button asChild className="mt-4 bg-green-700 hover:bg-green-800">
          <Link href="/careers">View open positions</Link>
        </Button>
      </div>
    )
  }

  const responsibilities = vacancy.responsibilities
    ? vacancy.responsibilities.split("\n").filter(Boolean)
    : []
  const requirements = vacancy.requirements
    ? vacancy.requirements.split("\n").filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/careers"
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium mb-8"
        >
          ← Back to careers
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 border-b">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{vacancy.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-700" />
                {vacancy.department}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-700" />
                {vacancy.location}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-700" />
                {vacancy.employment_type}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-700" />
                Closing date: {formatClosingDate(vacancy.closing_date)}
              </span>
            </div>
            {vacancy.reference_number && (
              <p className="mt-2 text-sm text-gray-500">Ref: {vacancy.reference_number}</p>
            )}
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{vacancy.description}</div>
            </section>

            {responsibilities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h2>
                <ul className="space-y-2">
                  {responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {requirements.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="pt-6 border-t">
              <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 text-white">
                <Link href={`/careers/${vacancy.id}/apply`}>Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
