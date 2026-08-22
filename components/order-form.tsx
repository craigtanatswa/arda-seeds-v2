"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
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
import type { Product } from "@/lib/types"

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

export default function OrderForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem } = useCart()

  const productId = searchParams.get("product") ?? ""
  const product = allProducts.find((p) => p.id === productId)

  const [selectedSize, setSelectedSize] = useState<string>(
    product?.packSizes?.[0]?.size ?? ""
  )
  const [quantity, setQuantity] = useState<number>(1)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const packSizes = product.packSizes ?? []
  const selectedPack = packSizes.find((p) => p.size === selectedSize)
  const lineTotal = selectedPack ? selectedPack.price * quantity : 0
  const categoryLabel =
    product.category.charAt(0).toUpperCase() + product.category.slice(1)

  function handleAddToCart() {
    if (!selectedPack) return
    addItem({
      productId: product!.id,
      productName: product!.name,
      category: product!.category,
      packSize: selectedSize,
      pricePerUnit: selectedPack.price,
      quantity,
    })
    router.push("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back */}
      <Link
        href={`/products/${product.category}`}
        className="inline-flex items-center text-green-700 hover:text-green-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to {categoryLabel}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product summary */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="relative h-56">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              {product.featured && (
                <Badge className="bg-green-700">Featured</Badge>
              )}
            </div>
            <p className="text-sm text-green-700 font-medium mb-3 capitalize">
              {categoryLabel}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {product.shortDescription}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">Maturity</p>
                <p className="text-sm font-medium">{product.maturity}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">Yield Potential</p>
                <p className="text-sm font-medium">{product.yieldPotential}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Order Seed</h2>

          {packSizes.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Pricing information for this product is not yet available. Please{" "}
              <Link href="/contact" className="text-green-700 underline">
                contact our sales team
              </Link>{" "}
              for a quote.
            </p>
          ) : (
            <>
              {/* Unit size */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {packSizes.map((pack) => (
                    <button
                      key={pack.size}
                      onClick={() => setSelectedSize(pack.size)}
                      className={`border-2 rounded-lg p-3 text-left transition-colors ${
                        selectedSize === pack.size
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200 hover:border-green-400"
                      }`}
                    >
                      <p className="font-semibold text-gray-800">{pack.size}</p>
                      <p className="text-green-700 font-bold">
                        US$ {pack.price.toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of units */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Units
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (!isNaN(val) && val >= 1) setQuantity(val)
                    }}
                    className="w-20 text-center border border-gray-300 rounded-lg h-10 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Line total */}
              {selectedPack && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      {quantity} x {selectedSize} @ US$ {selectedPack.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-lg">
                    <span>Subtotal</span>
                    <span>US$ {lineTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-auto">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedPack}
                  className="w-full h-12 text-base font-semibold bg-green-700 hover:bg-green-800"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  <Link href="/contact">Contact Sales Team</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
