"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import type { Tender } from "@/lib/types"
import { TenderStatusBadge } from "@/components/admin/status-badge"
import { FileText, Plus, Pencil, Trash2, Eye, LogOut, FolderOpen, FolderClosed, Award, Users } from "lucide-react"
import { useAdminRole } from "@/lib/hooks/use-admin-role"

type ProcurementStats = {
  totalTenders: number
  openTenders: number
  draftTenders: number
  closedTenders: number
  awardedTenders: number
  totalApplications: number
}

export default function ProcurementDashboardPage() {
  const router = useRouter()
  const userRole = useAdminRole()
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [closingDateFilter, setClosingDateFilter] = useState("")
  const [applicationsCount, setApplicationsCount] = useState<Record<string, number>>({})
  const [stats, setStats] = useState<ProcurementStats | null>(null)

  useEffect(() => {
    if (!supabase) return
    let q = supabase.from("tenders").select("*").order("created_at", { ascending: false })
    if (statusFilter !== "all") q = q.eq("status", statusFilter)
    if (searchQuery.trim()) q = q.ilike("title", `%${searchQuery.trim()}%`)
    if (closingDateFilter) q = q.gte("closing_date", closingDateFilter)
    q.then(({ data, error }) => {
      if (error) console.error(error)
      setTenders((data as Tender[]) ?? [])
      setLoading(false)
    })
  }, [statusFilter, searchQuery, closingDateFilter])

  useEffect(() => {
    if (!supabase || tenders.length === 0) return
    supabase
      .from("tender_applications")
      .select("tender_id")
      .then(({ data }) => {
        const counts: Record<string, number> = {}
        ;(data ?? []).forEach((r: { tender_id: string }) => {
          counts[r.tender_id] = (counts[r.tender_id] ?? 0) + 1
        })
        setApplicationsCount(counts)
      })
  }, [tenders.length])

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from("tenders").select("id", { count: "exact", head: true }),
      supabase.from("tenders").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("tenders").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("tenders").select("id", { count: "exact", head: true }).eq("status", "closed"),
      supabase.from("tenders").select("id", { count: "exact", head: true }).eq("status", "awarded"),
      supabase.from("tender_applications").select("id", { count: "exact", head: true }),
    ]).then(([total, open, draft, closed, awarded, apps]) => {
      setStats({
        totalTenders: total.count ?? 0,
        openTenders: open.count ?? 0,
        draftTenders: draft.count ?? 0,
        closedTenders: closed.count ?? 0,
        awardedTenders: awarded.count ?? 0,
        totalApplications: apps.count ?? 0,
      })
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this tender? This cannot be undone.")) return
    const { error } = await supabase.from("tenders").delete().eq("id", id)
    if (error) alert(error.message)
    else setTenders((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
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
            <Link href="/admin/procurement" className="text-gray-900 font-medium">
              Tenders
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {stats !== null && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <FileText className="h-4 w-4" /> Total Tenders
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTenders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <FolderOpen className="h-4 w-4 text-green-600" /> Open
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.openTenders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">Draft</div>
              <p className="text-2xl font-bold text-gray-500">{stats.draftTenders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <FolderClosed className="h-4 w-4" /> Closed
              </div>
              <p className="text-2xl font-bold text-gray-700">{stats.closedTenders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <Award className="h-4 w-4 text-amber-600" /> Awarded
              </div>
              <p className="text-2xl font-bold text-amber-700">{stats.awardedTenders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <Users className="h-4 w-4" /> Total Applications
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tenders</h1>
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/admin/procurement/tenders/new">
              <Plus className="h-4 w-4 mr-2" /> Create Tender
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="awarded">Awarded</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Closing from:</span>
            <Input
              type="date"
              value={closingDateFilter}
              onChange={(e) => setClosingDateFilter(e.target.value)}
              className="max-w-[160px]"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tenders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No tenders yet.</p>
            <Button asChild className="mt-4 bg-green-700 hover:bg-green-800">
              <Link href="/admin/procurement/tenders/new">Create first tender</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Reference</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Closing Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Applications</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenders.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-gray-900">{t.title}</td>
                    <td className="py-3 px-4 text-gray-600">{t.reference_number}</td>
                    <td className="py-3 px-4">
                      <TenderStatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(t.closing_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{applicationsCount[t.id] ?? 0}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/procurement/tenders/${t.id}/applications`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/procurement/tenders/${t.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
