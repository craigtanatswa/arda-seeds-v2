"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get("reset") === "success") setResetSuccess(true)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (!supabase) throw new Error("Supabase not configured")
      const { data, error: signError } = await supabase.auth.signInWithPassword({ email, password })
      if (signError) throw signError
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()
      const role = profile?.role as string | undefined
      const allowedRoles = ["admin", "admin_hr", "admin_prcmt"]
      if (!role || !allowedRoles.includes(role)) {
        await supabase.auth.signOut()
        throw new Error(
          "Access denied. Your account does not have admin access. An administrator must set your profile role (admin, admin_hr, or admin_prcmt) in the database."
        )
      }
      if (role === "admin") router.replace("/admin")
      else if (role === "admin_hr") router.replace("/admin/hr")
      else if (role === "admin_prcmt") router.replace("/admin/procurement")
      else router.replace("/admin")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          </div>
          {resetSuccess && (
            <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              Password updated. You can sign in with your new password.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-700">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-gray-700">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 py-6 rounded-xl"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-center mt-4">
            <Link href="/admin/forgot-password" className="text-green-700 hover:text-green-800 text-sm">
              Forgot password?
            </Link>
          </p>
          <p className="text-center mt-2">
            <Link href="/" className="text-green-700 hover:text-green-800 text-sm">
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading…</div>}>
      <AdminLoginContent />
    </Suspense>
  )
}
