/** Parse pack size label (e.g. "5kg", "25kg") to weight in kg. */
export function packSizeToKg(packSize: string): number {
  const match = packSize.trim().match(/^([\d.]+)\s*kg$/i)
  return match ? parseFloat(match[1]) : 0
}

export function totalQuantityKg(packSize: string, packCount: number): number {
  return packSizeToKg(packSize) * packCount
}

export function formatQuoteLineSummary(packSize: string, packCount: number): string {
  const total = totalQuantityKg(packSize, packCount)
  const packLabel = packCount === 1 ? "pack" : "packs"
  return `${total} kg (${packCount} × ${packSize} ${packLabel})`
}
