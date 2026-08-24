"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { LogOut } from "lucide-react"

type SalesAdminPage =
  | "orders"
  | "customers"
  | "collection-points"
  | "delivery-locations"
  | "promo-banner"

const LINKS: { href: string; label: string; page: SalesAdminPage }[] = [
  { href: "/admin/sales", label: "Orders", page: "orders" },
  { href: "/admin/sales/customers", label: "Customers", page: "customers" },
  { href: "/admin/sales/collection-points", label: "Collection points", page: "collection-points" },
  { href: "/admin/sales/delivery-locations", label: "Delivery", page: "delivery-locations" },
  { href: "/admin/sales/promo-banner", label: "Promo banner", page: "promo-banner" },
]

export function SalesAdminNav({ current }: { current: SalesAdminPage }) {
  const router = useRouter()
  const userRole = useAdminRole()

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <Link href="/" className="text-green-700 font-semibold hover:text-green-800">
            ARDA Seeds
          </Link>
          {userRole === "admin" && (
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">
              Dashboard
            </Link>
          )}
          {LINKS.map((link) => (
            <Link
              key={link.page}
              href={link.href}
              className={
                current === link.page
                  ? "text-gray-900 font-medium text-sm"
                  : "text-gray-600 hover:text-gray-900 text-sm"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 shrink-0">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </header>
  )
}
