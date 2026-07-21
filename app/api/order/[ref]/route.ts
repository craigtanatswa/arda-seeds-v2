import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { createPaynowVerifier } from "@/lib/paynow"
import { sendPaidOrderEmails } from "@/lib/order-emails"
import { isInsufficientBalanceError } from "@/lib/payment-errors"
import type { ValidatedOrderLine } from "@/lib/order-validation"

function isPaidStatus(status: string | undefined) {
  if (!status) return false
  const s = status.toLowerCase()
  return s === "paid" || s === "awaiting delivery" || s === "delivered"
}

function isFailedPaymentStatus(status: string | undefined, error?: string) {
  const s = (status ?? "").toLowerCase()
  const e = (error ?? "").toLowerCase()
  if (s === "cancelled" || s === "error") return true
  if (e.includes("insufficient")) return true
  return false
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Server not configured" }, { status: 503 })
    }

    const { ref } = await context.params
    const orderRef = decodeURIComponent(ref)

    const { data: order, error } = await supabaseServer
      .from("orders")
      .select(
        "order_ref, status, total_usd, first_name, collection_point_name, collection_city, collection_address, fulfillment_type, delivery_address, paid_at, paynow_poll_url, paynow_status, confirmation_email_sent, order_items(product_name, pack_size, quantity, unit_price, line_total)"
      )
      .eq("order_ref", orderRef)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    let paymentFailureReason: string | undefined

    // Poll Paynow if still pending and we have a poll URL
    if (order.status === "pending_payment" && order.paynow_poll_url) {
      try {
        const paynow = createPaynowVerifier()
        const status = await paynow.pollTransaction(order.paynow_poll_url)
        if (status?.status && isFailedPaymentStatus(status.status, status.error)) {
          paymentFailureReason = status.error || status.status
          await supabaseServer
            .from("orders")
            .update({
              status: "payment_failed",
              paynow_status: status.status,
              paynow_reference: status.paynowReference ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq("order_ref", orderRef)

          order.status = "payment_failed"
          order.paynow_status = status.status
        } else if (status?.status && isPaidStatus(status.status)) {
          await supabaseServer
            .from("orders")
            .update({
              status: "paid",
              paynow_status: status.status,
              paynow_reference: status.paynowReference ?? null,
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("order_ref", orderRef)

          if (!order.confirmation_email_sent) {
            const { data: full } = await supabaseServer
              .from("orders")
              .select("*, order_items(*)")
              .eq("order_ref", orderRef)
              .single()
            if (full) {
              const lines: ValidatedOrderLine[] = (full.order_items ?? []).map(
                (item: {
                  product_id: string
                  product_name: string
                  pack_size: string
                  unit_price: number
                  quantity: number
                  line_total: number
                }) => ({
                  productId: item.product_id,
                  productName: item.product_name,
                  packSize: item.pack_size,
                  unitPrice: Number(item.unit_price),
                  quantity: item.quantity,
                  lineTotal: Number(item.line_total),
                })
              )
              await sendPaidOrderEmails({
                orderRef: full.order_ref,
                firstName: full.first_name,
                lastName: full.last_name,
                email: full.email,
                phone: full.phone,
                collectionName: full.collection_point_name ?? "Collection point",
                collectionCity: full.collection_city ?? "",
                collectionAddress: full.collection_address,
                lines,
                total: Number(full.total_usd),
              })
              await supabaseServer
                .from("orders")
                .update({ confirmation_email_sent: true })
                .eq("order_ref", orderRef)
            }
          }

          order.status = "paid"
          order.paid_at = new Date().toISOString()
        }
      } catch (pollError) {
        console.error("Paynow poll error:", pollError)
      }
    }

    if (
      !paymentFailureReason &&
      order.status === "payment_failed" &&
      order.paynow_status &&
      isInsufficientBalanceError(order.paynow_status)
    ) {
      paymentFailureReason = order.paynow_status
    }

    return NextResponse.json({
      order,
      paymentFailureReason,
      insufficientBalance: paymentFailureReason
        ? isInsufficientBalanceError(paymentFailureReason)
        : false,
    })
  } catch (error) {
    console.error("Order status error:", error)
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 })
  }
}
