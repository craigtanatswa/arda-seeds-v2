"use client"

import OrderConfirmationView from "@/components/order-confirmation-view"
import { DUMMY_SUCCESS_ORDER } from "@/lib/dummy-success-order"

export default function DummySuccessPage() {
  return (
    <OrderConfirmationView
      order={DUMMY_SUCCESS_ORDER}
      receiptDownloadUrl="/api/dummysuccess/receipt"
    />
  )
}
