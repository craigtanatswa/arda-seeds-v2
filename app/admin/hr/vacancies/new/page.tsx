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
import type { EmploymentType } from "@/lib/types"

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "Full-time", label: "Full-time" },
  { value: "Contract", label: "Contract" },
  { value: "Seasonal", label: "Seasonal" },
]

export default function NewVacancyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Full-time")
  const [description, setDescription] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [requirements, setRequirements] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.from("vacancies").insert({
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employment_type: employmentType,
      description: description.trim(),
      responsibilities: responsibilities.trim() || null,
      requirements: requirements.trim() || null,
      closing_date: closingDate,
      reference_number: referenceNumber.trim() || null,
      status: "open",
    })
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push("/admin/hr")
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/admin/hr" className="text-green-700 hover:text-green-800 font-medium mb-6 inline-block">
        ← Back to HR
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New vacancy</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div>
          <Label>Job title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Department *</Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <Label>Location *</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Employment type *</Label>
            <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as EmploymentType)}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Closing date *</Label>
            <Input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className={inputClass} required />
          </div>
        </div>
        <div>
          <Label>Reference number (optional)</Label>
          <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className={inputClass} />
        </div>
        <div>
          <Label>Description *</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={5} required />
        </div>
        <div>
          <Label>Responsibilities (one per line)</Label>
          <Textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} className={inputClass} rows={4} placeholder="One per line" />
        </div>
        <div>
          <Label>Requirements (one per line)</Label>
          <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className={inputClass} rows={4} placeholder="One per line" />
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
            {loading ? "Creating..." : "Create vacancy"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/hr">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
