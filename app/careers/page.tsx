import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOpenVacancies } from "@/lib/careers"
import { Briefcase, MapPin, Building2, Calendar, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers | ARDA Seeds",
  description:
    "Join ARDA Seeds. Explore current job vacancies in seed production and agriculture in Zimbabwe.",
}

function formatClosingDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function previewDescription(text: string, maxLength = 120) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "…"
}

export default async function CareersPage() {
  const vacancies = await getOpenVacancies()

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Careers at ARDA Seeds
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed max-w-3xl mx-auto">
              Grow with us. Join a team committed to quality seed production and agricultural excellence in Zimbabwe.
            </p>
          </div>
        </div>
      </div>

      {/* Vacancies list */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Open Vacancies</h2>

        {vacancies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">There are no open positions at the moment.</p>
            <p className="text-gray-500 mt-2">Check back later or contact us at customerexperience@ardaseeds.co.zw</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {vacancies.map((v) => (
              <li key={v.id}>
                <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{v.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-green-700" />
                            {v.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-green-700" />
                            {v.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-green-700" />
                            {v.employment_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-green-700" />
                            Closes {formatClosingDate(v.closing_date)}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {previewDescription(v.description)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          asChild
                          className="bg-green-700 hover:bg-green-800 text-white border-0"
                        >
                          <Link href={`/careers/${v.id}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
