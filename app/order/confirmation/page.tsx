"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderConfirmationView, { type OrderView } from "@/components/order-confirmation-view"

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

  return <OrderConfirmationView order={order} />
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
