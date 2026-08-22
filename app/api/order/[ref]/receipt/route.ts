import { NextRequest, NextResponse } from "next/server"
import {
  ensureOrderReceiptByRef,
  receiptDownloadFilename,
} from "@/lib/order-receipt-service"
import { supabaseServer } from "@/lib/supabaseServer"
import { isOrderPaid } from "@/lib/order-receipt"

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
      .select("order_ref, status")
      .eq("order_ref", orderRef)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (!isOrderPaid(order.status)) {
      return NextResponse.json(
        { error: "Receipt is available after payment is confirmed" },
        { status: 403 }
      )
    }

    const result = await ensureOrderReceiptByRef(orderRef)
    if (!result) {
      return NextResponse.json({ error: "Failed to load receipt" }, { status: 500 })
    }

    const filename = receiptDownloadFilename(result.orderRef)

    return new NextResponse(Buffer.from(result.pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Order receipt error:", error)
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 })
  }
}
