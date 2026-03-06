"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import type { Vacancy } from "@/lib/types"
import { Briefcase, Plus, Pencil, Trash2, XCircle, FileText, LogOut, Users, FolderOpen, FolderClosed } from "lucide-react"
import { useAdminRole } from "@/lib/hooks/use-admin-role"

type HRStats = {
  totalVacancies: number
  openVacancies: number
  closedVacancies: number
  totalApplications: number
  newApplications: number
  shortlisted: number
  rejected: number
}

export default function HRDashboardPage() {
  const router = useRouter()
  const userRole = useAdminRole()
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<HRStats | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from("vacancies")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        setVacancies((data as Vacancy[]) ?? [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from("vacancies").select("id", { count: "exact", head: true }),
      supabase.from("vacancies").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("applications").select("id, status"),
    ]).then(([totalVacRes, openVacRes, appRes]) => {
      const totalVacancies = totalVacRes.count ?? 0
      const openVacancies = openVacRes.count ?? 0
      const applications = (appRes.data ?? []) as { id: string; status: string }[]
      const byStatus = applications.reduce(
        (acc, a) => {
          acc[a.status] = (acc[a.status] ?? 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
      setStats({
        totalVacancies,
        openVacancies,
        closedVacancies: totalVacancies - openVacancies,
        totalApplications: applications.length,
        newApplications: byStatus.new ?? 0,
        shortlisted: byStatus.shortlisted ?? 0,
        rejected: byStatus.rejected ?? 0,
      })
    })
  }, [])

  const handleClose = async (id: string) => {
    if (!supabase || !confirm("Close this vacancy? It will no longer appear on the careers page.")) return
    const { error } = await supabase.from("vacancies").update({ status: "closed" }).eq("id", id)
    if (error) alert(error.message)
    else setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, status: "closed" } : v)))
  }

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this vacancy? This cannot be undone.")) return
    const { error } = await supabase.from("vacancies").delete().eq("id", id)
    if (error) alert(error.message)
    else setVacancies((prev) => prev.filter((v) => v.id !== id))
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
            <Link href="/admin/hr" className="text-gray-900 font-medium">
              Vacancies
            </Link>
            <Link href="/admin/hr/applications" className="text-gray-600 hover:text-gray-900">
              Applications
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {stats !== null && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <Briefcase className="h-4 w-4" /> Total Vacancies
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVacancies}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <FolderOpen className="h-4 w-4 text-green-600" /> Open
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.openVacancies}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <FolderClosed className="h-4 w-4" /> Closed
              </div>
              <p className="text-2xl font-bold text-gray-700">{stats.closedVacancies}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                <Users className="h-4 w-4" /> Total Applications
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">New</div>
              <p className="text-2xl font-bold text-blue-600">{stats.newApplications}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">Shortlisted / Rejected</div>
              <p className="text-2xl font-bold text-gray-700">
                {stats.shortlisted} / {stats.rejected}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Vacancies</h1>
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/admin/hr/vacancies/new">
              <Plus className="h-4 w-4 mr-2" /> New vacancy
            </Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : vacancies.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No vacancies yet.</p>
            <Button asChild className="mt-4 bg-green-700 hover:bg-green-800">
              <Link href="/admin/hr/vacancies/new">Create first vacancy</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Closing</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <Link href={`/careers/${v.id}`} target="_blank" className="text-green-700 hover:underline">
                        {v.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{v.department}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                          v.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(v.closing_date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/hr/applications?vacancy=${v.id}`}>
                            <FileText className="h-4 w-4 mr-1" /> Applications
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/hr/vacancies/${v.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        {v.status === "open" && (
                          <Button variant="ghost" size="sm" onClick={() => handleClose(v.id)} className="text-amber-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)} className="text-red-600">
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
