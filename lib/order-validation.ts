import {
  maizeProducts,
  wheatProducts,
  soybeanProducts,
  groundnutProducts,
  sunflowerProducts,
  cowpeaProducts,
  sugarBeanProducts,
  sorghumProducts,
} from "@/lib/product-data"
import type { CartItem, Product } from "@/lib/types"

const allProducts: Product[] = [
  ...maizeProducts,
  ...wheatProducts,
  ...soybeanProducts,
  ...groundnutProducts,
  ...sunflowerProducts,
  ...cowpeaProducts,
  ...sugarBeanProducts,
  ...sorghumProducts,
]

export type ValidatedOrderLine = {
  productId: string
  productName: string
  packSize: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export function validateOrderItems(
  items: { productId: string; packSize: string; quantity: number }[]
): { ok: true; lines: ValidatedOrderLine[]; total: number } | { ok: false; error: string } {
  if (!items?.length) return { ok: false, error: "At least one item is required." }

  const lines: ValidatedOrderLine[] = []
  for (const item of items) {
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, error: "Quantity must be a whole number of packs (minimum 1)." }
    }
    const product = allProducts.find((p) => p.id === item.productId)
    if (!product?.packSizes?.length) {
      return { ok: false, error: `Product not available for online order: ${item.productId}` }
    }
    const pack = product.packSizes.find((p) => p.size === item.packSize)
    if (!pack) {
      return {
        ok: false,
        error: `Invalid pack size "${item.packSize}" for ${product.name}. Choose a catalogue pack size.`,
      }
    }
    lines.push({
      productId: product.id,
      productName: product.name,
      packSize: pack.size,
      unitPrice: pack.price,
      quantity,
      lineTotal: Number((pack.price * quantity).toFixed(2)),
    })
  }

  const total = Number(lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2))
  return { ok: true, lines, total }
}

export function toCartItems(lines: ValidatedOrderLine[]): CartItem[] {
  return lines.map((line) => ({
    productId: line.productId,
    productName: line.productName,
    category: allProducts.find((p) => p.id === line.productId)?.category ?? "",
    packSize: line.packSize,
    pricePerUnit: line.unitPrice,
    quantity: line.quantity,
  }))
}
