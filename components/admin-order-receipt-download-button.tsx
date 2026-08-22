"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/components/notification-provider"
import { supabase } from "@/lib/supabaseClient"

type Props = {
  orderId: string
  className?: string
}

export default function AdminOrderReceiptDownloadButton({ orderId, className }: Props) {
  const [loading, setLoading] = useState(false)
  const { alert } = useNotification()

  const handleDownload = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        await alert("Please sign in again.", "Session expired")
        return
      }

      const res = await fetch(`/api/admin/sales/orders/${orderId}/receipt`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        await alert(err?.error ?? "Download failed", "Error")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download =
        res.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/)?.[1] ??
        "order-receipt.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      await alert("Download failed", "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleDownload}
      disabled={loading}
    >
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Downloading…" : "Download receipt"}
    </Button>
  )
}
