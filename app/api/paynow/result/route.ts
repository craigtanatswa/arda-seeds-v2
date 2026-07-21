import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { createPaynowVerifier } from "@/lib/paynow"
import { sendPaidOrderEmails } from "@/lib/order-emails"
import type { ValidatedOrderLine } from "@/lib/order-validation"

function parsePaynowBody(raw: string): Record<string, string> {
  const params = new URLSearchParams(raw)
  const values: Record<string, string> = {}
  params.forEach((value, key) => {
    values[key] = value
  })
  return values
}

function isPaidStatus(status: string | undefined) {
  if (!status) return false
  const s = status.toLowerCase()
  return s === "paid" || s === "awaiting delivery" || s === "delivered"
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseServer) {
      return new NextResponse("Server not configured", { status: 503 })
    }

    const raw = await req.text()
    const values = parsePaynowBody(raw)
    const paynow = createPaynowVerifier()

    if (!paynow.verifyHash(values)) {
      console.error("Paynow result hash mismatch", values)
      return new NextResponse("Invalid hash", { status: 400 })
    }

    const reference = values.reference || values.Reference
    const status = values.status || values.Status
    const paynowReference = values.paynowreference || values.paynowReference || values.PaynowReference
    const pollUrl = values.pollurl || values.pollUrl

    if (!reference) {
      return new NextResponse("Missing reference", { status: 400 })
    }

    const { data: order, error } = await supabaseServer
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_ref", reference)
      .single()

    if (error || !order) {
      console.error("Order not found for Paynow result:", reference, error)
      return new NextResponse("Order not found", { status: 404 })
    }

    const paid = isPaidStatus(status)

    await supabaseServer
      .from("orders")
      .update({
        paynow_status: status ?? null,
        paynow_reference: paynowReference ?? order.paynow_reference,
        paynow_poll_url: pollUrl ?? order.paynow_poll_url,
        status: paid
          ? order.status === "pending_payment" || order.status === "payment_failed"
            ? "paid"
            : order.status
          : status?.toLowerCase() === "cancelled"
            ? "cancelled"
            : order.status,
        paid_at: paid ? order.paid_at ?? new Date().toISOString() : order.paid_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    if (paid && !order.confirmation_email_sent) {
      const lines: ValidatedOrderLine[] = (order.order_items ?? []).map(
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

      try {
        await sendPaidOrderEmails({
          orderRef: order.order_ref,
          firstName: order.first_name,
          lastName: order.last_name,
          email: order.email,
          phone: order.phone,
          collectionName: order.collection_point_name ?? "Collection point",
          collectionCity: order.collection_city ?? "",
          collectionAddress: order.collection_address,
          lines,
          total: Number(order.total_usd),
        })
        await supabaseServer
          .from("orders")
          .update({ confirmation_email_sent: true, updated_at: new Date().toISOString() })
          .eq("id", order.id)
      } catch (emailError) {
        console.error("Failed to send paid order emails:", emailError)
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Paynow result error:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
