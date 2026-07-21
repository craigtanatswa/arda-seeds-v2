import { supabaseServer } from "@/lib/supabaseServer"
import { COLLECTION_POINTS_SEED } from "@/lib/collection-points-seed"

/** Inserts default collection points when the table is empty. Safe to call repeatedly. */
export async function ensureCollectionPointsSeeded(): Promise<{ seeded: boolean; count: number }> {
  if (!supabaseServer) return { seeded: false, count: 0 }

  const { count, error: countError } = await supabaseServer
    .from("collection_points")
    .select("id", { count: "exact", head: true })

  if (countError) throw countError
  if ((count ?? 0) > 0) return { seeded: false, count: count ?? 0 }

  const rows = COLLECTION_POINTS_SEED.map((point, index) => ({
    name: point.name,
    city: point.city,
    address: point.address,
    type: point.type,
    is_active: true,
    sort_order: point.sort_order ?? index,
    source_url: point.source_url ?? null,
  }))

  const { error } = await supabaseServer.from("collection_points").insert(rows)
  if (error) throw error
  return { seeded: true, count: rows.length }
}
