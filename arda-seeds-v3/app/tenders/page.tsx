import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOpenTenders } from "@/lib/tenders"
import { FileText, Calendar, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Tenders | ARDA Seeds",
  description:
    "View open procurement tenders at ARDA Seeds. Download tender documents and submit your proposal.",
}

function formatClosingDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export default async function TendersPage() {
  const tenders = await getOpenTenders()

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Procurement Tenders
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed max-w-3xl mx-auto">
              Open tenders from ARDA Seeds. Download documents and submit your proposal before the closing date.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Open Tenders</h2>

        {tenders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">There are no open tenders at the moment.</p>
            <p className="text-gray-500 mt-2">Check back later or contact us for more information.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {tenders.map((t) => (
              <li key={t.id}>
                <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{t.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                          <span className="font-medium text-green-700">Ref: {t.reference_number}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-green-700" />
                            Closes {formatClosingDate(t.closing_date)}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{t.summary}</p>
                      </div>
                      <div className="flex flex-shrink-0 gap-2 flex-wrap">
                        {t.document_url && (
                          <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50" asChild>
                            <Link href={`/api/tenders/${t.id}/document`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Link>
                          </Button>
                        )}
                        <Button asChild className="bg-green-700 hover:bg-green-800 text-white border-0">
                          <Link href={`/tenders/${t.id}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            View & Apply
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
