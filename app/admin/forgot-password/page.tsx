"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (!supabase) throw new Error("Supabase not configured")
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/admin/reset-password` : ""
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })
      if (err) throw err
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600 mb-6">
              If an account exists for <strong>{email}</strong>, we’ve sent a link to set a new password. Click the
              link in that email to open the password reset page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you don’t see it, check spam. The link usually expires in about an hour.
            </p>
            <Link href="/admin/login" className="text-green-700 hover:text-green-800 font-medium text-sm">
              ← Back to login
            </Link>
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
            <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
            <p className="text-gray-500 mt-1">Enter your admin email to receive a reset link.</p>
          </div>
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
                placeholder="admin@ardaseeds.co.zw"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 py-6 rounded-xl">
              {loading ? "Sending…" : "Send reset link"}
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
