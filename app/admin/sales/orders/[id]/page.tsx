"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { useNotification } from "@/components/notification-provider"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { groupCollectionPointsByCity } from "@/lib/collection-points"
import type { CollectionPoint, SalesOrder, SalesOrderItem } from "@/lib/types"
import { ArrowLeft, LogOut } from "lucide-react"

export default function SalesOrderDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const userRole = useAdminRole()
  const { alert, confirm } = useNotification()
  const [order, setOrder] = useState<SalesOrder | null>(null)
  const [items, setItems] = useState<SalesOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [newPointId, setNewPointId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const [{ data: orderData }, { data: itemData }] = await Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id),
    ])
    setOrder((orderData as SalesOrder) ?? null)
    setItems((itemData as SalesOrderItem[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  useEffect(() => {
    if (!supabase) return
    supabase
      .from("collection_points")
      .select("*")
      .eq("is_active", true)
      .order("city")
      .then(({ data }) => setPoints((data as CollectionPoint[]) ?? []))
  }, [])

  const cityGroups = useMemo(() => groupCollectionPointsByCity(points), [points])

  const getToken = async () => {
    const { data } = await supabase!.auth.getSession()
    return data.session?.access_token
  }

  const notify = async (action: "ready" | "oos_collection" | "oos_delivery") => {
    const labels = {
      ready: "Mark ready for collection and email the customer?",
      oos_collection:
        "Email the customer that this location is out of stock and ask them to choose a new collection point from the active list?",
      oos_delivery:
        "Email the customer that this location is out of stock and ask them to reply with a delivery address?",
    }
    const ok = await confirm(labels[action], { title: "Send customer email", confirmLabel: "Send email" })
    if (!ok) return
    setBusy(true)
    try {
      const token = await getToken()
      const res = await fetch("/api/admin/sales/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: id, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to notify")
      await alert("Email sent and order status updated.", "Success")
      await load()
    } catch (err: unknown) {
      await alert(err instanceof Error ? err.message : "Failed", "Error")
    } finally {
      setBusy(false)
    }
  }

  const applyCollection = async () => {
    if (!newPointId) {
      await alert("Select a collection point first.", "Missing selection")
      return
    }
    const ok = await confirm(
      "Update this order to the new collection point chosen by the customer?",
      { title: "Apply new collection point", confirmLabel: "Update order" }
    )
    if (!ok) return
    setBusy(true)
    try {
      const token = await getToken()
      const res = await fetch("/api/admin/sales/apply-fulfillment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: id, mode: "collection", collectionPointId: newPointId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      await alert("Collection point updated.", "Success")
      await load()
    } catch (err: unknown) {
      await alert(err instanceof Error ? err.message : "Failed", "Error")
    } finally {
      setBusy(false)
    }
  }

  const applyDelivery = async () => {
    if (!deliveryAddress.trim()) {
      await alert("Enter the delivery address from the customer reply.", "Missing address")
      return
    }
    const ok = await confirm("Switch this order to delivery with the address entered?", {
      title: "Apply delivery",
      confirmLabel: "Update order",
    })
    if (!ok) return
    setBusy(true)
    try {
      const token = await getToken()
      const res = await fetch("/api/admin/sales/apply-fulfillment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: id,
          mode: "delivery",
          deliveryAddress: deliveryAddress.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      await alert("Order switched to delivery.", "Success")
      await load()
    } catch (err: unknown) {
      await alert(err instanceof Error ? err.message : "Failed", "Error")
    } finally {
      setBusy(false)
    }
  }

  const markCollectedOrDelivered = async () => {
    if (!supabase || !order) return
    const next = order.fulfillment_type === "delivery" ? "delivered" : "collected"
    const { error } = await supabase
      .from("orders")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (error) await alert(error.message, "Error")
    else await load()
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading order…</div>
  }
  if (!order) {
    return <div className="p-12 text-center text-gray-500">Order not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/sales" className="inline-flex items-center text-green-700 text-sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Orders
            </Link>
            {userRole === "admin" && (
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">
                Dashboard
              </Link>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.order_ref}</h1>
          <p className="text-gray-600 mt-1">
            Status: <strong>{order.status}</strong> · US$ {Number(order.total_usd).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h2 className="font-semibold mb-2">Customer</h2>
            <p>
              {order.first_name} {order.last_name}
            </p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Fulfillment</h2>
            <p className="capitalize">{order.fulfillment_type}</p>
            {order.fulfillment_type === "collection" ? (
              <>
                <p>{order.collection_point_name}</p>
                <p className="text-gray-500">
                  {order.collection_city}
                  {order.collection_address ? ` — ${order.collection_address}` : ""}
                </p>
              </>
            ) : (
              <p>{order.delivery_address}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Items</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Product</th>
                <th className="py-2">Pack</th>
                <th className="py-2">Qty</th>
                <th className="py-2 text-right">Line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2">{item.product_name}</td>
                  <td className="py-2">{item.pack_size}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2 text-right">US$ {Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="font-semibold">Customer notifications</h2>
          <p className="text-sm text-gray-500">
            Choose one action. Out-of-stock emails ask the customer to reply; update the order only
            after you receive their reply.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              disabled={busy}
              className="bg-green-700 hover:bg-green-800"
              onClick={() => notify("ready")}
            >
              Order is ready
            </Button>
            <Button disabled={busy} variant="outline" onClick={() => notify("oos_collection")}>
              OOS — new collection location
            </Button>
            <Button disabled={busy} variant="outline" onClick={() => notify("oos_delivery")}>
              OOS — needs delivery address
            </Button>
          </div>
        </div>

        {(order.status === "awaiting_customer_collection" ||
          order.status === "awaiting_customer_delivery") && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-amber-900">Apply customer reply</h2>
            {order.status === "awaiting_customer_collection" && (
              <div className="space-y-3">
                <Label>New collection point</Label>
                <select
                  value={newPointId}
                  onChange={(e) => setNewPointId(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select from active locations</option>
                  {cityGroups.map((group) => (
                    <optgroup key={group.city} label={group.city}>
                      {group.points.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <Button disabled={busy} onClick={applyCollection} className="bg-green-700 hover:bg-green-800">
                  Apply new collection point
                </Button>
              </div>
            )}
            {order.status === "awaiting_customer_delivery" && (
              <div className="space-y-3">
                <Label htmlFor="deliveryAddress">Delivery address from customer email</Label>
                <Input
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Paste address from customer reply"
                />
                <Button disabled={busy} onClick={applyDelivery} className="bg-green-700 hover:bg-green-800">
                  Apply delivery address
                </Button>
              </div>
            )}
          </div>
        )}

        {(order.status === "ready_for_collection" || order.status === "out_for_delivery") && (
          <Button variant="outline" onClick={markCollectedOrDelivered}>
            Mark as {order.fulfillment_type === "delivery" ? "delivered" : "collected"}
          </Button>
        )}
      </main>
    </div>
  )
}
