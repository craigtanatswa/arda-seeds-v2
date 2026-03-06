"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { ADMIN_SYSTEMS, SUPER_ADMIN_ROLE } from "@/lib/admin-systems"
import { Loader2 } from "lucide-react"

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]

function canAccess(pathname: string, role: string | null): boolean {
  if (!role) return false
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p)) return true
  if (pathname === "/admin" || pathname === "/admin/") return role === SUPER_ADMIN_ROLE
  if (pathname.startsWith("/admin/admins")) return role === SUPER_ADMIN_ROLE
  for (const sys of ADMIN_SYSTEMS) {
    if (pathname.startsWith(sys.path)) return role === SUPER_ADMIN_ROLE || role === sys.role
  }
  return false
}

function getRedirectForRole(role: string): string {
  if (role === SUPER_ADMIN_ROLE) return "/admin"
  const sys = ADMIN_SYSTEMS.find((s) => s.role === role)
  return sys?.path ?? "/admin/login"
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading")

  useEffect(() => {
    if (!pathname?.startsWith("/admin")) {
      setStatus("allowed")
      return
    }
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p)) {
      setStatus("allowed")
      return
    }

    const check = async () => {
      if (!supabase) {
        setStatus("denied")
        return
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
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

      const role = (profile?.role as string) ?? null
      const validRoles = [SUPER_ADMIN_ROLE, ...ADMIN_SYSTEMS.map((s) => s.role)]
      if (!role || !validRoles.includes(role)) {
        router.replace("/admin/login")
        setStatus("denied")
        return
      }
      if (!canAccess(pathname, role)) {
        router.replace(getRedirectForRole(role))
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
