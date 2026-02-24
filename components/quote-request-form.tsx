"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { maizeProducts, wheatProducts } from "@/lib/product-data"
import { Loader2, Plus, Trash2 } from "lucide-react"

export default function QuoteRequestForm() {
  const searchParams = useSearchParams()
  const initialProductId = searchParams.get("product")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; quantity: number }>>(
    initialProductId ? [{ id: initialProductId, quantity: 1 }] : [{ id: "", quantity: 1 }],
  )

  const allProducts = [...maizeProducts, ...wheatProducts]

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { id: "", quantity: 1 }])
  }

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...selectedProducts]
    newProducts.splice(index, 1)
    setSelectedProducts(newProducts)
  }

  const handleProductChange = (index: number, id: string) => {
    const newProducts = [...selectedProducts]
    newProducts[index].id = id
    setSelectedProducts(newProducts)
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const newProducts = [...selectedProducts]
    newProducts[index].quantity = quantity
    setSelectedProducts(newProducts)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Quote Request Submitted!</h2>
        <p className="text-gray-700 mb-6">
          Thank you for your interest in ARDA Seeds products. Our team will review your request and get back to you with
          a detailed quotation within 24-48 business hours.
        </p>
        <Button
          onClick={() => {
            setIsSuccess(false)
            setSelectedProducts([{ id: "", quantity: 1 }])
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
            <Input id="fullName" required />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" required />
          </div>
          <div>
            <Label htmlFor="company">Company/Farm Name</Label>
            <Input id="company" />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Textarea id="address" required />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Product Information</h2>

        {selectedProducts.map((product, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
            <div className="md:col-span-8">
              <Label htmlFor={`product-${index}`}>Select Product *</Label>
              <Select value={product.id} onValueChange={(value) => handleProductChange(index, value)} required>
                <SelectTrigger id={`product-${index}`}>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-product-placeholder">Select a product</SelectItem>

                  <SelectItem value="maize-category" disabled className="font-semibold">
                    Maize Seeds
                  </SelectItem>
                  {maizeProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.shortDescription.substring(0, 30)}...
                    </SelectItem>
                  ))}

                  <SelectItem value="wheat-category" disabled className="font-semibold">
                    Wheat Seeds
                  </SelectItem>
                  {wheatProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.shortDescription.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Label htmlFor={`quantity-${index}`}>Quantity (kg) *</Label>
              <Input
                id={`quantity-${index}`}
                type="number"
                min="1"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(index, Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="md:col-span-1">
              {selectedProducts.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveProduct(index)}
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

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
            placeholder="Please include any specific requirements or questions you have about our products."
            className="h-32"
          />
        </div>
      </div>

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
