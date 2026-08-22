import { supabaseServer } from "@/lib/supabaseServer"
import { generateOrderReceiptPdf } from "@/lib/order-receipt-pdf"
import { isOrderPaid, type OrderReceiptInput } from "@/lib/order-receipt"
import type { ValidatedOrderLine } from "@/lib/order-validation"

export const ORDER_RECEIPTS_BUCKET = "order-receipts"

type OrderWithItems = {
  id: string
  order_ref: string
  status: string
  total_usd: number
  first_name: string
  last_name: string
  email: string
  phone: string
  collection_point_name: string | null
  collection_city: string | null
  collection_address: string | null
  fulfillment_type: string | null
  delivery_address: string | null
  paid_at: string | null
  receipt_path: string | null
  order_items?: Array<{
    product_id: string
    product_name: string
    pack_size: string
    unit_price: number
    quantity: number
    line_total: number
  }>
}

function toReceiptInput(order: OrderWithItems): OrderReceiptInput {
  const lines: ValidatedOrderLine[] = (order.order_items ?? []).map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    packSize: item.pack_size,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
    lineTotal: Number(item.line_total),
  }))

  return {
    orderRef: order.order_ref,
    firstName: order.first_name,
    lastName: order.last_name,
    email: order.email,
    phone: order.phone,
    collectionName: order.collection_point_name ?? "Collection point",
    collectionCity: order.collection_city ?? "",
    collectionAddress: order.collection_address,
    fulfillmentType: order.fulfillment_type ?? "collection",
    deliveryAddress: order.delivery_address,
    lines,
    total: Number(order.total_usd),
    paidAt: order.paid_at,
  }
}

function receiptStoragePath(orderId: string): string {
  return `${orderId}/receipt.pdf`
}

async function downloadStoredReceipt(path: string): Promise<Uint8Array | null> {
  if (!supabaseServer) return null
  const { data, error } = await supabaseServer.storage.from(ORDER_RECEIPTS_BUCKET).download(path)
  if (error || !data) return null
  return new Uint8Array(await data.arrayBuffer())
}

async function uploadReceipt(orderId: string, pdfBytes: Uint8Array): Promise<string | null> {
  if (!supabaseServer) return null
  const path = receiptStoragePath(orderId)
  const { error } = await supabaseServer.storage.from(ORDER_RECEIPTS_BUCKET).upload(path, pdfBytes, {
    contentType: "application/pdf",
    upsert: true,
  })
  if (error) {
    console.error("Failed to upload order receipt:", error)
    return null
  }
  await supabaseServer.from("orders").update({ receipt_path: path }).eq("id", orderId)
  return path
}

export async function ensureOrderReceipt(orderId: string): Promise<Uint8Array | null> {
  if (!supabaseServer) return null

  const { data: order, error } = await supabaseServer
    .from("orders")
    .select(
      "id, order_ref, status, total_usd, first_name, last_name, email, phone, collection_point_name, collection_city, collection_address, fulfillment_type, delivery_address, paid_at, receipt_path, order_items(product_id, product_name, pack_size, quantity, unit_price, line_total)"
    )
    .eq("id", orderId)
    .single()

  if (error || !order || !isOrderPaid(order.status)) return null

  if (order.receipt_path) {
    const stored = await downloadStoredReceipt(order.receipt_path)
    if (stored) return stored
  }

  const pdfBytes = await generateOrderReceiptPdf(toReceiptInput(order as OrderWithItems))
  await uploadReceipt(order.id, pdfBytes)
  return pdfBytes
}

export async function ensureOrderReceiptByRef(
  orderRef: string
): Promise<{ pdfBytes: Uint8Array; orderRef: string } | null> {
  if (!supabaseServer) return null

  const { data: order, error } = await supabaseServer
    .from("orders")
    .select("id")
    .eq("order_ref", orderRef)
    .single()

  if (error || !order) return null

  const pdfBytes = await ensureOrderReceipt(order.id)
  if (!pdfBytes) return null

  return { pdfBytes, orderRef }
}

export async function saveOrderReceiptOnPayment(orderId: string): Promise<void> {
  try {
    await ensureOrderReceipt(orderId)
  } catch (error) {
    console.error("Failed to save order receipt on payment:", error)
  }
}

export function receiptDownloadFilename(orderRef: string): string {
  const safe = orderRef.replace(/[^a-zA-Z0-9-_]/g, "-")
  return `ARDA-Receipt-${safe}.pdf`
}
