"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"

const BUCKET = "tender-documents"
const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"

type Props = { tenderId: string; tenderTitle: string }

export default function TenderApplicationForm({ tenderId, tenderTitle }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [proposalFile, setProposalFile] = useState<File | null>(null)
  const [taxClearanceFile, setTaxClearanceFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    let proposalUrl: string | null = null
    if (proposalFile && proposalFile.type === "application/pdf") {
      const path = `proposals/${tenderId}/${Date.now()}-${proposalFile.name}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, proposalFile, { upsert: true })
      if (upErr) {
        alert(upErr.message)
        setLoading(false)
        return
      }
      proposalUrl = path
    }
    let taxClearanceUrl: string | null = null
    if (taxClearanceFile && taxClearanceFile.type === "application/pdf") {
      const path = `proposals/${tenderId}/tax-${Date.now()}-${taxClearanceFile.name}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, taxClearanceFile, { upsert: true })
      if (upErr) {
        alert(upErr.message)
        setLoading(false)
        return
      }
      taxClearanceUrl = path
    }
    const { error } = await supabase.from("tender_applications").insert({
      tender_id: tenderId,
      company_name: companyName.trim(),
      contact_person: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      proposal_document_url: proposalUrl,
      tax_clearance_document_url: taxClearanceUrl,
      status: "submitted",
    })
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push(`/tenders/${tenderId}?applied=1`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-gray-100 shadow-md p-6 md:p-8">
      <div>
        <Label>Company Name *</Label>
        <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} required />
      </div>
      <div>
        <Label>Contact Person *</Label>
        <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className={inputClass} required />
      </div>
      <div>
        <Label>Email *</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
      </div>
      <div>
        <Label>Phone *</Label>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
      </div>
      <div>
        <Label>Proposal Document (PDF) *</Label>
        <Input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setProposalFile(e.target.files?.[0] ?? null)}
          className="mt-1"
          required
        />
        {proposalFile && <p className="text-sm text-gray-500 mt-1">{proposalFile.name}</p>}
      </div>
      <div>
        <Label>Tax Clearance Document (PDF) *</Label>
        <Input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setTaxClearanceFile(e.target.files?.[0] ?? null)}
          className="mt-1"
          required
        />
        {taxClearanceFile && <p className="text-sm text-gray-500 mt-1">{taxClearanceFile.name}</p>}
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/tenders/${tenderId}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
