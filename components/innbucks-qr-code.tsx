"use client"

import { useEffect, useState } from "react"
import { generateInnbucksQrDataUrl } from "@/lib/innbucks-qr"

export default function InnbucksQrCode({ authorizationCode }: { authorizationCode: string }) {
  const [src, setSrc] = useState("")

  useEffect(() => {
    let cancelled = false
    generateInnbucksQrDataUrl(authorizationCode)
      .then((url) => {
        if (!cancelled) setSrc(url)
      })
      .catch(() => {
        if (!cancelled) setSrc("")
      })
    return () => {
      cancelled = true
    }
  }, [authorizationCode])

  if (!src) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="InnBucks payment QR code"
      className="mx-auto rounded-lg border border-gray-200 bg-white p-2"
      width={200}
      height={200}
    />
  )
}
