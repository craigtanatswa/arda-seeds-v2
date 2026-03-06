"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Briefcase, FileText, LogOut, LayoutDashboard, Shield } from "lucide-react"

interface AdminModule {
  id: string
  name: string
  description: string
  href: string
  icon: React.ReactNode
}

const ADMIN_MODULES: AdminModule[] = [
  {
    id: "hr",
    name: "HR System",
    description: "Careers, vacancies, and job applications",
    href: "/admin/hr",
    icon: <Briefcase className="h-8 w-8" />,
  },
  {
    id: "procurement",
    name: "Procurement System",
    description: "Tenders and supplier applications",
    href: "/admin/procurement",
    icon: <FileText className="h-8 w-8" />,
  },
]

export default function MasterAdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login")
        return
      }
      supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
        .then(({ data: profile }) => {
          const role = profile?.role as string | undefined
          if (role === "admin_hr") {
            router.replace("/admin/hr")
            return
          }
          if (role === "admin_prcmt") {
            router.replace("/admin/procurement")
            return
          }
          if (role !== "admin") {
            router.replace("/admin/login")
            return
          }
          setLoading(false)
        })
    })
  }, [router])

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-green-700" />
            <span className="font-semibold text-gray-900">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/admins" className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1">
              <Shield className="h-4 w-4" /> Manage Admins
            </Link>
            <Link href="/" className="text-green-700 hover:text-green-800 text-sm font-medium">
              View site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Systems</h1>
        <p className="text-gray-600 mb-8">Choose a system to manage.</p>

        <div className="mb-8">
          <Link
            href="/admin/admins"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-700 shadow-sm hover:border-green-200 hover:bg-green-50 hover:text-green-800 transition-colors"
          >
            <Shield className="h-5 w-5 text-green-700" />
            <span className="font-medium">Manage Admins</span>
            <span className="text-sm text-gray-500">— Add or remove HR / Procurement admins</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_MODULES.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-4 group-hover:bg-green-100">
                {module.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h2>
              <p className="text-sm text-gray-600">{module.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
