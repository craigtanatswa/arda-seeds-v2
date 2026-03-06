import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { supabaseServer } from "@/lib/supabaseServer"

const BUCKET = "tender-documents"

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_\.]/g, "-").slice(0, 80) || "tender-document"
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing tender id" }, { status: 400 })

  const client = supabase ?? supabaseServer
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  const { data: tender, error } = await client
    .from("tenders")
    .select("status, document_url, title")
    .eq("id", id)
    .single()

  if (error || !tender) return NextResponse.json({ error: "Tender not found" }, { status: 404 })
  if (tender.status !== "open") return NextResponse.json({ error: "Tender not open" }, { status: 403 })
  if (!tender.document_url) return NextResponse.json({ error: "No document" }, { status: 404 })

  const signClient = supabaseServer ?? supabase
  if (!signClient) return NextResponse.json({ error: "Server not configured" }, { status: 503 })

  const { data: signed } = await signClient.storage.from(BUCKET).createSignedUrl(tender.document_url, 60)
  if (!signed?.signedUrl) return NextResponse.json({ error: "Could not generate download link" }, { status: 500 })

  const res = await fetch(signed.signedUrl)
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch document" }, { status: 502 })
  const blob = await res.arrayBuffer()
  const filename = `${safeFilename(tender.title ?? "tender")}.pdf`

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
