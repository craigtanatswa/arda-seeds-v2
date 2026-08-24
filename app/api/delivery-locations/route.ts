import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { ensureDeliverySeeded } from "@/lib/ensure-delivery-seed"
import { parseDeliverySettings } from "@/lib/delivery"

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Server not configured" }, { status: 503 })
    }

    await ensureDeliverySeeded()

    const [{ data: settingsRow, error: settingsError }, { data: locations, error: locationsError }] =
      await Promise.all([
        supabaseServer.from("delivery_settings").select("*").eq("id", true).maybeSingle(),
        supabaseServer
          .from("delivery_locations")
          .select("id, city, distance_km, is_active, sort_order")
          .eq("is_active", true)
          .order("city"),
      ])

    if (settingsError) {
      return NextResponse.json({ error: settingsError.message }, { status: 500 })
    }
    if (locationsError) {
      return NextResponse.json({ error: locationsError.message }, { status: 500 })
    }

    return NextResponse.json({
      settings: parseDeliverySettings(settingsRow),
      locations: locations ?? [],
    })
  } catch (error) {
    console.error("Delivery locations error:", error)
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: string }).message)
        : "Failed to load delivery locations"
    return NextResponse.json({ error: message, locations: [], settings: null }, { status: 500 })
  }
}
