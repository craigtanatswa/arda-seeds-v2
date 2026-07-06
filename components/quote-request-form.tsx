"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { formatQuoteLineSummary, totalQuantityKg } from "@/lib/pack-size"
import type { Product } from "@/lib/types"
import { Loader2, Minus, Plus, Trash2 } from "lucide-react"

const productCategories: { label: string; products: Product[] }[] = [
  { label: "Maize Seeds", products: maizeProducts },
  { label: "Wheat Seeds", products: wheatProducts },
  { label: "Soybeans", products: soybeanProducts },
  { label: "Groundnuts", products: groundnutProducts },
  { label: "Sunflower", products: sunflowerProducts },
  { label: "African Traditional Peas", products: cowpeaProducts },
  { label: "Sugarbeans", products: sugarBeanProducts },
  { label: "Sorghum", products: sorghumProducts },
]

const allProducts: Product[] = productCategories.flatMap((c) => c.products)

interface QuoteLineItem {
  productId: string
  packSize: string
  packCount: number
}

function createLineItem(productId = ""): QuoteLineItem {
  const product = allProducts.find((p) => p.id === productId)
  return {
    productId,
    packSize: product?.packSizes?.[0]?.size ?? "",
    packCount: 1,
  }
}

export default function QuoteRequestForm() {
  const searchParams = useSearchParams()
  const initialProductId = searchParams.get("product") ?? ""

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [address, setAddress] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<QuoteLineItem[]>([
    createLineItem(initialProductId),
  ])

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, createLineItem()])
  }

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...selectedProducts]
    newProducts.splice(index, 1)
    setSelectedProducts(newProducts)
  }

  const handleProductChange = (index: number, productId: string) => {
    const newProducts = [...selectedProducts]
    newProducts[index] = createLineItem(productId)
    setSelectedProducts(newProducts)
  }

  const handlePackSizeChange = (index: number, packSize: string) => {
    const newProducts = [...selectedProducts]
    newProducts[index].packSize = packSize
    setSelectedProducts(newProducts)
  }

  const handlePackCountChange = (index: number, packCount: number) => {
    const newProducts = [...selectedProducts]
    newProducts[index].packCount = Math.max(1, packCount)
    setSelectedProducts(newProducts)
  }

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPhone("")
    setCompany("")
    setAddress("")
    setMessage("")
    setSelectedProducts([createLineItem()])
    setErrorMessage("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage("")

    const validProducts = selectedProducts.filter((line) => {
      if (!line.productId || line.packCount < 1) return false
      const product = allProducts.find((p) => p.id === line.productId)
      return product?.packSizes?.some((pack) => pack.size === line.packSize)
    })

    if (!validProducts.length) {
      setErrorMessage("Please select at least one product with a valid pack size.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          company: company || undefined,
          address,
          products: validProducts.map((line) => ({
            productId: line.productId,
            packSize: line.packSize,
            packCount: line.packCount,
            totalQuantityKg: totalQuantityKg(line.packSize, line.packCount),
          })),
          message: message || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.")
      }

      setIsSuccess(true)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit quote request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Quote Request Submitted!</h2>
        <p className="text-gray-700 mb-6">
          Thank you for your interest in ARDA Seeds products. Our team will review your request and get back to you with
          a detailed quotation within 24-48 business hours. A confirmation email has been sent to your inbox.
        </p>
        <Button
          onClick={() => {
            setIsSuccess(false)
            resetForm()
          }}
          className="bg-green-700 hover:bg-green-800"
        >
          Submit Another Request
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="company">Company/Farm Name</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Product Information</h2>

        {selectedProducts.map((line, index) => {
          const product = allProducts.find((p) => p.id === line.productId)
          const packSizes = product?.packSizes ?? []
          const hasPackSizes = packSizes.length > 0

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor={`product-${index}`}>Select Product *</Label>
                  <Select
                    value={line.productId}
                    onValueChange={(value) => handleProductChange(index, value)}
                    required
                  >
                    <SelectTrigger id={`product-${index}`}>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <div key={category.label}>
                          <SelectItem value={`${category.label}-header`} disabled className="font-semibold">
                            {category.label}
                          </SelectItem>
                          {category.products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — {p.shortDescription.substring(0, 40)}
                              {p.shortDescription.length > 40 ? "…" : ""}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProducts.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveProduct(index)}
                    className="mt-6 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {line.productId && !hasPackSizes && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  Pricing for this product is not yet available online. Please contact our sales team or add a note below.
                </p>
              )}

              {hasPackSizes && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`pack-size-${index}`}>Pack Size *</Label>
                      <Select
                        value={line.packSize}
                        onValueChange={(value) => handlePackSizeChange(index, value)}
                        required
                      >
                        <SelectTrigger id={`pack-size-${index}`}>
                          <SelectValue placeholder="Select pack size" />
                        </SelectTrigger>
                        <SelectContent>
                          {packSizes.map((pack) => (
                            <SelectItem key={pack.size} value={pack.size}>
                              {pack.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`pack-count-${index}`}>Number of Packs *</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handlePackCountChange(index, line.packCount - 1)}
                          disabled={line.packCount <= 1}
                          className="shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`pack-count-${index}`}
                          type="number"
                          min="1"
                          value={line.packCount}
                          onChange={(e) =>
                            handlePackCountChange(index, Number.parseInt(e.target.value, 10) || 1)
                          }
                          required
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handlePackCountChange(index, line.packCount + 1)}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {line.packSize && line.packCount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3">
                      <p className="text-sm font-medium text-green-900">
                        Total quantity:{" "}
                        <span className="font-bold">
                          {formatQuoteLineSummary(line.packSize, line.packCount)}
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}

        <Button type="button" variant="outline" onClick={handleAddProduct} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Another Product
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>

        <div className="mb-4">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please include any specific requirements or questions you have about our products."
            className="h-32"
          />
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm text-center">{errorMessage}</p>
      )}

      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
          </>
        ) : (
          "Submit Quote Request"
        )}
      </Button>
    </form>
  )
}
