"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

const ACHIEVEMENT_STATS = [
  { value: 16, label: "Seed Varieties" },
  { value: 1000, label: "Farmers Served" },
  { value: 20, label: "Years of Experience" },
  { value: 5, label: "Research Partnerships" },
] as const

function useCountUp(target: number, start: boolean, instant: boolean) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!start || hasAnimated.current) return
    hasAnimated.current = true

    if (instant) {
      setCount(target)
      return
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    let step = 0

    const interval = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * easeOut))

      if (step >= steps) {
        clearInterval(interval)
        setCount(target)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [start, target, instant])

  return count
}

function StatCard({
  value,
  label,
  start,
  instant,
}: {
  value: number
  label: string
  start: boolean
  instant: boolean
}) {
  const count = useCountUp(value, start, instant)
  const display = value >= 1000 ? count.toLocaleString() : String(count)

  return (
    <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100">
      <div className="text-5xl md:text-6xl font-bold text-green-700 mb-3">{display}+</div>
      <p className="text-gray-700 text-lg font-medium">{label}</p>
    </div>
  )
}

export default function AchievementStats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <div ref={ref}>
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center decorative-line">
        Our Achievements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {ACHIEVEMENT_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            start={inView}
            instant={prefersReducedMotion ?? false}
          />
        ))}
      </div>
    </div>
  )
}
