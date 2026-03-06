import { supabase } from "@/lib/supabaseClient"
import type { Tender } from "@/lib/types"

const TENDERS_TABLE = "tenders"

export async function getOpenTenders(): Promise<Tender[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(TENDERS_TABLE)
    .select("*")
    .eq("status", "open")
    .order("closing_date", { ascending: true })
  if (error) {
    console.error("getOpenTenders error:", error)
    return []
  }
  return (data ?? []) as Tender[]
}

export async function getTenderById(id: string): Promise<Tender | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from(TENDERS_TABLE)
    .select("*")
    .eq("id", id)
    .single()
  if (error || !data) return null
  return data as Tender
}
