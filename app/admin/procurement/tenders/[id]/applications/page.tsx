"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import type { Tender, TenderApplication, TenderApplicationStatus } from "@/lib/types"
import { TenderApplicationStatusBadge, TenderStatusBadge } from "@/components/admin/status-badge"
import { ClearFiltersButton } from "@/components/admin/clear-filters-button"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { useNotification } from "@/components/notification-provider"
import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  Download,
  FileText,
  Loader2,
  LogOut,
  Mail,
  Phone,
  User,
} from "lucide-react"

const BUCKET = "tender-documents"

const DOCUMENT_FIELDS: { key: keyof TenderApplication; label: string }[] = [
  { key: "proposal_document_url", label: "Proposal Bid" },
  { key: "tax_clearance_document_url", label: "Tax Clearance" },
  { key: "certificate_of_incorporation_document_url", label: "Certificate of Incorporation" },
  { key: "cr6_document_url", label: "CR6" },
  { key: "cr5_document_url", label: "CR5" },
  { key: "praz_certificate_document_url", label: "PRAZ Certificate" },
]

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" })
}

export default function TenderApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const userRole = useAdminRole()
  const { alert, confirm } = useNotification()
  const tenderId = params?.id as string
  const [tender, setTender] = useState<Tender | null>(null)
  const [tenderLoading, setTenderLoading] = useState(true)
  const [applications, setApplications] = useState<TenderApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<TenderApplicationStatus | "all">("all")
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const selectedApplication = useMemo(
    () => applications.find((a) => a.status === "selected") ?? null,
    [applications]
  )

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
        setTenderLoading(false)
      })
  }, [tenderId])

  useEffect(() => {
    if (!supabase || !tenderId) return
    setLoading(true)
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

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") return applications
    return applications.filter((a) => a.status === statusFilter)
  }, [applications, statusFilter])

  const statusCounts = useMemo(() => {
    return applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] ?? 0) + 1
        return acc
      },
      {} as Record<TenderApplicationStatus, number>
    )
  }, [applications])

  const updateStatus = async (applicationId: string, newStatus: TenderApplicationStatus) => {
    if (!supabase || !tenderId) return

    const currentApp = applications.find((a) => a.id === applicationId)
    if (!currentApp || currentApp.status === newStatus) return

    const existingSelected = applications.find(
      (a) => a.status === "selected" && a.id !== applicationId
    )

    if (newStatus === "selected" && existingSelected) {
      const confirmed = await confirm(
        `"${existingSelected.company_name}" is already selected. Award this tender to "${currentApp.company_name}" instead? The previous selection will be rejected.`,
        { title: "Change awarded supplier?", confirmLabel: "Award instead" }
      )
      if (!confirmed) return
    }

    setUpdatingStatusId(applicationId)
    try {
      if (newStatus === "selected") {
        const { error: clearError } = await supabase
          .from("tender_applications")
          .update({ status: "rejected" })
          .eq("tender_id", tenderId)
          .eq("status", "selected")
          .neq("id", applicationId)
        if (clearError) throw clearError
      }

      const { error } = await supabase
        .from("tender_applications")
        .update({ status: newStatus })
        .eq("id", applicationId)
      if (error) throw error

      setApplications((prev) =>
        prev.map((a) => {
          if (a.id === applicationId) return { ...a, status: newStatus }
          if (newStatus === "selected" && a.status === "selected") return { ...a, status: "rejected" }
          return a
        })
      )

      if (newStatus === "selected") {
        const { error: tenderError } = await supabase
          .from("tenders")
          .update({ status: "awarded" })
          .eq("id", tenderId)
        if (tenderError) throw tenderError
        setTender((t) => (t ? { ...t, status: "awarded" } : null))
      } else if (currentApp.status === "selected") {
        const stillSelected = applications.some(
          (a) => a.status === "selected" && a.id !== applicationId
        )
        if (!stillSelected) {
          const { error: tenderError } = await supabase
            .from("tenders")
            .update({ status: "closed" })
            .eq("id", tenderId)
          if (tenderError) throw tenderError
          setTender((t) => (t ? { ...t, status: "closed" } : null))
        }
      }
    } catch (err: unknown) {
      await alert(err instanceof Error ? err.message : "Failed to update status.", "Error")
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const downloadDocument = async (applicationId: string, docKey: string, path: string) => {
    if (!supabase) return
    setDownloadingKey(`${applicationId}-${docKey}`)
    try {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60)
      if (data?.signedUrl) window.open(data.signedUrl, "_blank")
    } finally {
      setDownloadingKey(null)
    }
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  if (tenderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Tender not found</h1>
          <p className="text-gray-600 mb-6">This tender may have been removed or the link is invalid.</p>
          <Button asChild variant="outline">
            <Link href="/admin/procurement">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tenders
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-green-700 font-semibold hover:text-green-800">
              ARDA Seeds
            </Link>
            {userRole === "admin" && (
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">
                Dashboard
              </Link>
            )}
            <Link href="/admin/procurement" className="text-gray-600 hover:text-gray-900 text-sm">
              Tenders
            </Link>
            <span className="text-gray-900 font-medium text-sm">Applications</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href="/admin/procurement"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tenders
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{tender.title}</h1>
              <p className="text-sm text-gray-500">
                Reference <span className="font-medium text-gray-700">{tender.reference_number}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Closes {formatDate(tender.closing_date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {applications.length} application{applications.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <TenderStatusBadge status={tender.status} />
          </div>
        </div>

        {selectedApplication && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 mb-8">
            <Award className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Tender awarded</p>
              <p className="text-sm text-amber-800 mt-0.5">
                <span className="font-medium">{selectedApplication.company_name}</span> is the selected
                supplier. Only one application can be awarded per tender.
              </p>
            </div>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {(
              [
                { label: "Submitted", status: "submitted" as const, color: "text-gray-900" },
                { label: "Shortlisted", status: "shortlisted" as const, color: "text-blue-700" },
                { label: "Selected", status: "selected" as const, color: "text-amber-700" },
                { label: "Rejected", status: "rejected" as const, color: "text-red-700" },
              ] as const
            ).map(({ label, status, color }) => (
              <div key={status} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{statusCounts[status] ?? 0}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Supplier Applications</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by status:</span>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as TenderApplicationStatus | "all")}
            >
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <ClearFiltersButton
              visible={statusFilter !== "all"}
              onClick={() => setStatusFilter("all")}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-700" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-900 font-medium mb-1">
              {applications.length === 0 ? "No applications yet" : "No applications match this filter"}
            </p>
            <p className="text-sm text-gray-500">
              {applications.length === 0
                ? "Applications will appear here once suppliers submit their bids."
                : "Try selecting a different status filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => {
              const documents = DOCUMENT_FIELDS.filter(({ key }) => app[key])
              const submittedAt = app.submitted_at ?? app.created_at!

              return (
                <article
                  key={app.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{app.company_name}</h3>
                          <TenderApplicationStatusBadge status={app.status} />
                        </div>
                        <p className="text-sm text-gray-500">
                          Submitted {formatDateTime(submittedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                        <label htmlFor={`status-${app.id}`} className="text-sm font-medium text-gray-700">
                          Update status
                        </label>
                        <Select
                          value={app.status}
                          onValueChange={(v) => updateStatus(app.id, v as TenderApplicationStatus)}
                          disabled={updatingStatusId === app.id}
                        >
                          <SelectTrigger id={`status-${app.id}`} className="w-full sm:w-[180px] bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="selected">
                              Selected (Award)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                      Contact Details
                    </h4>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      <div>
                        <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                          <User className="h-3.5 w-3.5" /> Contact Person
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">{app.contact_person}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                          <Mail className="h-3.5 w-3.5" /> Email
                        </dt>
                        <dd className="text-sm text-gray-900 break-all">
                          <a href={`mailto:${app.email}`} className="hover:text-green-700 hover:underline">
                            {app.email}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                          <Phone className="h-3.5 w-3.5" /> Phone
                        </dt>
                        <dd className="text-sm text-gray-900">
                          <a href={`tel:${app.phone}`} className="hover:text-green-700 hover:underline">
                            {app.phone}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                      Submitted Documents
                    </h4>
                    {documents.length === 0 ? (
                      <p className="text-sm text-gray-500">No documents uploaded.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {documents.map(({ key, label }) => {
                          const downloadId = `${app.id}-${key}`
                          const isDownloading = downloadingKey === downloadId
                          return (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              disabled={isDownloading}
                              onClick={() =>
                                downloadDocument(app.id, key, app[key] as string)
                              }
                              className="justify-start h-auto py-2.5 px-3 bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-800"
                            >
                              {isDownloading ? (
                                <Loader2 className="h-4 w-4 mr-2 shrink-0 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2 shrink-0" />
                              )}
                              <span className="text-left text-sm leading-snug">{label}</span>
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
