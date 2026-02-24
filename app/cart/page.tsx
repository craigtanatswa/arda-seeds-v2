"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2, ShoppingBag, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"

type Step = "cart" | "details" | "confirmed"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const [step, setStep] = useState<Step>("cart")

  // Customer details form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function validateDetails() {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = "First name is required."
    if (!lastName.trim()) e.lastName = "Last name is required."
    if (!email.trim()) {
      e.email = "Email is required."
    } else if (!EMAIL_REGEX.test(email)) {
      e.email = "Please enter a valid email address."
    }
    if (!phone.trim()) e.phone = "Phone number is required."
    if (!address.trim()) e.address = "Address is required."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleConfirmOrder() {
    if (!validateDetails()) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          items,
          total,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Order failed.")
      }
      clearCart()
      setStep("confirmed")
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── CONFIRMED ──────────────────────────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-10">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Order Received!</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for your order, <strong>{firstName}</strong>. A confirmation has been
            sent to <strong>{email}</strong>. Our sales team will be in touch within 24
            hours to finalise your order.
          </p>
          <Button asChild className="bg-green-700 hover:bg-green-800 w-full">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  // ── EMPTY CART ──────────────────────────────────────────────────────────────
  if (items.length === 0 && step === "cart") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some seed products to get started.</p>
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  // ── CUSTOMER DETAILS ────────────────────────────────────────────────────────
  if (step === "details") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => setStep("cart")}
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Your Details</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="mb-6">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Order summary recap */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Order Summary</p>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.packSize}`}
                className="flex justify-between text-sm text-gray-600 mb-1"
              >
                <span>
                  {item.productName} ({item.packSize}) x {item.quantity}
                </span>
                <span>US$ {(item.pricePerUnit * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>US$ {total.toFixed(2)}</span>
            </div>
          </div>

          {submitError && (
            <p className="text-red-500 text-sm mb-4">{submitError}</p>
          )}

          <Button
            onClick={handleConfirmOrder}
            disabled={submitting}
            className="w-full h-12 text-base bg-green-700 hover:bg-green-800 font-semibold"
          >
            {submitting ? "Placing Order..." : "Confirm Order"}
          </Button>
        </div>
      </div>
    )
  }

  // ── CART ────────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/products"
        className="inline-flex items-center text-green-700 hover:text-green-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.packSize}`}
            className="flex items-center gap-4 p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {item.productName}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {item.category} · {item.packSize} @ US$ {item.pricePerUnit.toFixed(2)}
              </p>
            </div>

            {/* Quantity stepper */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.packSize, item.quantity - 1)
                }
                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.packSize, item.quantity + 1)
                }
                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
              >
                +
              </button>
            </div>

            <p className="font-bold text-gray-800 w-24 text-right">
              US$ {(item.pricePerUnit * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.productId, item.packSize)}
              className="text-gray-400 hover:text-red-500 transition-colors ml-1"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-700">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          US$ {total.toFixed(2)}
        </span>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 mb-6">
        * Prices are retail prices in USD per unit as per the official ARDA Seeds price
        list effective 01 August 2025. Final pricing will be confirmed by the sales team.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          variant="outline"
          className="flex-1 border-green-700 text-green-700 hover:bg-green-50"
        >
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
          </Link>
        </Button>
        <Button
          onClick={() => setStep("details")}
          className="flex-1 bg-green-700 hover:bg-green-800 font-semibold"
        >
          Place Order
        </Button>
      </div>
    </div>
  )
}
