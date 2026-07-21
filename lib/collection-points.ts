import type { CollectionPoint } from "@/lib/types"

export type CityGroup = {
  city: string
  points: CollectionPoint[]
}

export function groupCollectionPointsByCity(points: CollectionPoint[]): CityGroup[] {
  const map = new Map<string, CollectionPoint[]>()
  for (const point of points) {
    const city = point.city.trim() || "Other"
    const list = map.get(city) ?? []
    list.push(point)
    map.set(city, list)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([city, cityPoints]) => ({
      city,
      points: cityPoints.sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)
      ),
    }))
}

export function formatCollectionPointsForEmail(points: CollectionPoint[]): string {
  const groups = groupCollectionPointsByCity(points)
  return groups
    .map((group) => {
      const lines = group.points
        .map((p) => `  • ${p.name}${p.address ? ` — ${p.address}` : ""}`)
        .join("\n")
      return `${group.city}\n${lines}`
    })
    .join("\n\n")
}

export function formatCollectionPointsHtml(points: CollectionPoint[]): string {
  const groups = groupCollectionPointsByCity(points)
  return groups
    .map((group) => {
      const items = group.points
        .map(
          (p) =>
            `<li style="margin: 4px 0; color: #374151;"><strong>${escapeHtml(p.name)}</strong>${
              p.address ? ` — ${escapeHtml(p.address)}` : ""
            }</li>`
        )
        .join("")
      return `<h3 style="margin: 16px 0 8px; font-size: 15px; color: #111827;">${escapeHtml(group.city)}</h3><ul style="margin: 0; padding-left: 18px;">${items}</ul>`
    })
    .join("")
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
