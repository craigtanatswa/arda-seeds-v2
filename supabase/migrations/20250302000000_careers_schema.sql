-- ARDA Seeds Careers: vacancies, applications, education, experience, profiles
-- Run this in Supabase SQL Editor or via Supabase CLI.
--
-- Passwords are NOT stored here. They are managed by Supabase Authentication only.
-- The profiles table only stores role (admin/user); never add a password column here.
--
-- After running:
-- 1. Create storage bucket "career-applications" (private) in Dashboard > Storage.
-- 2. Add storage policies (see end of file).
-- 3. Create an admin user and set their password:
--    a) Go to Authentication > Users in Supabase Dashboard.
--    b) Click "Add user" > "Create new user".
--    c) Enter Email and Password (this is the password you use at /admin/login).
--    d) Copy the user's UUID from the Users table.
--    e) In SQL Editor run:
--       INSERT INTO public.profiles (id, role) VALUES ('<paste-uuid-here>', 'admin')
--       ON CONFLICT (id) DO UPDATE SET role = 'admin';
--    Then sign in at yoursite.com/admin/login with that email and password.

-- Employment type enum for consistency
CREATE TYPE employment_type_enum AS ENUM ('Full-time', 'Contract', 'Seasonal');

-- Vacancy status
CREATE TYPE vacancy_status_enum AS ENUM ('open', 'closed');

-- Application status
CREATE TYPE application_status_enum AS ENUM ('new', 'shortlisted', 'rejected');

-- Profiles: links auth.users to role (for admin access)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vacancies
CREATE TABLE IF NOT EXISTS public.vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type employment_type_enum NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  closing_date DATE NOT NULL,
  reference_number TEXT,
  status vacancy_status_enum NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id UUID NOT NULL REFERENCES public.vacancies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  city TEXT NOT NULL,
  position_applied_for TEXT NOT NULL,
  reference_number TEXT,
  why_hire TEXT,
  expected_salary TEXT,
  willing_to_relocate BOOLEAN NOT NULL DEFAULT false,
  cv_path TEXT NOT NULL,
  academic_certificates_paths TEXT[] DEFAULT '{}',
  cover_letter_path TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT false,
  status application_status_enum NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Education (per application)
CREATE TABLE IF NOT EXISTS public.application_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  education_level TEXT NOT NULL,
  qualification_type TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  field_of_study TEXT,
  year_completed TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Experience (per application)
CREATE TABLE IF NOT EXISTS public.application_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  employer TEXT NOT NULL,
  position_held TEXT NOT NULL,
  duration_from TEXT NOT NULL,
  duration_to TEXT NOT NULL,
  responsibilities TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON public.vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_closing_date ON public.vacancies(closing_date);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy_id ON public.applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_application_education_application_id ON public.application_education(application_id);
CREATE INDEX IF NOT EXISTS idx_application_experience_application_id ON public.application_experience(application_id);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_experience ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own row; admins can read/update all
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Allow insert profile on signup (so first login can set role via dashboard or trigger)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Vacancies: public read open only; admin full access
CREATE POLICY "Public can read open vacancies"
  ON public.vacancies FOR SELECT
  USING (status = 'open');

CREATE POLICY "Admins can do everything on vacancies"
  ON public.vacancies FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Applications: anyone can insert; admins can read/update
CREATE POLICY "Anyone can insert applications"
  ON public.applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all applications"
  ON public.applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Education: anyone can insert; admins can read
CREATE POLICY "Anyone can insert education"
  ON public.application_education FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read education"
  ON public.application_education FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Experience: anyone can insert; admins can read
CREATE POLICY "Anyone can insert experience"
  ON public.application_experience FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read experience"
  ON public.application_experience FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Trigger: create profile on signup (optional – or add admin manually)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage: Create bucket "career-applications" (private) in Dashboard > Storage first, then run these:
CREATE POLICY "Allow anon uploads to career-applications"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'career-applications');

CREATE POLICY "Admins can read career-applications"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'career-applications'
    AND auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
