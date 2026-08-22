"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Circle, Clock, MapPin, PackageSearch, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  formatOrderStatusDescription,
  formatOrderStatusLabel,
  getOrderTrackStepIndex,
  getOrderTrackSteps,
} from "@/lib/order-status"

type TrackedOrder = {
  order_ref: string
  status: string
  fulfillment_type: string
  collection_point_name: string | null
  collection_city: string | null
  collection_address: string | null
  delivery_address: string | null
}

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState("")
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleTrack(event: FormEvent) {
    event.preventDefault()
    const ref = orderRef.trim()
    if (!ref) {
      setError("Please paste your order number.")
      setOrder(null)
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const res = await fetch(`/api/order/${encodeURIComponent(ref)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Order not found")
      setOrder(data.order as TrackedOrder)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We could not find this order.")
    } finally {
      setLoading(false)
    }
  }

  const steps = order ? getOrderTrackSteps(order.fulfillment_type) : []
  const currentStep = order ? getOrderTrackStepIndex(order.status) : -1
  const showTimeline = order && currentStep >= 0 && order.status !== "cancelled"

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
        <div className="flex justify-center mb-6">
          <PackageSearch className="h-14 w-14 text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Track your order</h1>
        <p className="text-gray-600 text-center mb-8">
          Paste the order number from your receipt or confirmation email to see the current stage.
        </p>

        <form onSubmit={handleTrack} className="mb-6">
          <Label htmlFor="orderRef">Order number</Label>
          <div className="mt-1 flex flex-col sm:flex-row gap-3">
            <Input
              id="orderRef"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="ORD-…"
              autoComplete="off"
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 sm:w-auto"
            >
              {loading ? "Checking…" : "Track order"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {order && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Current stage</p>
            <p className="text-xl font-bold text-gray-900 mb-2">
              {formatOrderStatusLabel(order.status)}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {formatOrderStatusDescription(order.status)}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Order number: <strong>{order.order_ref}</strong>
            </p>

            {showTimeline && (
              <ol className="mb-5 space-y-3">
                {steps.map((step, index) => {
                  const complete = index < currentStep
                  const current = index === currentStep
                  return (
                    <li key={step.id} className="flex items-center gap-3">
                      {complete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      ) : current ? (
                        <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                      )}
                      <span
                        className={
                          current
                            ? "font-semibold text-gray-900"
                            : complete
                              ? "text-gray-700"
                              : "text-gray-400"
                        }
                      >
                        {step.label}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}

            {order.status === "cancelled" && (
              <div className="flex items-center gap-2 text-sm text-red-700 mb-4">
                <XCircle className="h-5 w-5" />
                This order is no longer active.
              </div>
            )}

            {order.fulfillment_type === "delivery" && order.delivery_address ? (
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-green-700 shrink-0" />
                <span>
                  Delivery: <strong>{order.delivery_address}</strong>
                </span>
              </p>
            ) : order.collection_point_name ? (
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-green-700 shrink-0" />
                <span>
                  Collection:{" "}
                  <strong>
                    {order.collection_point_name}
                    {order.collection_city ? `, ${order.collection_city}` : ""}
                  </strong>
                </span>
              </p>
            ) : null}
          </div>
        )}

        <Button asChild variant="outline" className="w-full mt-6 border-green-700 text-green-700 hover:bg-green-50">
          <Link href="/products">Back to products</Link>
        </Button>
      </div>
    </div>
  )
}
