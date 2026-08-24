import { supabaseServer } from "@/lib/supabaseServer"
import { DELIVERY_LOCATIONS_SEED } from "@/lib/delivery-locations-seed"
import { DEFAULT_DELIVERY_SETTINGS } from "@/lib/delivery"

/** Inserts default delivery settings and cities when empty. Safe to call repeatedly. */
export async function ensureDeliverySeeded(): Promise<{ seeded: boolean; count: number }> {
  if (!supabaseServer) return { seeded: false, count: 0 }

  await supabaseServer.from("delivery_settings").upsert(
    {
      id: true,
      origin_name: DEFAULT_DELIVERY_SETTINGS.origin_name,
      origin_city: DEFAULT_DELIVERY_SETTINGS.origin_city,
      base_fee_usd: DEFAULT_DELIVERY_SETTINGS.base_fee_usd,
      per_km_usd: DEFAULT_DELIVERY_SETTINGS.per_km_usd,
      per_kg_usd: DEFAULT_DELIVERY_SETTINGS.per_kg_usd,
      minimum_fee_usd: DEFAULT_DELIVERY_SETTINGS.minimum_fee_usd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id", ignoreDuplicates: true }
  )

  const { count, error: countError } = await supabaseServer
    .from("delivery_locations")
    .select("id", { count: "exact", head: true })

  if (countError) throw countError
  if ((count ?? 0) > 0) return { seeded: false, count: count ?? 0 }

  const rows = DELIVERY_LOCATIONS_SEED.map((location, index) => ({
    city: location.city,
    distance_km: location.distance_km,
    is_active: true,
    sort_order: index,
  }))

  const { error } = await supabaseServer.from("delivery_locations").insert(rows)
  if (error) throw error
  return { seeded: true, count: rows.length }
}
