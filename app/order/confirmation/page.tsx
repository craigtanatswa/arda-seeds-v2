"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type OrderView = {
  order_ref: string
  status: string
  total_usd: number
  first_name: string
  collection_point_name: string | null
  collection_city: string | null
  collection_address: string | null
  fulfillment_type: string
  delivery_address: string | null
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")
  const [order, setOrder] = useState<OrderView | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ref) {
      setError("Missing order reference.")
      setLoading(false)
      return
    }

    let cancelled = false
    let attempts = 0

    const load = async () => {
      try {
        const res = await fetch(`/api/order/${encodeURIComponent(ref)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Order not found")
        if (cancelled) return
        setOrder(data.order)
        setLoading(false)

        if (data.order?.status === "pending_payment" && attempts < 8) {
          attempts += 1
          setTimeout(load, 2500)
        }
      } catch (err: unknown) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load order")
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [ref])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center text-gray-500">
        Checking payment status…
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">Order not found</h1>
        <p className="text-gray-600 mb-6">{error || "We could not find this order."}</p>
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const paid =
    order.status === "paid" ||
    order.status === "processing" ||
    order.status === "ready_for_collection" ||
    order.status === "awaiting_customer_collection" ||
    order.status === "awaiting_customer_delivery" ||
    order.status === "out_for_delivery" ||
    order.status === "collected" ||
    order.status === "delivered"

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-10">
        <div className="flex justify-center mb-6">
          {paid ? (
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          ) : (
            <Clock className="h-16 w-16 text-amber-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-3">
          {paid ? "Payment received" : "Payment pending"}
        </h1>
        <p className="text-gray-600 mb-2">
          Thank you, <strong>{order.first_name}</strong>.
        </p>
        <p className="text-gray-600 mb-4">
          Order reference: <strong>{order.order_ref}</strong>
        </p>
        <p className="text-gray-600 mb-2">
          Total: <strong>US$ {Number(order.total_usd).toFixed(2)}</strong>
        </p>
        {order.fulfillment_type === "collection" && (
          <p className="text-gray-600 mb-6">
            Collection:{" "}
            <strong>
              {order.collection_point_name}
              {order.collection_city ? `, ${order.collection_city}` : ""}
            </strong>
          </p>
        )}
        {paid ? (
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent. Our sales team will notify you when your order is
            ready for collection.
          </p>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            If you completed payment on Paynow, this page may take a moment to update. You can also
            check your email for confirmation.
          </p>
        )}
        <Button asChild className="bg-green-700 hover:bg-green-800 w-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 max-w-lg text-center text-gray-500">
          Loading…
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
