import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { requireSalesAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const auth = await requireSalesAdmin(request)
  if (!auth.ok) return auth.res

  let path = "/"
  try {
    const body = await request.json()
    if (typeof body?.path === "string" && body.path.startsWith("/")) {
      path = body.path
    }
  } catch {
    // Default to homepage when body is omitted.
  }

  revalidatePath(path)

  return NextResponse.json({ revalidated: true, path })
}
