export interface ProductPackSize {
  size: string   // e.g. "2kg", "5kg", "10kg"
  price: number  // retail price in USD
}

export interface Product {
  id: string
  name: string
  category: string
  shortDescription: string
  fullDescription: string
  maturity: string
  yieldPotential: string
  features: string[]
  regions: string[]
  image: string
  featured: boolean
  packSizes?: ProductPackSize[]
}

export interface CartItem {
  productId: string
  productName: string
  category: string
  packSize: string
  pricePerUnit: number
  quantity: number
}

export interface OrderRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  items: CartItem[]
  total: number
}

export interface QuoteRequest {
  fullName: string
  email: string
  phone: string
  company?: string
  address: string
  products: {
    productId: string
    quantity: number
  }[]
  message?: string
}

export interface GrowerRegistration {
  fullName: string
  email: string
  phone: string
  farmName: string
  farmLocation: string
  farmSize: string
  cropsGrown: string[]
  previousSupplier?: string
  message?: string
}

// Careers
export type EmploymentType = "Full-time" | "Contract" | "Seasonal"
export type VacancyStatus = "open" | "closed"
export type ApplicationStatus = "new" | "shortlisted" | "rejected"

export interface Vacancy {
  id: string
  title: string
  department: string
  location: string
  employment_type: EmploymentType
  description: string
  responsibilities: string | null
  requirements: string | null
  closing_date: string
  reference_number: string | null
  status: VacancyStatus
  created_at?: string
  updated_at?: string
}

export interface Application {
  id: string
  vacancy_id: string
  first_name: string
  last_name: string
  national_id: string
  date_of_birth: string
  gender: string
  phone: string
  email: string
  physical_address: string
  city: string
  position_applied_for: string
  reference_number: string | null
  why_hire: string | null
  expected_salary: string | null
  willing_to_relocate: boolean
  cv_path: string
  academic_certificates_paths: string[] | null
  cover_letter_path: string | null
  declaration_accepted: boolean
  status: ApplicationStatus
  created_at?: string
  updated_at?: string
}

export interface ApplicationEducation {
  id?: string
  application_id?: string
  education_level: string
  qualification_type: string
  qualification_name?: string | null
  degree_class?: string | null
  institution_name: string
  field_of_study: string
  year_completed: string
  sort_order?: number
}

export interface ApplicationExperience {
  id?: string
  application_id?: string
  employer: string
  position_held: string
  duration_from: string
  duration_to: string
  responsibilities: string
  sort_order?: number
}

// Tenders (Procurement)
export type TenderStatus = "draft" | "open" | "closed" | "shortlisted" | "awarded"
export type TenderApplicationStatus = "submitted" | "shortlisted" | "rejected" | "selected"

export interface Tender {
  id: string
  title: string
  reference_number: string
  summary: string
  description: string
  document_url: string | null
  closing_date: string
  status: TenderStatus
  created_by: string | null
  created_at?: string
  updated_at?: string
}

export interface TenderApplication {
  id: string
  tender_id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  proposal_document_url: string | null
  tax_clearance_document_url: string | null
  status: TenderApplicationStatus
  submitted_at?: string
  created_at?: string
  updated_at?: string
}
