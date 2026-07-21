import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { ensureCollectionPointsSeeded } from "@/lib/ensure-collection-points-seed"

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Server not configured" }, { status: 503 })
    }

    await ensureCollectionPointsSeeded()

    const { data, error } = await supabaseServer
      .from("collection_points")
      .select("id, name, city, address, type, is_active, sort_order, source_url")
      .eq("is_active", true)
      .order("city")
      .order("sort_order")
      .order("name")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ points: data ?? [] })
  } catch (error) {
    console.error("Collection points error:", error)
    return NextResponse.json({ error: "Failed to load collection points" }, { status: 500 })
  }
}
