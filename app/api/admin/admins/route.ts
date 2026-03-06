import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { SYSTEM_ADMIN_ROLES } from "@/lib/admin-systems"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function requireSuperAdmin(request: NextRequest): Promise<{ ok: true; userId: string } | { ok: false; res: NextResponse }> {
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
  return { ok: true, userId: id }
}

export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (!auth.ok) return auth.res
  if (!supabaseServer) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("id, role")
    .in("role", ["admin", ...SYSTEM_ADMIN_ROLES])

  if (!profiles?.length) return NextResponse.json({ admins: [] })

  const { data: users } = await supabaseServer.auth.admin.listUsers({ perPage: 1000 })
  const byId = new Map((users?.users ?? []).map((u) => [u.id, u]))
  const admins = profiles
    .filter((p) => p.role !== "admin")
    .map((p) => ({
      id: p.id,
      email: byId.get(p.id)?.email ?? null,
      role: p.role,
    }))
  return NextResponse.json({ admins })
}

export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (!auth.ok) return auth.res
  if (!supabaseServer) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  let body: { email?: string; password?: string; role?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { email, password, role } = body
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }
  if (!role || !SYSTEM_ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "role must be one of: " + SYSTEM_ADMIN_ROLES.join(", ") }, { status: 400 })
  }

  const passwordOrUndefined = typeof password === "string" && password.length >= 6 ? password : undefined
  const { data: newUser, error: createError } = await supabaseServer.auth.admin.createUser({
    email: email.trim(),
    password: passwordOrUndefined ?? undefined,
    email_confirm: true,
  })

  if (createError) {
    if (createError.message?.toLowerCase().includes("already")) {
      const { data: existing } = await supabaseServer.auth.admin.listUsers()
      const existingUser = existing?.users?.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase())
      if (existingUser) {
        const { error: updateError } = await supabaseServer.from("profiles").update({ role }).eq("id", existingUser.id)
        if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })
        return NextResponse.json({
          id: existingUser.id,
          email: existingUser.email,
          role,
          message: "User already exists; role updated.",
        })
      }
    }
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  if (!newUser?.user?.id) return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  const { error: profileError } = await supabaseServer.from("profiles").update({ role }).eq("id", newUser.user.id)
  if (profileError) {
    await supabaseServer.from("profiles").upsert({ id: newUser.user.id, role }, { onConflict: "id" })
  }
  return NextResponse.json({
    id: newUser.user.id,
    email: newUser.user.email,
    role,
  })
}
