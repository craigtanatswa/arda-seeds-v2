"use client"

import { Suspense } from "react"
import OrderForm from "@/components/order-form"

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <OrderForm />
    </Suspense>
  )
}
