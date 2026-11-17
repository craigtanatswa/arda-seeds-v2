import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { supabaseServer } from "@/lib/supabaseServer"
import { createMailTransporter, isMailConfigured, SALES_INBOX, senderFrom } from "@/lib/mail"
import { buildAdminPasswordResetEmail } from "@/lib/admin-password-reset-email"
import { buildPasswordResetUrl, getSiteUrl } from "@/lib/site-url"
import { isSystemAdminRole, SUPER_ADMIN_ROLE } from "@/lib/admin-systems"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5
const hitsByIp = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const existing = hitsByIp.get(ip)
  if (!existing || existing.resetAt <= now) {
    hitsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (existing.count >= RATE_LIMIT_MAX) return true
  existing.count += 1
  return false
}

async function findUserByEmail(email: string) {
  if (!supabaseServer) return null
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabaseServer.auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data?.users?.length) return null
    const found = data.users.find((u) => u.email?.toLowerCase() === email)
    if (found) return found
    if (data.users.length < 1000) return null
  }
  return null
}

/**
 * Send a branded admin password reset email.
 *
 * The link is built from the app's own domain and carries the recovery
 * token hash, so it does not depend on the Supabase "Site URL" setting and
 * will never fall back to localhost in production.
 *
 * Responses are deliberately generic so the endpoint cannot be used to
 * discover which email addresses belong to admins.
 */
export async function POST(request: NextRequest) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 })
  }

  const forwardedFor = request.headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many reset requests. Please try again later." },
      { status: 429 }
    )
  }

  const siteUrl = getSiteUrl(request)
  const redirectTo = `${siteUrl}/admin/reset-password`

  try {
    const user = await findUserByEmail(email)

    // Do not reveal whether the account exists or is an admin.
    if (!user) return NextResponse.json({ success: true })

    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    const role = profile?.role as string | undefined
    if (!role || (role !== SUPER_ADMIN_ROLE && !isSystemAdminRole(role))) {
      return NextResponse.json({ success: true })
    }

    const { data: linkData, error: linkError } = await supabaseServer.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    })

    if (linkError) {
      console.error("Admin reset link generation failed:", linkError.message)
      return NextResponse.json({ success: true })
    }

    const hashedToken = linkData?.properties?.hashed_token
    const actionLink = linkData?.properties?.action_link
    const resetUrl = hashedToken
      ? buildPasswordResetUrl(siteUrl, hashedToken)
      : actionLink ?? redirectTo

    if (!isMailConfigured()) {
      // Fall back to Supabase's own recovery email when SMTP is not set up,
      // so password resets keep working in every environment.
      if (supabaseUrl && anonKey) {
        const anon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
        await anon.auth.resetPasswordForEmail(email, { redirectTo })
      }
      return NextResponse.json({ success: true })
    }

    const { subject, html, text } = buildAdminPasswordResetEmail({ email, resetUrl })

    const transporter = createMailTransporter()
    await transporter.sendMail({
      from: senderFrom("ARDA Seeds Admin"),
      to: email,
      replyTo: SALES_INBOX,
      subject,
      html,
      text,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin forgot password error:", error)
    return NextResponse.json(
      { error: "Could not send the reset email. Please try again." },
      { status: 500 }
    )
  }
}
