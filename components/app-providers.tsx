"use client"

import { NotificationProvider } from "@/components/notification-provider"
import { CartProvider } from "@/lib/cart-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <CartProvider>{children}</CartProvider>
    </NotificationProvider>
  )
}
