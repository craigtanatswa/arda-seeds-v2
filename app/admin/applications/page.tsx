"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import type { Application, Vacancy, ApplicationStatus } from "@/lib/types"
import { FileText, Download, Eye } from "lucide-react"

const BUCKET = "career-applications"

function AdminApplicationsContent() {
  const router = useRouter()
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

  const setVacancyFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") params.delete("vacancy")
    else params.set("vacancy", value)
    router.push(`/admin/applications?${params.toString()}`)
  }

  const setStatusFilterUrl = (value: ApplicationStatus | "all") => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") params.delete("status")
    else params.set("status", value)
    router.push(`/admin/applications?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (!supabase) return
    supabase
      .from("vacancies")
      .select("id, title")
      .order("title")
      .then(({ data }) => setVacancies((data as Vacancy[]) ?? []))
  }, [])

  useEffect(() => {
    if (!supabase) return
    setLoading(true)
    let q = supabase.from("applications").select("*").order("created_at", { ascending: false })
    if (vacancyFilter !== "all") q = q.eq("vacancy_id", vacancyFilter)
    if (statusFilter !== "all") q = q.eq("status", statusFilter)
    q.then(({ data, error }) => {
      if (error) console.error(error)
      setApplications((data as Application[]) ?? [])
      setLoading(false)
    })
  }, [vacancyFilter, statusFilter])

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

  const updateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    if (!supabase) return
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId)
    if (error) alert(error.message)
    else setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-green-700 font-semibold hover:text-green-800">
              ARDA Seeds
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Vacancies
            </Link>
            <Link href="/admin/applications" className="text-gray-900 font-medium">
              Applications
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Applications</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Vacancy:</span>
            <Select value={vacancyFilter} onValueChange={setVacancyFilter}>
              <SelectTrigger className="w-[280px] bg-white">
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
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilterUrl(v as ApplicationStatus | "all")}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No applications match the filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {app.first_name} {app.last_name}
                    </h2>
                    <p className="text-sm text-gray-600">{app.position_applied_for}</p>
                    <p className="text-sm text-gray-500">
                      {app.email} · {app.phone}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied {new Date(app.created_at!).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as ApplicationStatus)}>
                      <SelectTrigger className="w-[130px] bg-gray-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewer(app.cv_path, `CV — ${app.first_name} ${app.last_name}`)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" /> View CV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const url = await getSignedUrl(app.cv_path)
                        if (url) window.open(url, "_blank")
                      }}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" /> Download CV
                    </Button>
                    {app.cover_letter_path && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openViewer(app.cover_letter_path!, `Cover letter — ${app.first_name} ${app.last_name}`)
                          }
                          className="gap-1"
                        >
                          <Eye className="h-4 w-4" /> View Cover
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const url = await getSignedUrl(app.cover_letter_path!)
                            if (url) window.open(url, "_blank")
                          }}
                          className="gap-1"
                        >
                          <Download className="h-4 w-4" /> Download Cover
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
                <p className="text-gray-500">Loading document…</p>
              </div>
            )}
            {!viewerLoading && viewerUrl && (
              <iframe
                src={viewerUrl}
                title={viewerTitle}
                className="w-full h-full border-0"
              />
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

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <AdminApplicationsContent />
    </Suspense>
  )
}
