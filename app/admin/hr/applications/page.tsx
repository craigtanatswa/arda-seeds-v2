"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import type { Application, Vacancy, ApplicationStatus } from "@/lib/types"
import { ApplicationStatusBadge } from "@/components/admin/status-badge"
import { ClearFiltersButton } from "@/components/admin/clear-filters-button"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { useNotification } from "@/components/notification-provider"
import {
  Briefcase,
  Download,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react"

const BUCKET = "career-applications"

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function HRApplicationsContent() {
  const router = useRouter()
  const userRole = useAdminRole()
  const { alert } = useNotification()
  const searchParams = useSearchParams()
  const vacancyFilter = searchParams.get("vacancy") ?? "all"
  const statusFilter = (searchParams.get("status") ?? "all") as ApplicationStatus | "all"
  const [applications, setApplications] = useState<Application[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [viewerTitle, setViewerTitle] = useState("")
  const [viewerLoading, setViewerLoading] = useState(false)
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const setVacancyFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") params.delete("vacancy")
    else params.set("vacancy", value)
    router.push(`/admin/hr/applications?${params.toString()}`)
  }

  const setStatusFilterUrl = (value: ApplicationStatus | "all") => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") params.delete("status")
    else params.set("status", value)
    router.push(`/admin/hr/applications?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (!supabase) return
    supabase.from("vacancies").select("id, title").order("title").then(({ data }) => setVacancies((data as Vacancy[]) ?? []))
  }, [])

  useEffect(() => {
    if (!supabase) return
    setLoading(true)
    let q = supabase.from("applications").select("*").order("created_at", { ascending: false })
    if (vacancyFilter !== "all") q = q.eq("vacancy_id", vacancyFilter)
    q.then(({ data, error }) => {
      if (error) console.error(error)
      setApplications((data as Application[]) ?? [])
      setLoading(false)
    })
  }, [vacancyFilter])

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
      {} as Record<ApplicationStatus, number>
    )
  }, [applications])

  const selectedVacancyTitle =
    vacancyFilter !== "all"
      ? vacancies.find((v) => v.id === vacancyFilter)?.title ?? null
      : null

  const getSignedUrl = async (path: string, expirySeconds = 60) => {
    if (!supabase) return null
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, expirySeconds)
    return data?.signedUrl ?? null
  }

  const openViewer = async (path: string, title: string) => {
    setViewerLoading(true)
    setViewerOpen(true)
    setViewerTitle(title)
    setViewerUrl(null)
    const url = await getSignedUrl(path, 3600)
    setViewerUrl(url)
    setViewerLoading(false)
  }

  const closeViewer = () => {
    setViewerOpen(false)
    setViewerUrl(null)
    setViewerTitle("")
  }

  const downloadDocument = async (applicationId: string, docKey: string, path: string) => {
    setDownloadingKey(`${applicationId}-${docKey}`)
    try {
      const url = await getSignedUrl(path)
      if (url) window.open(url, "_blank")
    } finally {
      setDownloadingKey(null)
    }
  }

  const updateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    if (!supabase) return
    setUpdatingStatusId(applicationId)
    try {
      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId)
      if (error) throw error
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a)))
    } catch (err: unknown) {
      await alert(err instanceof Error ? err.message : "Failed to update status.", "Error")
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  const hasActiveFilters = vacancyFilter !== "all" || statusFilter !== "all"

  const clearFilters = () => {
    router.push("/admin/hr/applications")
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
            <Link href="/admin/hr" className="text-gray-600 hover:text-gray-900 text-sm">
              Vacancies
            </Link>
            <span className="text-gray-900 font-medium text-sm">Applications</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
              {selectedVacancyTitle ? (
                <p className="text-sm text-gray-600">
                  Showing applications for{" "}
                  <span className="font-medium text-gray-900">{selectedVacancyTitle}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">Review and manage candidate applications across all vacancies.</p>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gray-400" />
                  {applications.length} application{applications.length !== 1 ? "s" : ""}
                  {statusFilter !== "all" ? " in current view" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {(
              [
                { label: "New", status: "new" as const, color: "text-blue-700" },
                { label: "Shortlisted", status: "shortlisted" as const, color: "text-green-700" },
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
          <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Vacancy:</span>
              <Select value={vacancyFilter} onValueChange={setVacancyFilter}>
                <SelectTrigger className="w-[240px] sm:w-[280px] bg-white">
                  <SelectValue placeholder="All vacancies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All vacancies</SelectItem>
                  {vacancies.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</span>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilterUrl(v as ApplicationStatus | "all")}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ClearFiltersButton visible={hasActiveFilters} onClick={clearFilters} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-700" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-900 font-medium mb-1">
              {applications.length === 0 ? "No applications yet" : "No applications match the filters"}
            </p>
            <p className="text-sm text-gray-500">
              {applications.length === 0
                ? "Applications will appear here once candidates apply through the careers page."
                : "Try adjusting the vacancy or status filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => {
              const fullName = `${app.first_name} ${app.last_name}`
              const documents: { key: string; label: string; path: string; canView: boolean }[] = [
                { key: "cv", label: "Curriculum Vitae", path: app.cv_path, canView: true },
              ]
              if (app.cover_letter_path) {
                documents.push({
                  key: "cover",
                  label: "Cover Letter",
                  path: app.cover_letter_path,
                  canView: true,
                })
              }
              ;(app.academic_certificates_paths ?? []).forEach((path, index) => {
                documents.push({
                  key: `cert-${index}`,
                  label: `Academic Certificate ${index + 1}`,
                  path,
                  canView: true,
                })
              })

              return (
                <article
                  key={app.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">{app.position_applied_for}</p>
                        <p className="text-sm text-gray-500">
                          Applied {formatDateTime(app.created_at!)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                        <label htmlFor={`status-${app.id}`} className="text-sm font-medium text-gray-700">
                          Update status
                        </label>
                        <Select
                          value={app.status}
                          onValueChange={(v) => updateStatus(app.id, v as ApplicationStatus)}
                          disabled={updatingStatusId === app.id}
                        >
                          <SelectTrigger id={`status-${app.id}`} className="w-full sm:w-[160px] bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
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
                      <div>
                        <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                          <Briefcase className="h-3.5 w-3.5" /> Position
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">{app.position_applied_for}</dd>
                      </div>
                      {(app.city || app.physical_address) && (
                        <div className="sm:col-span-2 lg:col-span-3">
                          <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                            <MapPin className="h-3.5 w-3.5" /> Location
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {[app.physical_address, app.city].filter(Boolean).join(", ")}
                          </dd>
                        </div>
                      )}
                      {app.reference_number && (
                        <div>
                          <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                            <User className="h-3.5 w-3.5" /> Reference No.
                          </dt>
                          <dd className="text-sm text-gray-900">{app.reference_number}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                      Submitted Documents
                    </h4>
                    <div className="space-y-3">
                      {documents.map(({ key, label, path, canView }) => {
                        const downloadId = `${app.id}-${key}`
                        const isDownloading = downloadingKey === downloadId
                        return (
                          <div
                            key={key}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                              <span className="text-sm font-medium text-gray-900">{label}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                              {canView && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openViewer(path, `${label} — ${fullName}`)}
                                  className="gap-1.5 bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-800"
                                >
                                  <Eye className="h-4 w-4" /> View
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isDownloading}
                                onClick={() => downloadDocument(app.id, key, path)}
                                className="gap-1.5 bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-800"
                              >
                                {isDownloading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                Download
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <Dialog open={viewerOpen} onOpenChange={(open) => !open && closeViewer()}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-lg">{viewerTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 relative bg-gray-100">
            {viewerLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-700" />
              </div>
            )}
            {!viewerLoading && viewerUrl && (
              <iframe src={viewerUrl} title={viewerTitle} className="w-full h-full border-0" />
            )}
            {!viewerLoading && !viewerUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Could not load document.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function HRApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-green-700" />
        </div>
      }
    >
      <HRApplicationsContent />
    </Suspense>
  )
}
