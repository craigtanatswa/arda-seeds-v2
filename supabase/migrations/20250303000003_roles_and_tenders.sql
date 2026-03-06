-- Role structure: admin (Super Admin), admin_hr (HR/Careers), admin_prcmt (Procurement)
-- Refactor: existing is_admin() = super admin. Add is_admin_hr(), is_admin_prcmt().
-- Tenders + tender_applications tables and RLS.

-- ========== ROLE HELPERS (SECURITY DEFINER) ==========
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_admin_hr()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin_hr');
$$;

CREATE OR REPLACE FUNCTION public.is_admin_prcmt()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin_prcmt');
$$;

-- Keep is_admin() as "super admin" for backward compatibility in policies that grant full access to super only
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT public.is_super_admin();
$$;

-- ========== CAREERS: HR or Super Admin ==========
-- Drop existing careers policies and re-create with (is_super_admin() OR is_admin_hr())

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Admins can read all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can read education" ON public.application_education;
DROP POLICY IF EXISTS "Admins can read experience" ON public.application_experience;
DROP POLICY IF EXISTS "Admins can read career-applications" ON storage.objects;

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE USING (public.is_super_admin());

CREATE POLICY "Admins can do everything on vacancies"
  ON public.vacancies FOR ALL
  USING (public.is_super_admin() OR public.is_admin_hr());

CREATE POLICY "Admins can read all applications"
  ON public.applications FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_hr());

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (public.is_super_admin() OR public.is_admin_hr());

CREATE POLICY "Admins can read education"
  ON public.application_education FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_hr());

CREATE POLICY "Admins can read experience"
  ON public.application_experience FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_hr());

CREATE POLICY "Admins can read career-applications"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'career-applications'
    AND auth.role() = 'authenticated'
    AND (public.is_super_admin() OR public.is_admin_hr())
  );

-- ========== TENDERS ==========
CREATE TYPE tender_status_enum AS ENUM ('draft', 'open', 'closed', 'shortlisted', 'awarded');
CREATE TYPE tender_application_status_enum AS ENUM ('submitted', 'shortlisted', 'rejected', 'selected');

CREATE TABLE IF NOT EXISTS public.tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reference_number TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  closing_date TIMESTAMPTZ NOT NULL,
  status tender_status_enum NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tender_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  proposal_document_url TEXT,
  status tender_application_status_enum NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenders_status ON public.tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_closing_date ON public.tenders(closing_date);
CREATE INDEX IF NOT EXISTS idx_tender_applications_tender_id ON public.tender_applications(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_applications_status ON public.tender_applications(status);

ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_applications ENABLE ROW LEVEL SECURITY;

-- Tenders: public read open only; procurement + super full access
CREATE POLICY "Public can read open tenders"
  ON public.tenders FOR SELECT
  USING (status = 'open');

CREATE POLICY "Procurement and super admin full access tenders"
  ON public.tenders FOR ALL
  USING (public.is_super_admin() OR public.is_admin_prcmt());

-- Tender applications: anyone can insert; procurement + super read/update
CREATE POLICY "Anyone can submit tender application"
  ON public.tender_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Procurement and super can read tender applications"
  ON public.tender_applications FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_prcmt());

CREATE POLICY "Procurement and super can update tender applications"
  ON public.tender_applications FOR UPDATE
  USING (public.is_super_admin() OR public.is_admin_prcmt());

-- ========== STORAGE: tender documents ==========
-- Create bucket "tender-documents" (private) in Dashboard > Storage, then run these policies:

CREATE POLICY "Procurement and super can manage tender-documents"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'tender-documents'
    AND auth.role() = 'authenticated'
    AND (public.is_super_admin() OR public.is_admin_prcmt())
  );

CREATE POLICY "Allow anon upload to tender-documents for proposals"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'tender-documents');

CREATE POLICY "Procurement and super can read tender-documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'tender-documents'
    AND auth.role() = 'authenticated'
    AND (public.is_super_admin() OR public.is_admin_prcmt())
  );
