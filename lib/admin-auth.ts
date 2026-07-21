import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { SUPER_ADMIN_ROLE } from "@/lib/admin-systems"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function requireSalesAdmin(
  request: NextRequest
): Promise<{ ok: true; userId: string; role: string } | { ok: false; res: NextResponse }> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  const token = authHeader.slice(7)
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
  })
  if (!userRes.ok) return { ok: false, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  const user = await userRes.json()
  const id = user?.id as string | undefined
  if (!id) return { ok: false, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  if (!supabaseServer) return { ok: false, res: NextResponse.json({ error: "Server not configured" }, { status: 503 }) }

  const { data: profile } = await supabaseServer.from("profiles").select("role").eq("id", id).single()
  const role = profile?.role as string | undefined
  if (role !== SUPER_ADMIN_ROLE && role !== "admin_sales") {
    return { ok: false, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }
  return { ok: true, userId: id, role }
}
