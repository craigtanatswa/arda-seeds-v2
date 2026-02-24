"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { CartItem } from "@/lib/types"

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, packSize: string) => void
  updateQuantity: (productId: string, packSize: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.packSize === newItem.packSize
      )
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.packSize === newItem.packSize
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
  }, [])

  const removeItem = useCallback((productId: string, packSize: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.packSize === packSize))
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, packSize: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, packSize)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.packSize === packSize ? { ...i, quantity } : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
