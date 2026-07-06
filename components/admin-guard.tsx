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
  const [status, setStatus] = useState<"loading" | "allowed" | "redirecting" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!pathname?.startsWith("/admin")) {
      setStatus("allowed")
      return
    }
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p)) {
      setStatus("allowed")
      return
    }

    if (!supabase) {
      setErrorMessage("Admin access is unavailable. Supabase is not configured.")
      setStatus("error")
      return
    }

    let cancelled = false

    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return

      if (!user) {
        setStatus("redirecting")
        router.replace("/admin/login")
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
      if (cancelled) return

      const role = (profile?.role as string) ?? null
      const validRoles = [SUPER_ADMIN_ROLE, ...ADMIN_SYSTEMS.map((s) => s.role)]
      if (error || !role || !validRoles.includes(role)) {
        setStatus("redirecting")
        router.replace("/admin/login")
        return
      }
      if (!canAccess(pathname, role)) {
        setStatus("redirecting")
        router.replace(getRedirectForRole(role))
        return
      }
      setStatus("allowed")
    }

    check()

    return () => {
      cancelled = true
    }
  }, [pathname, router])

  if (status === "allowed") {
    return <>{children}</>
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-red-600 text-center">{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-green-700" />
    </div>
  )
}
