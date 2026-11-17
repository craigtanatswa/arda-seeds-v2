import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { MIN_ADMIN_PASSWORD_LENGTH, SYSTEM_ADMIN_ROLES } from "@/lib/admin-systems"

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

/**
 * PATCH: Update a system admin.
 * - `{ role }` changes access (use "user" to revoke).
 * - `{ password }` sets a new login password for that admin.
 * Both can be supplied together.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin(request)
  if (!auth.ok) return auth.res
  if (!supabaseServer) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  let body: { role?: string | null; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const hasRole = Object.prototype.hasOwnProperty.call(body, "role") && body.role !== undefined
  const hasPassword = typeof body.password === "string" && body.password.length > 0

  if (!hasRole && !hasPassword) {
    return NextResponse.json({ error: "Supply a role and/or a password" }, { status: 400 })
  }
  if (hasPassword && body.password!.length < MIN_ADMIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    )
  }

  const { role } = body
  let newRole: string | undefined
  if (hasRole) {
    newRole =
      role === "user" || role === null || role === undefined
        ? "user"
        : SYSTEM_ADMIN_ROLES.includes(role)
          ? role
          : undefined
    if (newRole === undefined) {
      return NextResponse.json(
        { error: "role must be 'user' or one of: " + SYSTEM_ADMIN_ROLES.join(", ") },
        { status: 400 }
      )
    }
  }

  const { data: target } = await supabaseServer.from("profiles").select("role").eq("id", id).single()
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (target.role === "admin") {
    return NextResponse.json({ error: "Cannot change a super admin's role or password" }, { status: 403 })
  }

  if (hasPassword) {
    const { error: passwordError } = await supabaseServer.auth.admin.updateUserById(id, {
      password: body.password,
    })
    if (passwordError) return NextResponse.json({ error: passwordError.message }, { status: 400 })
  }

  if (newRole !== undefined) {
    const { error } = await supabaseServer.from("profiles").update({ role: newRole }).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    id,
    role: newRole ?? target.role,
    passwordUpdated: hasPassword,
  })
}
