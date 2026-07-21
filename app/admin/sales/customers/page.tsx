"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import type { Customer } from "@/lib/types"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { LogOut } from "lucide-react"

export default function SalesCustomersPage() {
  const router = useRouter()
  const userRole = useAdminRole()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    setLoading(true)
    let q = supabase.from("customers").select("*").order("created_at", { ascending: false })
    if (searchQuery.trim()) {
      q = q.or(
        `email.ilike.%${searchQuery.trim()}%,first_name.ilike.%${searchQuery.trim()}%,last_name.ilike.%${searchQuery.trim()}%,phone.ilike.%${searchQuery.trim()}%`
      )
    }
    q.then(({ data, error }) => {
      if (error) console.error(error)
      setCustomers((data as Customer[]) ?? [])
      setLoading(false)
    })
  }, [searchQuery])

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-green-700 font-semibold">
              ARDA Seeds
            </Link>
            {userRole === "admin" && (
              <Link href="/admin" className="text-gray-600 text-sm">
                Dashboard
              </Link>
            )}
            <Link href="/admin/sales" className="text-gray-600 text-sm">
              Orders
            </Link>
            <Link href="/admin/sales/customers" className="text-gray-900 font-medium">
              Customers
            </Link>
            <Link href="/admin/sales/collection-points" className="text-gray-600 text-sm">
              Collection points
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        <Input
          placeholder="Search customers…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm mb-6"
        />
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading…</p>
          ) : customers.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No customers yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {c.first_name} {c.last_name}
                    </td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
