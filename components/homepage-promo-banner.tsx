"use client"

import { forwardRef, Fragment, useLayoutEffect, useRef, useState } from "react"
import { PROMO_BANNER_SCROLL_SPEED_PX_PER_SEC } from "@/lib/promo-banner"
import type { HomepagePromoBannerItem } from "@/lib/types"
import "./homepage-promo-banner.css"

interface HomepagePromoBannerProps {
  items: HomepagePromoBannerItem[]
}

/** 40 repeats covers ultra-wide viewports with no empty gaps. */
const MARQUEE_REPEAT_COUNT = 40

function PromoMessageSequence({ texts, idPrefix }: { texts: string[]; idPrefix: string }) {
  return (
    <>
      {texts.map((text, index) => (
        <Fragment key={`${idPrefix}-msg-${index}`}>
          {index > 0 && (
            <span className="homepage-promo-separator" aria-hidden="true">
              •
            </span>
          )}
          <span>{text}</span>
        </Fragment>
      ))}
      <span className="homepage-promo-separator" aria-hidden="true">
        •
      </span>
    </>
  )
}

const PromoMarqueeHalf = forwardRef<
  HTMLSpanElement,
  {
    texts: string[]
    halfId: string
    ariaHidden?: boolean
  }
>(function PromoMarqueeHalf({ texts, halfId, ariaHidden }, ref) {
  return (
    <span
      ref={ref}
      className="inline-flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {Array.from({ length: MARQUEE_REPEAT_COUNT }).map((_, index) => (
        <span key={`${halfId}-${index}`} className="inline-flex shrink-0 items-center">
          <PromoMessageSequence texts={texts} idPrefix={`${halfId}-${index}`} />
        </span>
      ))}
    </span>
  )
})

export default function HomepagePromoBanner({ items }: HomepagePromoBannerProps) {
  const texts = items.map((item) => item.text.trim()).filter(Boolean)
  const halfRef = useRef<HTMLSpanElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useLayoutEffect(() => {
    const half = halfRef.current
    const track = trackRef.current
    if (!half || !track || texts.length === 0) return

    const updateSpeed = () => {
      const halfWidth = half.offsetWidth
      if (halfWidth <= 0) return

      const durationSec = halfWidth / PROMO_BANNER_SCROLL_SPEED_PX_PER_SEC
      track.style.setProperty("--marquee-shift", `${halfWidth}px`)
      track.style.setProperty("--marquee-duration", `${durationSec}s`)
      setIsReady(true)
    }

    updateSpeed()

    const observer = new ResizeObserver(updateSpeed)
    observer.observe(half)

    return () => observer.disconnect()
  }, [texts])

  if (texts.length === 0) return null

  return (
    <div
      className="homepage-promo-banner relative w-full overflow-hidden bg-green-700 text-white"
      role="region"
      aria-label="Promotional announcements"
    >
      <div
        ref={trackRef}
        className={`homepage-promo-banner-track flex w-max whitespace-nowrap py-3 text-sm font-semibold tracking-wide md:text-base [word-spacing:0.4em]${isReady ? " is-ready" : ""}`}
      >
        <PromoMarqueeHalf ref={halfRef} texts={texts} halfId="a" />
        <PromoMarqueeHalf texts={texts} halfId="b" ariaHidden />
      </div>
    </div>
  )
}
