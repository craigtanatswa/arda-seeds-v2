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

function AdminResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const run = async () => {
      if (!supabase) return
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")
      if (tokenHash && type === "recovery") {
        const { error: err } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" })
        if (err) {
          setError("This link is invalid or has expired. Request a new reset link.")
          setReady(true)
          return
        }
        setReady(true)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
        return
      }
      setError("No valid reset session. Use the link from your email or request a new one.")
      setReady(true)
    }
    run()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    try {
      if (!supabase) throw new Error("Supabase not configured")
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      await supabase.auth.signOut()
      router.replace("/admin/login?reset=success")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update password.")
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="text-gray-500">Loading…</div>
      </div>
    )
  }

  if (error && !password) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <p className="text-red-600 mb-6">{error}</p>
            <Link href="/admin/forgot-password" className="text-green-700 hover:text-green-800 font-medium text-sm">
              Request a new reset link
            </Link>
            <p className="mt-6">
              <Link href="/admin/login" className="text-green-700 hover:text-green-800 text-sm">
                ← Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
            <p className="text-gray-500 mt-1">Choose a password you’ll use to sign in to the admin centre.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-700">New password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label className="text-gray-700">Confirm password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 py-6 rounded-xl">
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
          <p className="text-center mt-6">
            <Link href="/admin/login" className="text-green-700 hover:text-green-800 text-sm">
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading…</div>}>
      <AdminResetPasswordContent />
    </Suspense>
  )
}
