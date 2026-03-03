"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

const BUCKET = "career-applications"

const EDUCATION_LEVELS = [
  { value: "Secondary", label: "Secondary" },
  { value: "Tertiary", label: "Tertiary" },
] as const

const SECONDARY_QUALIFICATIONS = [
  "O-Level",
  "A-Level",
]

const TERTIARY_QUALIFICATIONS = [
  "Diploma",
  "Degree",
  "Honours Degree",
  "Masters",
  "PhD",
  "Professional Certification",
]

const DEGREE_CLASSES = [
  { value: "1", label: "1" },
  { value: "2.1", label: "2.1" },
  { value: "2.2", label: "2.2" },
  { value: "3", label: "3" },
]

const GENDERS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
]

export interface CareerApplicationFormProps {
  vacancyId: string
  positionAppliedFor: string
  referenceNumber: string | null
}

interface EducationEntry {
  education_level: string
  qualification_type: string
  qualification_name: string
  degree_class: string
  institution_name: string
  field_of_study: string
  year_completed: string
}

interface ExperienceEntry {
  employer: string
  position_held: string
  duration_from: string
  duration_to: string
  responsibilities: string
}

export default function CareerApplicationForm({
  vacancyId,
  positionAppliedFor,
  referenceNumber,
}: CareerApplicationFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [physicalAddress, setPhysicalAddress] = useState("")
  const [city, setCity] = useState("")
  const [whyHire, setWhyHire] = useState("")
  const [expectedSalary, setExpectedSalary] = useState("")
  const [willingToRelocate, setWillingToRelocate] = useState<boolean | null>(null)
  const [declarationAccepted, setDeclarationAccepted] = useState(false)

  const [education, setEducation] = useState<EducationEntry[]>([
    { education_level: "", qualification_type: "", qualification_name: "", degree_class: "", institution_name: "", field_of_study: "", year_completed: "" },
  ])
  const [experience, setExperience] = useState<ExperienceEntry[]>([
    { employer: "", position_held: "", duration_from: "", duration_to: "", responsibilities: "" },
  ])

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [academicFiles, setAcademicFiles] = useState<File[]>([])
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white"

  const addEducation = useCallback(() => {
    setEducation((prev) => [
      ...prev,
      { education_level: "", qualification_type: "", qualification_name: "", degree_class: "", institution_name: "", field_of_study: "", year_completed: "" },
    ])
  }, [])

  const removeEducation = useCallback((index: number) => {
    setEducation((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }, [])

  const updateEducation = useCallback((index: number, field: keyof EducationEntry, value: string) => {
    setEducation((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      if (field === "education_level") {
        next[index].qualification_type = ""
        next[index].qualification_name = ""
        next[index].degree_class = ""
      }
      return next
    })
  }, [])

  const qualificationOptions = (level: string) =>
    level === "Secondary" ? SECONDARY_QUALIFICATIONS : level === "Tertiary" ? TERTIARY_QUALIFICATIONS : []

  const addExperience = useCallback(() => {
    setExperience((prev) => [
      ...prev,
      { employer: "", position_held: "", duration_from: "", duration_to: "", responsibilities: "" },
    ])
  }, [])

  const removeExperience = useCallback((index: number) => {
    setExperience((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }, [])

  const updateExperience = useCallback((index: number, field: keyof ExperienceEntry, value: string) => {
    setExperience((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }, [])

  const validate = (): string | null => {
    if (!firstName?.trim()) return "First name is required."
    if (!lastName?.trim()) return "Last name is required."
    if (!nationalId?.trim()) return "National ID is required."
    if (!dateOfBirth?.trim()) return "Date of birth is required."
    if (!gender) return "Please select gender."
    if (!phone?.trim()) return "Phone number is required."
    if (!email?.trim()) return "Email is required."
    if (!physicalAddress?.trim()) return "Physical address is required."
    if (!city?.trim()) return "City is required."
    if (!cvFile) return "CV (PDF) is required."
    if (cvFile.type !== "application/pdf") return "CV must be a PDF file."
    if (!declarationAccepted) return "You must accept the declaration."
    return null
  }

  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!supabase) throw new Error("Supabase not configured")
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })
    if (error) throw error
    return path
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setErrorMessage(err)
      setStatus("error")
      return
    }
    setErrorMessage("")
    setStatus("loading")

    try {
      if (!supabase) throw new Error("Supabase not configured")
      const folder = `submissions/${Date.now()}-${Math.random().toString(36).slice(2)}`

      const cvPath = await uploadFile(cvFile!, `${folder}/cv.pdf`)

      const academicPaths: string[] = []
      for (let i = 0; i < academicFiles.length; i++) {
        const path = await uploadFile(academicFiles[i], `${folder}/academic-${i}.pdf`)
        academicPaths.push(path)
      }

      let coverLetterPath: string | null = null
      if (coverLetterFile) {
        coverLetterPath = await uploadFile(coverLetterFile, `${folder}/cover-letter.pdf`)
      }

      const { data: appData, error: appError } = await supabase
        .from("applications")
        .insert({
          vacancy_id: vacancyId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          national_id: nationalId.trim(),
          date_of_birth: dateOfBirth,
          gender,
          phone: phone.trim(),
          email: email.trim(),
          physical_address: physicalAddress.trim(),
          city: city.trim(),
          position_applied_for: positionAppliedFor,
          reference_number: referenceNumber,
          why_hire: whyHire.trim() || null,
          expected_salary: expectedSalary.trim() || null,
          willing_to_relocate: willingToRelocate === true,
          cv_path: cvPath,
          academic_certificates_paths: academicPaths.length ? academicPaths : null,
          cover_letter_path: coverLetterPath,
          declaration_accepted: true,
          status: "new",
        })
        .select("id")
        .single()

      if (appError) throw appError
      const applicationId = appData.id

      for (let i = 0; i < education.length; i++) {
        const e = education[i]
        if (!e.institution_name?.trim() && !e.qualification_type) continue
        await supabase.from("application_education").insert({
          application_id: applicationId,
          education_level: e.education_level || null,
          qualification_type: e.qualification_type || null,
          qualification_name: e.education_level === "Tertiary" ? (e.qualification_name?.trim() || null) : null,
          degree_class: e.education_level === "Tertiary" ? (e.degree_class || null) : null,
          institution_name: e.institution_name?.trim() || "",
          field_of_study: e.field_of_study?.trim() || null,
          year_completed: e.year_completed?.trim() || null,
          sort_order: i,
        })
      }

      for (let i = 0; i < experience.length; i++) {
        const ex = experience[i]
        if (!ex.employer?.trim() && !ex.position_held?.trim()) continue
        await supabase.from("application_experience").insert({
          application_id: applicationId,
          employer: ex.employer?.trim() || "",
          position_held: ex.position_held?.trim() || "",
          duration_from: ex.duration_from?.trim() || "",
          duration_to: ex.duration_to?.trim() || "",
          responsibilities: ex.responsibilities?.trim() || null,
          sort_order: i,
        })
      }

      await fetch("/api/careers/apply-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: `${firstName} ${lastName}`.trim(),
          position: positionAppliedFor,
          email: email.trim(),
          phone: phone.trim(),
        }),
      })

      setStatus("success")
    } catch (err: unknown) {
      console.error(err)
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit application. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Application Submitted</h2>
        <p className="text-gray-700 mb-6">
          Thank you for applying to ARDA Seeds. We have received your application and will be in touch.
        </p>
        <Button onClick={() => router.push("/careers")} className="bg-green-700 hover:bg-green-800">
          Back to Careers
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Personal Information */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">1. Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-700">First Name *</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <Label className="text-gray-700">Last Name *</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <Label className="text-gray-700">National ID *</Label>
            <Input value={nationalId} onChange={(e) => setNationalId(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <Label className="text-gray-700">Date of Birth *</Label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <Label className="text-gray-700">Gender *</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">Phone Number *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className={inputClass} required />
          </div>
          <div>
            <Label className="text-gray-700">Email Address *</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputClass} required />
          </div>
          <div>
            <Label className="text-gray-700">City *</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} required />
          </div>
        </div>
        <div className="mt-6">
          <Label className="text-gray-700">Physical Address *</Label>
          <Textarea
            value={physicalAddress}
            onChange={(e) => setPhysicalAddress(e.target.value)}
            className={inputClass}
            rows={3}
            required
          />
        </div>
      </div>

      {/* 2. Position Details */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">2. Position Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-700">Position Applied For</Label>
            <Input value={positionAppliedFor} className={inputClass} readOnly disabled />
          </div>
          <div>
            <Label className="text-gray-700">Reference Number</Label>
            <Input value={referenceNumber ?? ""} className={inputClass} readOnly disabled />
          </div>
        </div>
      </div>

      {/* 3. Education */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">3. Education</h2>
        {education.map((entry, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-6 mb-6 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-700">Qualification {index + 1}</span>
              {education.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(index)} className="text-red-600 border-red-200">
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Education Level</Label>
                <Select
                  value={entry.education_level}
                  onValueChange={(v) => updateEducation(index, "education_level", v)}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Qualification Type</Label>
                <Select
                  value={entry.qualification_type}
                  onValueChange={(v) => updateEducation(index, "qualification_type", v)}
                  disabled={!entry.education_level}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationOptions(entry.education_level).map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {entry.education_level === "Tertiary" && (
                <>
                  <div>
                    <Label>Qualification Name</Label>
                    <Input
                      value={entry.qualification_name}
                      onChange={(e) => updateEducation(index, "qualification_name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label>Degree Class</Label>
                    <Select
                      value={entry.degree_class}
                      onValueChange={(v) => updateEducation(index, "degree_class", v)}
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEGREE_CLASSES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <Label>Institution Name</Label>
                <Input
                  value={entry.institution_name}
                  onChange={(e) => updateEducation(index, "institution_name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={entry.field_of_study}
                  onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
                  className={`${inputClass} placeholder:text-gray-400`}
                  placeholder={
                    entry.education_level === "Secondary"
                      ? "e.g. Commercials, Sciences, Arts"
                      : entry.education_level === "Tertiary"
                        ? "e.g. Finance, Computer Science, Social Science"
                        : undefined
                  }
                />
              </div>
              <div>
                <Label>Year Completed</Label>
                <Input
                  value={entry.year_completed}
                  onChange={(e) => updateEducation(index, "year_completed", e.target.value)}
                  placeholder="e.g. 2020"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addEducation} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Another Qualification
        </Button>
      </div>

      {/* 4. Work Experience */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">4. Work Experience</h2>
        {experience.map((entry, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-6 mb-6 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-700">Experience {index + 1}</span>
              {experience.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(index)} className="text-red-600 border-red-200">
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Employer</Label>
                <Input
                  value={entry.employer}
                  onChange={(e) => updateExperience(index, "employer", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label>Position Held</Label>
                <Input
                  value={entry.position_held}
                  onChange={(e) => updateExperience(index, "position_held", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label>From</Label>
                <Input
                  value={entry.duration_from}
                  onChange={(e) => updateExperience(index, "duration_from", e.target.value)}
                  placeholder="e.g. Jan 2018"
                  className={inputClass}
                />
              </div>
              <div>
                <Label>To</Label>
                <Input
                  value={entry.duration_to}
                  onChange={(e) => updateExperience(index, "duration_to", e.target.value)}
                  placeholder="e.g. Dec 2022"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Responsibilities</Label>
                <Textarea
                  value={entry.responsibilities}
                  onChange={(e) => updateExperience(index, "responsibilities", e.target.value)}
                  className={inputClass}
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addExperience} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Another Experience
        </Button>
      </div>

      {/* 5. Documents */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">5. Documents</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700">CV (PDF only) *</Label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                className="max-w-xs"
              />
              {cvFile && <span className="text-sm text-gray-600">{cvFile.name}</span>}
            </div>
          </div>
          <div>
            <Label className="text-gray-700">Academic Certificates (optional, PDF)</Label>
            <Input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={(e) => setAcademicFiles(Array.from(e.target.files ?? []))}
              className="max-w-xs mt-2"
            />
            {academicFiles.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">{academicFiles.length} file(s) selected</p>
            )}
          </div>
          <div>
            <Label className="text-gray-700">Cover Letter (optional, PDF)</Label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setCoverLetterFile(e.target.files?.[0] ?? null)}
                className="max-w-xs"
              />
              {coverLetterFile && <span className="text-sm text-gray-600">{coverLetterFile.name}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Additional */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">6. Additional</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700">Why should we hire you?</Label>
            <Textarea value={whyHire} onChange={(e) => setWhyHire(e.target.value)} className={inputClass} rows={4} />
          </div>
          <div>
            <Label className="text-gray-700">Expected Salary (optional)</Label>
            <Input value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-gray-700">Willing to relocate?</Label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="relocate"
                  checked={willingToRelocate === true}
                  onChange={() => setWillingToRelocate(true)}
                  className="text-green-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="relocate"
                  checked={willingToRelocate === false}
                  onChange={() => setWillingToRelocate(false)}
                  className="text-green-600"
                />
                No
              </label>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="declaration"
              checked={declarationAccepted}
              onCheckedChange={(c) => setDeclarationAccepted(c === true)}
            />
            <label htmlFor="declaration" className="text-sm text-gray-700 cursor-pointer">
              I declare that the information provided is true and complete. I understand that false information may
              result in my application being rejected. *
            </label>
          </div>
        </div>
      </div>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{errorMessage}</div>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-green-700 hover:bg-green-800 text-white py-6 text-lg rounded-xl"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}
