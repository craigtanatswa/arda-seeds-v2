import { totalQuantityKg } from "@/lib/pack-size"

export type DeliverySettings = {
  id?: boolean
  origin_name: string
  origin_city: string
  base_fee_usd: number
  per_km_usd: number
  per_kg_usd: number
  minimum_fee_usd: number
  updated_at?: string
}

export type DeliveryLocation = {
  id: string
  city: string
  distance_km: number
  is_active: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export type DeliveryQuote = {
  weightKg: number
  distanceKm: number
  originName: string
  originCity: string
  city: string
  baseFee: number
  distanceFee: number
  weightFee: number
  rawFee: number
  fee: number
  minimumApplied: boolean
}

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  origin_name: "ARDA Head Office",
  origin_city: "Harare",
  base_fee_usd: 5,
  per_km_usd: 0.1,
  per_kg_usd: 0.1,
  minimum_fee_usd: 5,
}

export function parseDeliverySettings(row: Partial<DeliverySettings> | null | undefined): DeliverySettings {
  return {
    origin_name: row?.origin_name?.trim() || DEFAULT_DELIVERY_SETTINGS.origin_name,
    origin_city: row?.origin_city?.trim() || DEFAULT_DELIVERY_SETTINGS.origin_city,
    base_fee_usd: Number(row?.base_fee_usd ?? DEFAULT_DELIVERY_SETTINGS.base_fee_usd),
    per_km_usd: Number(row?.per_km_usd ?? DEFAULT_DELIVERY_SETTINGS.per_km_usd),
    per_kg_usd: Number(row?.per_kg_usd ?? DEFAULT_DELIVERY_SETTINGS.per_kg_usd),
    minimum_fee_usd: Number(row?.minimum_fee_usd ?? DEFAULT_DELIVERY_SETTINGS.minimum_fee_usd),
    updated_at: row?.updated_at,
  }
}

export function cartWeightKg(items: { packSize: string; quantity: number }[]): number {
  return Number(
    items.reduce((sum, item) => sum + totalQuantityKg(item.packSize, item.quantity), 0).toFixed(2)
  )
}

export function calculateDeliveryFee(input: {
  distanceKm: number
  weightKg: number
  city: string
  settings: DeliverySettings
}): DeliveryQuote {
  const distanceKm = Math.max(0, Number(input.distanceKm) || 0)
  const weightKg = Math.max(0, Number(input.weightKg) || 0)
  const baseFee = Number(input.settings.base_fee_usd)
  const distanceFee = Number((distanceKm * Number(input.settings.per_km_usd)).toFixed(2))
  const weightFee = Number((weightKg * Number(input.settings.per_kg_usd)).toFixed(2))
  const rawFee = Number((baseFee + distanceFee + weightFee).toFixed(2))
  const minimum = Number(input.settings.minimum_fee_usd)
  const fee = Number(Math.max(minimum, rawFee).toFixed(2))

  return {
    weightKg,
    distanceKm,
    originName: input.settings.origin_name,
    originCity: input.settings.origin_city,
    city: input.city,
    baseFee,
    distanceFee,
    weightFee,
    rawFee,
    fee,
    minimumApplied: fee > rawFee || (fee === minimum && rawFee < minimum),
  }
}

export function formatDeliveryAddress(address: string, city: string): string {
  const street = address.trim()
  const place = city.trim()
  if (!street) return place
  if (!place) return street
  const alreadyIncludesCity = street.toLowerCase().includes(place.toLowerCase())
  return alreadyIncludesCity ? street : `${street}, ${place}`
}
