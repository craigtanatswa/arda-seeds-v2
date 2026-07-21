import { NextRequest, NextResponse } from "next/server"
import { requireSalesAdmin } from "@/lib/admin-auth"
import { supabaseServer } from "@/lib/supabaseServer"

export async function POST(request: NextRequest) {
  const auth = await requireSalesAdmin(request)
  if (!auth.ok) return auth.res
  if (!supabaseServer) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  let body: {
    orderId?: string
    mode?: "collection" | "delivery"
    collectionPointId?: string
    deliveryAddress?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { orderId, mode, collectionPointId, deliveryAddress } = body
  if (!orderId || !mode) {
    return NextResponse.json({ error: "orderId and mode are required" }, { status: 400 })
  }

  const { data: order, error } = await supabaseServer.from("orders").select("*").eq("id", orderId).single()
  if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  if (mode === "collection") {
    if (!collectionPointId) {
      return NextResponse.json({ error: "collectionPointId is required" }, { status: 400 })
    }
    const { data: point } = await supabaseServer
      .from("collection_points")
      .select("*")
      .eq("id", collectionPointId)
      .eq("is_active", true)
      .single()
    if (!point) {
      return NextResponse.json({ error: "Collection point not found or inactive" }, { status: 400 })
    }

    const { error: updateError } = await supabaseServer
      .from("orders")
      .update({
        fulfillment_type: "collection",
        collection_point_id: point.id,
        collection_point_name: point.name,
        collection_city: point.city,
        collection_address: point.address,
        delivery_address: null,
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
    return NextResponse.json({ success: true, status: "processing" })
  }

  if (!deliveryAddress?.trim()) {
    return NextResponse.json({ error: "deliveryAddress is required" }, { status: 400 })
  }

  const { error: updateError } = await supabaseServer
    .from("orders")
    .update({
      fulfillment_type: "delivery",
      delivery_address: deliveryAddress.trim(),
      status: "out_for_delivery",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  return NextResponse.json({ success: true, status: "out_for_delivery" })
}
