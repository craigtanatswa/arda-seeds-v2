import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { validateOrderItems } from "@/lib/order-validation"
import {
  createPaynowClient,
  normalizeZimbabwePhone,
  resolvePaynowAuthEmailForExpress,
  resolvePaynowAuthEmailForWeb,
  type PaynowPaymentMethod,
} from "@/lib/paynow"
import { ensureCollectionPointsSeeded } from "@/lib/ensure-collection-points-seed"

interface OrderBody {
  firstName: string
  lastName: string
  email: string
  phone: string
  collectionPointId: string
  paymentMethod: PaynowPaymentMethod
  items: { productId: string; packSize: string; quantity: number }[]
}

const EXPRESS_METHODS = new Set<PaynowPaymentMethod>(["ecocash", "innbucks"])

export async function POST(req: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Server not configured." }, { status: 503 })
    }

    const body: OrderBody = await req.json()
    const { firstName, lastName, email, phone, collectionPointId, items } = body
    const paymentMethod = body.paymentMethod

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "All customer fields are required." }, { status: 400 })
    }
    if (!collectionPointId) {
      return NextResponse.json({ error: "Please select a collection point." }, { status: 400 })
    }
    if (!paymentMethod || !["ecocash", "innbucks", "card"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Please choose a payment method: EcoCash, InnBucks, or Card." },
        { status: 400 }
      )
    }

    const validated = validateOrderItems(items ?? [])
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    await ensureCollectionPointsSeeded()

    const { data: point, error: pointError } = await supabaseServer
      .from("collection_points")
      .select("*")
      .eq("id", collectionPointId)
      .eq("is_active", true)
      .single()

    if (pointError || !point) {
      return NextResponse.json(
        { error: "Selected collection point is not available. Please choose another location." },
        { status: 400 }
      )
    }

    const orderRef = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const { data: customer, error: customerError } = await supabaseServer
      .from("customers")
      .upsert(
        {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("*")
      .single()

    if (customerError || !customer) {
      console.error("Customer upsert failed:", customerError)
      return NextResponse.json({ error: "Failed to save customer details." }, { status: 500 })
    }

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        order_ref: orderRef,
        customer_id: customer.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        fulfillment_type: "collection",
        collection_point_id: point.id,
        collection_point_name: point.name,
        collection_city: point.city,
        collection_address: point.address,
        total_usd: validated.total,
        status: "pending_payment",
      })
      .select("*")
      .single()

    if (orderError || !order) {
      console.error("Order insert failed:", orderError)
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 })
    }

    const { error: itemsError } = await supabaseServer.from("order_items").insert(
      validated.lines.map((line) => ({
        order_id: order.id,
        product_id: line.productId,
        product_name: line.productName,
        pack_size: line.packSize,
        unit_price: line.unitPrice,
        quantity: line.quantity,
        line_total: line.lineTotal,
      }))
    )

    if (itemsError) {
      console.error("Order items insert failed:", itemsError)
      await supabaseServer.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to save order items." }, { status: 500 })
    }

    const paynow = createPaynowClient(orderRef)
    const isExpress = EXPRESS_METHODS.has(paymentMethod)

    const authEmail = isExpress
      ? resolvePaynowAuthEmailForExpress(email)
      : resolvePaynowAuthEmailForWeb(email)

    const payment = authEmail
      ? paynow.createPayment(orderRef, authEmail)
      : paynow.createPayment(orderRef)

    for (const line of validated.lines) {
      payment.add(`${line.productName} (${line.packSize})`, line.unitPrice, line.quantity)
    }

    if (isExpress) {
      const mobilePhone = normalizeZimbabwePhone(phone)
      if (!/^07\d{8}$/.test(mobilePhone)) {
        await supabaseServer.from("orders").delete().eq("id", order.id)
        return NextResponse.json(
          {
            error:
              "Enter a valid Zimbabwe mobile number (e.g. 0771234567) for EcoCash or InnBucks.",
          },
          { status: 400 }
        )
      }

      const response = await paynow.sendMobile(payment, mobilePhone, paymentMethod)
      if (!response?.success) {
        await supabaseServer
          .from("orders")
          .update({ status: "payment_failed", updated_at: new Date().toISOString() })
          .eq("id", order.id)
        return NextResponse.json(
          {
            error:
              response?.error ||
              "Could not start payment. Check that EcoCash/InnBucks is enabled on your Paynow integration.",
          },
          { status: 502 }
        )
      }

      await supabaseServer
        .from("orders")
        .update({
          paynow_poll_url: response.pollUrl ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      const innbucksEntry = response.isInnbucks ? response.innbucks_info?.[0] : undefined

      return NextResponse.json({
        success: true,
        mode: "express",
        orderRef,
        pollUrl: response.pollUrl,
        instructions:
          response.instructions ||
          (paymentMethod === "innbucks"
            ? "Open the InnBucks app and pay using the authorization code below."
            : "Approve the EcoCash prompt on your phone to complete payment."),
        paymentMethod,
        innbucks: innbucksEntry
          ? {
              authorizationCode: innbucksEntry.authorizationcode,
              deepLinkUrl: innbucksEntry.deep_link_url,
              qrCodeUrl: innbucksEntry.qr_code,
              expiresAt: innbucksEntry.expires_at,
            }
          : undefined,
      })
    }

    const response = await paynow.send(payment)
    if (!response?.success || !response.redirectUrl) {
      await supabaseServer
        .from("orders")
        .update({ status: "payment_failed", updated_at: new Date().toISOString() })
        .eq("id", order.id)
      return NextResponse.json(
        { error: response?.error || "Could not start card payment. Please try again." },
        { status: 502 }
      )
    }

    await supabaseServer
      .from("orders")
      .update({
        paynow_poll_url: response.pollUrl ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    return NextResponse.json({
      success: true,
      mode: "redirect",
      orderRef,
      browserUrl: response.redirectUrl,
      pollUrl: response.pollUrl,
      paymentMethod: "card",
    })
  } catch (error) {
    console.error("Order submission error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to place order. Please try again."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
