import { NextRequest, NextResponse } from "next/server"
import { requireSalesAdmin } from "@/lib/admin-auth"
import { supabaseServer } from "@/lib/supabaseServer"
import { createMailTransporter, SALES_INBOX, senderFrom } from "@/lib/mail"
import { ensureCollectionPointsSeeded } from "@/lib/ensure-collection-points-seed"
import { formatCollectionPointsHtml, formatCollectionPointsForEmail } from "@/lib/collection-points"
import type { CollectionPoint, OrderStatus } from "@/lib/types"

export type NotifyAction = "ready" | "oos_collection" | "oos_delivery"

export async function POST(request: NextRequest) {
  const auth = await requireSalesAdmin(request)
  if (!auth.ok) return auth.res
  if (!supabaseServer) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  let body: { orderId?: string; action?: NotifyAction }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { orderId, action } = body
  if (!orderId || !action || !["ready", "oos_collection", "oos_delivery"].includes(action)) {
    return NextResponse.json({ error: "orderId and valid action are required" }, { status: 400 })
  }

  const { data: order, error } = await supabaseServer.from("orders").select("*").eq("id", orderId).single()
  if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  await ensureCollectionPointsSeeded()

  const transporter = createMailTransporter()
  let newStatus: OrderStatus
  let subject: string
  let html: string
  let text: string

  if (action === "ready") {
    newStatus = "ready_for_collection"
    const location = `${order.collection_point_name}, ${order.collection_city}${
      order.collection_address ? ` — ${order.collection_address}` : ""
    }`
    subject = `Your ARDA Seeds order ${order.order_ref} is ready for collection`
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; padding: 28px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Order ready for collection</h1>
        </div>
        <div style="padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Dear ${order.first_name},</p>
          <p>Your order <strong>${order.order_ref}</strong> is ready for collection at:</p>
          <p style="font-weight: bold; color: #111827;">${location}</p>
          <p>Please bring a copy of this email or your order reference when collecting.</p>
          <p style="color: #6b7280; font-size: 13px;">Questions? Reply to this email or call 0242 704 924/5.</p>
        </div>
      </div>`
    text = `Dear ${order.first_name},\n\nYour order ${order.order_ref} is ready for collection at:\n${location}\n\nARDA Seeds`
  } else if (action === "oos_collection") {
    newStatus = "awaiting_customer_collection"
    const { data: points } = await supabaseServer
      .from("collection_points")
      .select("*")
      .eq("is_active", true)
      .order("city")
      .order("name")
    const active = (points ?? []) as CollectionPoint[]
    const listHtml = formatCollectionPointsHtml(active)
    const listText = formatCollectionPointsForEmail(active)
    subject = `Action needed — stock unavailable at your collection point (${order.order_ref})`
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <div style="background: #b45309; padding: 28px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Collection point out of stock</h1>
        </div>
        <div style="padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Dear ${order.first_name},</p>
          <p>
            Unfortunately the location you selected for order <strong>${order.order_ref}</strong>
            (<em>${order.collection_point_name}, ${order.collection_city}</em>) does not currently have stock available.
          </p>
          <p>
            Please <strong>reply to this email</strong> with the name of the closest collection point from the list below
            that works for you. We will update your order once we receive your reply.
          </p>
          <h2 style="font-size: 16px; margin-top: 24px;">Available collection points</h2>
          ${listHtml}
          <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">Reply to: ${SALES_INBOX}</p>
        </div>
      </div>`
    text = `Dear ${order.first_name},\n\nYour selected collection point for ${order.order_ref} (${order.collection_point_name}) is out of stock.\n\nPlease reply with the closest location from this list:\n\n${listText}\n\nARDA Seeds — ${SALES_INBOX}`
  } else {
    newStatus = "awaiting_customer_delivery"
    subject = `Action needed — delivery option for order ${order.order_ref}`
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #b45309; padding: 28px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Collection point out of stock — delivery available</h1>
        </div>
        <div style="padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Dear ${order.first_name},</p>
          <p>
            Unfortunately the location you selected for order <strong>${order.order_ref}</strong>
            (<em>${order.collection_point_name}, ${order.collection_city}</em>) does not currently have stock available.
          </p>
          <p>
            We can arrange <strong>delivery</strong> instead. Please <strong>reply to this email</strong> with your
            full delivery address / location so our sales team can update your order.
          </p>
          <p style="color: #6b7280; font-size: 13px;">Reply to: ${SALES_INBOX}</p>
        </div>
      </div>`
    text = `Dear ${order.first_name},\n\nYour selected collection point for ${order.order_ref} is out of stock.\n\nPlease reply with your delivery address so we can arrange delivery.\n\nARDA Seeds — ${SALES_INBOX}`
  }

  await transporter.sendMail({
    from: senderFrom(),
    to: order.email,
    replyTo: SALES_INBOX,
    subject,
    html,
    text,
  })

  const { error: updateError } = await supabaseServer
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, status: newStatus })
}
