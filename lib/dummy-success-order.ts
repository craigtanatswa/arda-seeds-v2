import { COMPANY_ADDRESS_FULL } from "@/lib/site"
import type { OrderReceiptInput } from "@/lib/order-receipt"
import { findProduct } from "@/lib/product-data"

const product = findProduct("zs265")
const pack = product?.packSizes.find((p) => p.size === "10kg")
const UNIT_PRICE = pack?.price ?? 38.3

export const DUMMY_SUCCESS_ORDER = {
  order_ref: "Order-ZS265",
  status: "paid",
  total_usd: UNIT_PRICE,
  first_name: "Tinashe",
  collection_point_name: "ARDA Seeds Head Office",
  collection_city: "Harare",
  collection_address: COMPANY_ADDRESS_FULL,
  fulfillment_type: "collection",
  delivery_address: null,
  delivery_city: null,
  delivery_fee_usd: 0,
  subtotal_usd: UNIT_PRICE,
  order_items: [
    {
      product_id: "zs265",
      product_name: "ZS265",
      pack_size: "10kg",
      quantity: 1,
      unit_price: UNIT_PRICE,
      line_total: UNIT_PRICE,
    },
  ],
}

export const DUMMY_SUCCESS_RECEIPT: OrderReceiptInput = {
  orderRef: DUMMY_SUCCESS_ORDER.order_ref,
  firstName: DUMMY_SUCCESS_ORDER.first_name,
  lastName: "Moyo",
  email: "tinashe.moyo@example.com",
  phone: "+263 77 000 0000",
  collectionName: DUMMY_SUCCESS_ORDER.collection_point_name ?? "ARDA Seeds Head Office",
  collectionCity: DUMMY_SUCCESS_ORDER.collection_city ?? "Harare",
  collectionAddress: DUMMY_SUCCESS_ORDER.collection_address,
  fulfillmentType: DUMMY_SUCCESS_ORDER.fulfillment_type,
  deliveryAddress: DUMMY_SUCCESS_ORDER.delivery_address,
  deliveryFee: 0,
  subtotal: UNIT_PRICE,
  lines: [
    {
      productId: "zs265",
      productName: "ZS265",
      packSize: "10kg",
      unitPrice: UNIT_PRICE,
      quantity: 1,
      lineTotal: UNIT_PRICE,
    },
  ],
  total: UNIT_PRICE,
  paidAt: "2026-08-26T11:00:00.000Z",
}
