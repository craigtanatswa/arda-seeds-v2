"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading")

  useEffect(() => {
    if (!pathname?.startsWith("/admin")) {
      setStatus("allowed")
      return
    }
    const publicAdminPaths = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]
    if (publicAdminPaths.some((p) => pathname === p)) {
      setStatus("allowed")
      return
    }

    const check = async () => {
      if (!supabase) {
        setStatus("denied")
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace("/admin/login")
        setStatus("denied")
        return
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
      if (profile?.role !== "admin") {
        router.replace("/admin/login")
        setStatus("denied")
        return
      }
      setStatus("allowed")
    }

    check()
  }, [pathname, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
      </div>
    )
  }

  if (status === "denied") {
    return null
  }

  return <>{children}</>
}
