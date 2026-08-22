import { NextRequest, NextResponse } from "next/server"
import { requireSalesAdmin } from "@/lib/admin-auth"
import { supabaseServer } from "@/lib/supabaseServer"
import {
  ensureOrderReceipt,
  receiptDownloadFilename,
} from "@/lib/order-receipt-service"
import { isOrderPaid } from "@/lib/order-receipt"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSalesAdmin(request)
  if (!auth.ok) return auth.res

  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Server not configured" }, { status: 503 })
    }

    const { id } = await context.params

    const { data: order, error } = await supabaseServer
      .from("orders")
      .select("order_ref, status")
      .eq("id", id)
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

    const pdfBytes = await ensureOrderReceipt(id)
    if (!pdfBytes) {
      return NextResponse.json({ error: "Failed to load receipt" }, { status: 500 })
    }

    const filename = receiptDownloadFilename(order.order_ref)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Admin order receipt error:", error)
    return NextResponse.json({ error: "Failed to load receipt" }, { status: 500 })
  }
}
