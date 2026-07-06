"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/components/notification-provider"
import { Download } from "lucide-react"

type Props = {
  tenderId: string
  children?: React.ReactNode
  variant?: "outline" | "default" | "secondary" | "ghost" | "link" | "destructive"
  className?: string
}

export default function TenderDocumentDownloadButton({
  tenderId,
  children,
  variant = "outline",
  className,
}: Props) {
  const [loading, setLoading] = useState(false)
  const { alert } = useNotification()

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tenders/${tenderId}/document`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        await alert(err?.error ?? "Download failed", "Error")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = res.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/)?.[1] ?? "tender-document.pdf"
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
      variant={variant}
      className={className}
      onClick={handleDownload}
      disabled={loading}
    >
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Downloading..." : (children ?? "Download")}
    </Button>
  )
}
