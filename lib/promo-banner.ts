import type { HomepagePromoBannerItem, HomepagePromoBannerSettings } from "@/lib/types"

export function getActivePromoBannerItems(
  items: HomepagePromoBannerItem[]
): HomepagePromoBannerItem[] {
  return items.filter((item) => item.is_active)
}

export function shouldShowPromoBanner(
  settings: HomepagePromoBannerSettings | null | undefined,
  items: HomepagePromoBannerItem[]
): boolean {
  return Boolean(settings?.is_enabled && getActivePromoBannerItems(items).length > 0)
}

export function getPromoBannerHiddenReason(
  settings: HomepagePromoBannerSettings | null | undefined,
  items: HomepagePromoBannerItem[]
): string | null {
  if (shouldShowPromoBanner(settings, items)) return null
  if (!settings?.is_enabled) return "Banner visibility is turned off — visitors will not see this strip."
  if (getActivePromoBannerItems(items).length === 0) {
    return "No active messages — activate at least one message for the banner to appear."
  }
  return "Banner will not appear on the homepage."
}

/** Fixed scroll speed in pixels per second — independent of message length or count. */
export const PROMO_BANNER_SCROLL_SPEED_PX_PER_SEC = 100
