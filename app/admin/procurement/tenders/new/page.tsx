"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import type { TenderStatus } from "@/lib/types"

const BUCKET = "tender-documents"
const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"

const STATUS_OPTIONS: { value: TenderStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
]

export default function NewTenderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [status, setStatus] = useState<TenderStatus>("draft")
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    let documentUrl: string | null = null
    if (documentFile && documentFile.type === "application/pdf") {
      const path = `tenders/${Date.now()}-${documentFile.name}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, documentFile, { upsert: true })
      if (upErr) {
        alert(upErr.message)
        setLoading(false)
        return
      }
      documentUrl = path
    }
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from("tenders").insert({
      title: title.trim(),
      reference_number: referenceNumber.trim(),
      summary: summary.trim(),
      description: description.trim(),
      document_url: documentUrl,
      closing_date: closingDate,
      status,
      created_by: user?.id ?? null,
    })
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push("/admin/procurement")
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/admin/procurement" className="text-green-700 hover:text-green-800 font-medium mb-6 inline-block">
        ← Back to Tenders
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Tender</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div>
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <Label>Reference Number *</Label>
          <Input
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g. NCB48 2025"
            className={inputClass}
            required
          />
        </div>
        <div>
          <Label>Summary (short description for listing) *</Label>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} rows={3} required />
        </div>
        <div>
          <Label>Full Description *</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={6} required />
        </div>
        <div>
          <Label>Tender Document (PDF)</Label>
          <Input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
          {documentFile && <p className="text-sm text-gray-500 mt-1">{documentFile.name}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Closing Date *</Label>
            <Input type="datetime-local" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TenderStatus)}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
            {loading ? "Creating..." : "Create Tender"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/procurement">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
