"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderReceiptDownloadButton from "@/components/order-receipt-download-button"
import { isOrderPaid } from "@/lib/order-receipt"
import { findProduct } from "@/lib/product-data"

type OrderItemView = {
  product_id?: string
  product_name: string
  pack_size: string
  quantity: number
  unit_price: number
  line_total: number
}

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
  delivery_city?: string | null
  delivery_fee_usd?: number | null
  subtotal_usd?: number | null
  order_items?: OrderItemView[]
}

function collectionLabel(order: OrderView): string {
  return [order.collection_point_name, order.collection_address, order.collection_city]
    .filter(Boolean)
    .join(", ")
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

  const paid = isOrderPaid(order.status)
  const items = order.order_items ?? []
  const deliveryFee = Number(order.delivery_fee_usd ?? 0)
  const isDelivery = order.fulfillment_type === "delivery"

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="bg-white text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {paid ? "Payment received" : "Payment pending"}
        </h1>
        <p className="text-gray-700 mb-1">
          Thank you, {order.first_name}.
        </p>
        <p className="text-gray-700 mb-6">
          Order reference: <strong>{order.order_ref}</strong>
        </p>

        {items.length > 0 && (
          <div className="space-y-3 mb-6 text-left">
            {items.map((item, index) => {
              const image = item.product_id
                ? findProduct(item.product_id)?.image ?? "/images/maize-white.png"
                : "/images/maize-white.png"
              return (
                <div
                  key={`${item.product_name}-${item.pack_size}-${index}`}
                  className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={image}
                      alt={item.product_name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      {item.pack_size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 shrink-0">
                    US$ {Number(item.line_total).toFixed(2)}
                  </p>
                </div>
              )
            })}
            {isDelivery && deliveryFee > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                <p className="text-gray-700">Delivery</p>
                <p className="font-semibold text-gray-900">US$ {deliveryFee.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        <p className="text-gray-800 mb-2">
          Total: <strong>US$ {Number(order.total_usd).toFixed(2)}</strong>
        </p>
        {isDelivery ? (
          <p className="text-gray-800 mb-6">
            Delivery:{" "}
            <strong>{order.delivery_address || order.delivery_city || "Address on file"}</strong>
          </p>
        ) : (
          <p className="text-gray-800 mb-6">
            Collection: <strong>{collectionLabel(order)}</strong>
          </p>
        )}

        {paid ? (
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Payment confirmed. A receipt email has been sent, and you can download a copy below.
            {isDelivery
              ? " Our sales team will notify you when your order is out for delivery."
              : " Our sales team will notify you when your order is ready for collection, and we will email you progress updates on your delivery."}
          </p>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            No receipt is issued until Paynow confirms payment. If you just paid, this page may take
            a moment to update — refresh shortly or keep this tab open.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {paid && (
            <OrderReceiptDownloadButton
              orderRef={order.order_ref}
              className="w-full h-11 rounded-lg border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            />
          )}
          <Button asChild className="w-full h-11 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
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
