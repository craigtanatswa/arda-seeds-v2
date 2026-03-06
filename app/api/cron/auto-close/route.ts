import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

/**
 * Auto-close tenders and job posts (vacancies) whose closing date has passed.
 * Call this daily via Vercel Cron (vercel.json) or an external cron service.
 * Secure with CRON_SECRET in .env.local.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = request.headers.get("authorization")
    const querySecret = request.nextUrl.searchParams.get("secret")
    if (authHeader !== `Bearer ${secret}` && querySecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const supabase = supabaseServer
  if (!supabase) {
    return NextResponse.json(
      { error: "Server not configured (SUPABASE_SERVICE_ROLE_KEY required)" },
      { status: 503 }
    )
  }

  const now = new Date().toISOString()
  const today = now.slice(0, 10)

  const { data: tendersUpdated, error: tendersError } = await supabase
    .from("tenders")
    .update({ status: "closed", updated_at: now })
    .eq("status", "open")
    .lt("closing_date", now)
    .select("id")

  if (tendersError) {
    return NextResponse.json(
      { error: "Tenders update failed", detail: tendersError.message },
      { status: 500 }
    )
  }

  const { data: vacanciesUpdated, error: vacanciesError } = await supabase
    .from("vacancies")
    .update({ status: "closed", updated_at: now })
    .eq("status", "open")
    .lt("closing_date", today)
    .select("id")

  if (vacanciesError) {
    return NextResponse.json(
      { error: "Vacancies update failed", detail: vacanciesError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    tenders_closed: tendersUpdated?.length ?? 0,
    vacancies_closed: vacanciesUpdated?.length ?? 0,
  })
}
