"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import type { SalesOrder } from "@/lib/types"
import { ClearFiltersButton } from "@/components/admin/clear-filters-button"
import { LogOut, ShoppingCart, Users, MapPin, Eye } from "lucide-react"
import { useAdminRole } from "@/lib/hooks/use-admin-role"

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  awaiting_customer_collection: "Awaiting new collection",
  awaiting_customer_delivery: "Awaiting delivery address",
  ready_for_collection: "Ready for collection",
  out_for_delivery: "Out for delivery",
  collected: "Collected",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment failed",
}

export default function SalesDashboardPage() {
  const router = useRouter()
  const userRole = useAdminRole()
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({ total: 0, paid: 0, ready: 0, awaiting: 0 })

  useEffect(() => {
    if (!supabase) return
    setLoading(true)
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false })
    if (statusFilter !== "all") q = q.eq("status", statusFilter)
    if (searchQuery.trim()) q = q.or(
      `order_ref.ilike.%${searchQuery.trim()}%,email.ilike.%${searchQuery.trim()}%,last_name.ilike.%${searchQuery.trim()}%`
    )
    q.then(({ data, error }) => {
      if (error) console.error(error)
      setOrders((data as SalesOrder[]) ?? [])
      setLoading(false)
    })
  }, [statusFilter, searchQuery])

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "ready_for_collection"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["awaiting_customer_collection", "awaiting_customer_delivery"]),
    ]).then(([total, paid, ready, awaiting]) => {
      setStats({
        total: total.count ?? 0,
        paid: paid.count ?? 0,
        ready: ready.count ?? 0,
        awaiting: awaiting.count ?? 0,
      })
    })
  }, [])

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
            <Link href="/admin/sales" className="text-gray-900 font-medium">
              Orders
            </Link>
            <Link href="/admin/sales/customers" className="text-gray-600 hover:text-gray-900 text-sm">
              Customers
            </Link>
            <Link
              href="/admin/sales/collection-points"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Collection points
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
              <ShoppingCart className="h-4 w-4" /> Total orders
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-500 text-sm font-medium mb-1">Paid</p>
            <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-500 text-sm font-medium mb-1">Ready</p>
            <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-500 text-sm font-medium mb-1">Awaiting customer</p>
            <p className="text-2xl font-bold text-gray-900">{stats.awaiting}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            placeholder="Search ref, email, name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ClearFiltersButton
            visible={statusFilter !== "all" || !!searchQuery.trim()}
            onClick={() => {
              setStatusFilter("all")
              setSearchQuery("")
            }}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-gray-500 text-center">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-gray-500 text-center">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Collection</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{order.order_ref}</td>
                      <td className="px-4 py-3">
                        {order.first_name} {order.last_name}
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {order.fulfillment_type === "delivery"
                          ? "Delivery"
                          : order.collection_point_name}
                        <div className="text-xs text-gray-500">{order.collection_city}</div>
                      </td>
                      <td className="px-4 py-3">US$ {Number(order.total_usd).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <Link href={`/admin/sales/orders/${order.id}`}>
                            <Eye className="h-3.5 w-3.5" /> View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3 text-sm text-gray-500">
          <Link href="/admin/sales/customers" className="inline-flex items-center gap-1 hover:text-green-700">
            <Users className="h-4 w-4" /> Customers
          </Link>
          <Link
            href="/admin/sales/collection-points"
            className="inline-flex items-center gap-1 hover:text-green-700"
          >
            <MapPin className="h-4 w-4" /> Collection points
          </Link>
        </div>
      </main>
    </div>
  )
}
