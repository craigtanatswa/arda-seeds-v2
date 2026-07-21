"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, ShoppingBag, Smartphone, CreditCard, Wallet, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCart } from "@/lib/cart-context"
import { groupCollectionPointsByCity } from "@/lib/collection-points"
import {
  formatInsufficientBalanceMessage,
  isInsufficientBalanceError,
} from "@/lib/payment-errors"
import type { CollectionPoint } from "@/lib/types"
import type { PaynowPaymentMethod, InnBucksPaymentInfo } from "@/lib/paynow"

type Step = "cart" | "details" | "awaiting_payment"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PAYMENT_OPTIONS: {
  id: PaynowPaymentMethod
  label: string
  hint: string
}[] = [
  {
    id: "ecocash",
    label: "EcoCash",
    hint: "Pay on your Econet phone — no Paynow login",
  },
  {
    id: "innbucks",
    label: "InnBucks",
    hint: "Pay in the InnBucks app using a code or QR scan",
  },
  {
    id: "card",
    label: "Card / Zimswitch",
    hint: "Visa, Mastercard or Zimswitch via Paynow",
  },
]

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, total, hydrated } = useCart()
  const [step, setStep] = useState<Step>("cart")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [collectionPointId, setCollectionPointId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaynowPaymentMethod | "">("")
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [pointsLoading, setPointsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [insufficientBalanceOpen, setInsufficientBalanceOpen] = useState(false)
  const [insufficientBalanceMessage, setInsufficientBalanceMessage] = useState("")
  const [orderRef, setOrderRef] = useState("")
  const [paymentInstructions, setPaymentInstructions] = useState("")
  const [awaitingMethod, setAwaitingMethod] = useState<PaynowPaymentMethod | "">("")
  const [awaitingTotal, setAwaitingTotal] = useState(0)
  const [innbucksInfo, setInnbucksInfo] = useState<InnBucksPaymentInfo | null>(null)

  function showInsufficientBalanceModal(
    method: PaynowPaymentMethod | "",
    amount: number,
    serverMessage?: string
  ) {
    setInsufficientBalanceMessage(
      serverMessage && isInsufficientBalanceError(serverMessage)
        ? serverMessage
        : formatInsufficientBalanceMessage(method, amount)
    )
    setInsufficientBalanceOpen(true)
  }

  useEffect(() => {
    if (step !== "details") return
    setPointsLoading(true)
    fetch("/api/collection-points")
      .then((res) => res.json())
      .then((data) => {
        setPoints((data.points ?? []) as CollectionPoint[])
      })
      .catch(() => setPoints([]))
      .finally(() => setPointsLoading(false))
  }, [step])

  useEffect(() => {
    if (step !== "awaiting_payment" || !orderRef) return
    let cancelled = false
    let attempts = 0

    const poll = async () => {
      try {
        const res = await fetch(`/api/order/${encodeURIComponent(orderRef)}`)
        const data = await res.json()
        if (cancelled) return
        const status = data.order?.status as string | undefined
        if (data.insufficientBalance) {
          showInsufficientBalanceModal(
            awaitingMethod,
            Number(data.order?.total_usd ?? awaitingTotal),
            data.paymentFailureReason as string | undefined
          )
          setStep("details")
          setSubmitting(false)
          return
        }
        if (status === "payment_failed") {
          const reason = (data.paymentFailureReason as string | undefined) || "Payment could not be completed."
          if (isInsufficientBalanceError(reason)) {
            showInsufficientBalanceModal(
              awaitingMethod,
              Number(data.order?.total_usd ?? awaitingTotal),
              reason
            )
          } else {
            setSubmitError(reason)
          }
          setStep("details")
          setSubmitting(false)
          return
        }
        if (
          status === "paid" ||
          status === "processing" ||
          status === "ready_for_collection"
        ) {
          router.replace(`/order/confirmation?ref=${encodeURIComponent(orderRef)}`)
          return
        }
      } catch {
        // keep polling
      }
      attempts += 1
      if (!cancelled && attempts < 60) {
        setTimeout(poll, 3000)
      }
    }

    const timer = setTimeout(poll, 2500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [step, orderRef, router, awaitingMethod, awaitingTotal])

  const cityGroups = useMemo(() => groupCollectionPointsByCity(points), [points])
  const cityPoints = useMemo(
    () => cityGroups.find((g) => g.city === city)?.points ?? [],
    [cityGroups, city]
  )

  function validateDetails() {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = "First name is required."
    if (!lastName.trim()) e.lastName = "Last name is required."
    if (!email.trim()) e.email = "Email is required."
    else if (!EMAIL_REGEX.test(email)) e.email = "Please enter a valid email address."
    if (!phone.trim()) e.phone = "Phone number is required."
    if (!city) e.city = "Please select a city."
    if (!collectionPointId) e.collectionPointId = "Please select a collection point."
    if (!paymentMethod) e.paymentMethod = "Please choose a payment method."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePayAndOrder() {
    if (!validateDetails() || !paymentMethod) return
    setSubmitting(true)
    setSubmitError("")
    setInsufficientBalanceOpen(false)
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          collectionPointId,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            packSize: item.packSize,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Order failed.")

      clearCart()

      if (data.mode === "express") {
        setOrderRef(data.orderRef as string)
        setAwaitingTotal(total)
        setPaymentInstructions(
          (data.instructions as string) ||
            "Approve the payment prompt on your phone to complete the order."
        )
        setInnbucksInfo((data.innbucks as InnBucksPaymentInfo | undefined) ?? null)
        setAwaitingMethod(paymentMethod)
        setStep("awaiting_payment")
        setSubmitting(false)
        return
      }

      if (!data.browserUrl) throw new Error("Payment redirect unavailable.")
      window.location.href = data.browserUrl as string
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      if (isInsufficientBalanceError(message)) {
        showInsufficientBalanceModal(paymentMethod, total, message)
      } else {
        setSubmitError(message)
      }
      setSubmitting(false)
    }
  }

  const insufficientBalanceDialog = (
    <AlertDialog open={insufficientBalanceOpen} onOpenChange={setInsufficientBalanceOpen}>
      <AlertDialogContent className="rounded-xl border border-amber-200 bg-white p-0 gap-0 max-w-md overflow-hidden">
        <AlertDialogHeader className="px-6 pt-6 pb-4 space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="space-y-2 text-left">
              <AlertDialogTitle className="text-xl font-bold text-gray-900">
                Insufficient balance
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed">
                {insufficientBalanceMessage ||
                  formatInsufficientBalanceMessage(paymentMethod, total)}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-6 py-4 bg-amber-50/60 border-t border-amber-100">
          <Button
            type="button"
            className="w-full rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold"
            onClick={() => setInsufficientBalanceOpen(false)}
          >
            Try again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center text-gray-500">
        Loading cart…
      </div>
    )
  }

  if (step === "awaiting_payment") {
    const isInnbucks = awaitingMethod === "innbucks"

    return (
      <>
        {insufficientBalanceDialog}
        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-10">
            {isInnbucks ? (
              <>
                <QrCode className="h-14 w-14 text-green-700 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-3">Complete payment in InnBucks</h1>
                <p className="text-gray-600 mb-2">
                  Order <strong>{orderRef}</strong> — US$ {awaitingTotal.toFixed(2)}
                </p>
                {innbucksInfo ? (
                  <div className="my-6 space-y-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                        Authorization code
                      </p>
                      <p className="text-2xl font-bold tracking-widest text-gray-900 break-all">
                        {innbucksInfo.authorizationCode}
                      </p>
                      {innbucksInfo.expiresAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Expires: {innbucksInfo.expiresAt}
                        </p>
                      )}
                    </div>
                    {innbucksInfo.qrCodeUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={innbucksInfo.qrCodeUrl}
                        alt="InnBucks payment QR code"
                        className="mx-auto rounded-lg border border-gray-200"
                        width={200}
                        height={200}
                      />
                    )}
                    {innbucksInfo.deepLinkUrl && (
                      <Button
                        asChild
                        className="w-full bg-green-700 hover:bg-green-800 font-semibold"
                      >
                        <a href={innbucksInfo.deepLinkUrl}>Open InnBucks app</a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 mb-6 leading-relaxed">{paymentInstructions}</p>
                )}
                <p className="text-sm text-gray-500 mb-6">
                  Scan the QR code or enter the code in the InnBucks app. This page updates
                  automatically when payment is confirmed.
                </p>
              </>
            ) : (
              <>
                <Smartphone className="h-14 w-14 text-green-700 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-3">Complete payment on your phone</h1>
                <p className="text-gray-600 mb-2">
                  EcoCash prompt sent for order <strong>{orderRef}</strong>.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">{paymentInstructions}</p>
                <p className="text-sm text-gray-500 mb-6">
                  This page updates automatically when payment is confirmed.
                </p>
              </>
            )}
            <Button
              asChild
              variant="outline"
              className="w-full border-green-700 text-green-700"
            >
              <Link href={`/order/confirmation?ref=${encodeURIComponent(orderRef)}`}>
                Check payment status
              </Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

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

  if (step === "details") {
    return (
      <>
        {insufficientBalanceDialog}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => setStep("cart")}
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Checkout</h1>
          <p className="text-sm text-gray-500 mb-6">
            Choose your collection point and payment method. EcoCash and InnBucks stay on this site
            — no Paynow login page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="phone">Mobile number (for EcoCash / InnBucks) *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="city">Collection city *</Label>
            <select
              id="city"
              value={city}
              disabled={pointsLoading}
              onChange={(e) => {
                setCity(e.target.value)
                setCollectionPointId("")
              }}
              className={`mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm ${
                errors.city ? "border-red-500" : ""
              }`}
            >
              <option value="">{pointsLoading ? "Loading cities…" : "Select a city"}</option>
              {cityGroups.map((group) => (
                <option key={group.city} value={group.city}>
                  {group.city}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div className="mb-6">
            <Label htmlFor="collectionPoint">Collection point *</Label>
            <select
              id="collectionPoint"
              value={collectionPointId}
              disabled={!city || cityPoints.length === 0}
              onChange={(e) => setCollectionPointId(e.target.value)}
              className={`mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm ${
                errors.collectionPointId ? "border-red-500" : ""
              }`}
            >
              <option value="">
                {!city ? "Select a city first" : "Select a collection point"}
              </option>
              {cityPoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                  {point.address ? ` — ${point.address}` : ""}
                </option>
              ))}
            </select>
            {errors.collectionPointId && (
              <p className="text-red-500 text-xs mt-1">{errors.collectionPointId}</p>
            )}
          </div>

          <div className="mb-6">
            <Label className="mb-2 block">Payment method *</Label>
            <div className="grid gap-3">
              {PAYMENT_OPTIONS.map((option) => {
                const selected = paymentMethod === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                      selected
                        ? "border-green-700 bg-green-50 ring-1 ring-green-700"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <span className="mt-0.5 text-green-700">
                      {option.id === "card" ? (
                        <CreditCard className="h-5 w-5" />
                      ) : option.id === "innbucks" ? (
                        <QrCode className="h-5 w-5" />
                      ) : (
                        <Smartphone className="h-5 w-5" />
                      )}
                    </span>
                    <span>
                      <span className="block font-semibold text-gray-900">{option.label}</span>
                      <span className="block text-sm text-gray-500">{option.hint}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-2">{errors.paymentMethod}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Order Summary</p>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.packSize}`}
                className="flex justify-between text-sm text-gray-600 mb-1"
              >
                <span>
                  {item.productName} ({item.packSize}) × {item.quantity}
                </span>
                <span>US$ {(item.pricePerUnit * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>US$ {total.toFixed(2)}</span>
            </div>
          </div>

          {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}

          <Button
            onClick={handlePayAndOrder}
            disabled={submitting || pointsLoading}
            className="w-full h-12 text-base bg-green-700 hover:bg-green-800 font-semibold"
          >
            {submitting
              ? paymentMethod === "card"
                ? "Opening Paynow…"
                : "Sending payment request…"
              : paymentMethod === "ecocash"
                ? "Pay with EcoCash"
                : paymentMethod === "innbucks"
                  ? "Pay with InnBucks"
                  : paymentMethod === "card"
                    ? "Pay with Card / Zimswitch"
                    : "Pay now"}
          </Button>
        </div>
        </div>
      </>
    )
  }

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
          <div key={`${item.productId}-${item.packSize}`} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
              <p className="text-sm text-gray-500 capitalize">
                {item.category} · {item.packSize} @ US$ {item.pricePerUnit.toFixed(2)}
              </p>
            </div>

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

      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-700">Total</span>
        <span className="text-2xl font-bold text-gray-900">US$ {total.toFixed(2)}</span>
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Orders are sold in catalogue pack sizes only. At checkout you choose EcoCash, InnBucks, or
        card.
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
          Checkout
        </Button>
      </div>
    </div>
  )
}
