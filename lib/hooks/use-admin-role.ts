"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

/**
 * Returns the current user's profile role, or null while loading / unauthenticated.
 * Used to conditionally render role-specific UI (e.g. the master Dashboard link).
 */
export function useAdminRole(): string | null {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      supabase!
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.role) setRole(data.role as string)
        })
    })
  }, [])

  return role
}
