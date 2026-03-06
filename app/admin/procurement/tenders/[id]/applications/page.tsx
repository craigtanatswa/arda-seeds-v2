"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import type { Tender, TenderApplication, TenderApplicationStatus } from "@/lib/types"
import { TenderApplicationStatusBadge } from "@/components/admin/status-badge"
import { Download } from "lucide-react"

const BUCKET = "tender-documents"

export default function TenderApplicationsPage() {
  const params = useParams()
  const tenderId = params?.id as string
  const [tender, setTender] = useState<Tender | null>(null)
  const [applications, setApplications] = useState<TenderApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || !tenderId) return
    supabase
      .from("tenders")
      .select("*")
      .eq("id", tenderId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setTender(null)
        else setTender(data as Tender)
      })
  }, [tenderId])

  useEffect(() => {
    if (!supabase || !tenderId) return
    supabase
      .from("tender_applications")
      .select("*")
      .eq("tender_id", tenderId)
      .order("submitted_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        setApplications((data as TenderApplication[]) ?? [])
        setLoading(false)
      })
  }, [tenderId])

  const updateStatus = async (applicationId: string, newStatus: TenderApplicationStatus) => {
    if (!supabase) return
    const { error } = await supabase
      .from("tender_applications")
      .update({ status: newStatus })
      .eq("id", applicationId)
    if (error) {
      alert(error.message)
      return
    }
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
    )
    if (newStatus === "selected" && tenderId) {
      await supabase.from("tenders").update({ status: "awarded" }).eq("id", tenderId)
      setTender((t) => (t ? { ...t, status: "awarded" } : null))
    }
  }

  const getSignedUrl = async (path: string) => {
    if (!supabase) return null
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60)
    return data?.signedUrl ?? null
  }

  if (!tender) return <div className="container mx-auto px-4 py-8">Tender not found.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/procurement" className="text-green-700 hover:text-green-800 font-medium text-sm">
            ← Back to Tenders
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-2">{tender.title}</h1>
          <p className="text-sm text-gray-600">Reference: {tender.reference_number}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Applications</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.company_name}</h3>
                    <p className="text-sm text-gray-600">{app.contact_person}</p>
                    <p className="text-sm text-gray-500">
                      {app.email} · {app.phone}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted {new Date(app.submitted_at ?? app.created_at!).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={app.status}
                      onValueChange={(v) => updateStatus(app.id, v as TenderApplicationStatus)}
                    >
                      <SelectTrigger className="w-[130px] bg-gray-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="shortlisted">Shortlist</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                        <SelectItem value="selected">Select (Award)</SelectItem>
                      </SelectContent>
                    </Select>
                    <TenderApplicationStatusBadge status={app.status} />
                    {app.proposal_document_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const url = await getSignedUrl(app.proposal_document_url!)
                          if (url) window.open(url, "_blank")
                        }}
                        className="gap-1"
                      >
                        <Download className="h-4 w-4" /> Proposal
                      </Button>
                    )}
                    {app.tax_clearance_document_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const url = await getSignedUrl(app.tax_clearance_document_url!)
                          if (url) window.open(url, "_blank")
                        }}
                        className="gap-1"
                      >
                        <Download className="h-4 w-4" /> Tax Clearance
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
