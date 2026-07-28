"use client"

import HomepagePromoBanner from "@/components/homepage-promo-banner"
import {
  getActivePromoBannerItems,
  getPromoBannerHiddenReason,
  shouldShowPromoBanner,
} from "@/lib/promo-banner"
import type { HomepagePromoBannerItem, HomepagePromoBannerSettings } from "@/lib/types"

interface PromoBannerPreviewProps {
  settings: HomepagePromoBannerSettings | null
  items: HomepagePromoBannerItem[]
}

export function PromoBannerPreview({ settings, items }: PromoBannerPreviewProps) {
  const visibleItems = getActivePromoBannerItems(items)
  const isLive = shouldShowPromoBanner(settings, items)
  const hiddenReason = getPromoBannerHiddenReason(settings, items)

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-1 mb-3">
        <p className="text-sm font-medium text-gray-900">Homepage preview</p>
        <p className="text-sm text-gray-500">
          {isLive
            ? "This matches what visitors see below the hero on the homepage."
            : hiddenReason}
        </p>
      </div>

      {isLive ? (
        <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-y border-gray-200 shadow-sm">
          <HomepagePromoBanner items={visibleItems} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-100 px-4 py-8 text-center text-sm text-gray-600">
          Banner hidden on homepage
        </div>
      )}
    </div>
  )
}
