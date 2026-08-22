"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/components/notification-provider"

type Props = {
  orderRef: string
  className?: string
}

export default function OrderReceiptDownloadButton({ orderRef, className }: Props) {
  const [loading, setLoading] = useState(false)
  const { alert } = useNotification()

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/order/${encodeURIComponent(orderRef)}/receipt`)
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
        `ARDA-Receipt-${orderRef}.pdf`
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
