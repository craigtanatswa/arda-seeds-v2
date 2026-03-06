import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { SYSTEM_ADMIN_ROLES } from "@/lib/admin-systems"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function requireSuperAdmin(request: NextRequest): Promise<{ ok: true } | { ok: false; res: NextResponse }> {
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
  const id = user?.id
  if (!id) return { ok: false, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  if (!supabaseServer) return { ok: false, res: NextResponse.json({ error: "Server not configured" }, { status: 503 }) }
  const { data: profile } = await supabaseServer.from("profiles").select("role").eq("id", id).single()
  if (profile?.role !== "admin") return { ok: false, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  return { ok: true }
}

/** PATCH: Update a system admin's role (or revoke by setting to "user"). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request)
  if (!auth.ok) return auth.res
  if (!supabaseServer) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  let body: { role?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { role } = body
  const newRole = role === "user" || role === null || role === undefined
    ? "user"
    : SYSTEM_ADMIN_ROLES.includes(role)
      ? role
      : undefined
  if (newRole === undefined && role !== undefined) {
    return NextResponse.json({ error: "role must be 'user' or one of: " + SYSTEM_ADMIN_ROLES.join(", ") }, { status: 400 })
  }
  if (newRole === undefined) {
    return NextResponse.json({ error: "role is required" }, { status: 400 })
  }

  const { data: target } = await supabaseServer.from("profiles").select("role").eq("id", id).single()
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (target.role === "admin") return NextResponse.json({ error: "Cannot change super admin role" }, { status: 403 })

  const { error } = await supabaseServer.from("profiles").update({ role: newRole }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id, role: newRole })
}
