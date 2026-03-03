"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import type { Vacancy, EmploymentType } from "@/lib/types"

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "Full-time", label: "Full-time" },
  { value: "Contract", label: "Contract" },
  { value: "Seasonal", label: "Seasonal" },
]

export default function EditVacancyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Full-time")
  const [description, setDescription] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [requirements, setRequirements] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [status, setStatus] = useState<"open" | "closed">("open")

  useEffect(() => {
    if (!supabase || !id) return
    supabase
      .from("vacancies")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setFetching(false)
          return
        }
        const v = data as Vacancy
        setTitle(v.title)
        setDepartment(v.department)
        setLocation(v.location)
        setEmploymentType(v.employment_type)
        setDescription(v.description)
        setResponsibilities(v.responsibilities ?? "")
        setRequirements(v.requirements ?? "")
        setClosingDate(v.closing_date)
        setReferenceNumber(v.reference_number ?? "")
        setStatus(v.status)
        setFetching(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !id) return
    setLoading(true)
    const { error } = await supabase
      .from("vacancies")
      .update({
        title: title.trim(),
        department: department.trim(),
        location: location.trim(),
        employment_type: employmentType,
        description: description.trim(),
        responsibilities: responsibilities.trim() || null,
        requirements: requirements.trim() || null,
        closing_date: closingDate,
        reference_number: referenceNumber.trim() || null,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  if (fetching) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/admin" className="text-green-700 hover:text-green-800 font-medium mb-6 inline-block">
        ← Back to admin
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit vacancy</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Reference number (optional)</Label>
            <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "open" | "closed")}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            {loading ? "Saving..." : "Save changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
