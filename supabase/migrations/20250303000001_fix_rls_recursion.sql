-- Fix: infinite recursion in RLS policies on public.profiles
-- The admin-check policies were querying public.profiles from within a public.profiles policy,
-- causing infinite recursion. This patch:
--   1. Creates a SECURITY DEFINER function is_admin() that checks role without triggering RLS.
--   2. Drops all old policies that used the recursive inline subquery.
--   3. Re-creates every policy using is_admin().
-- Run this in Supabase SQL Editor.

-- Step 1: Security-definer helper (runs as function owner, bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 2: Drop old (recursive) policies
DROP POLICY IF EXISTS "Users can read own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles"     ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"   ON public.profiles;

DROP POLICY IF EXISTS "Public can read open vacancies"           ON public.vacancies;
DROP POLICY IF EXISTS "Admins can do everything on vacancies"    ON public.vacancies;

DROP POLICY IF EXISTS "Anyone can insert applications"   ON public.applications;
DROP POLICY IF EXISTS "Admins can read all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications"   ON public.applications;

DROP POLICY IF EXISTS "Anyone can insert education"  ON public.application_education;
DROP POLICY IF EXISTS "Admins can read education"    ON public.application_education;

DROP POLICY IF EXISTS "Anyone can insert experience" ON public.application_experience;
DROP POLICY IF EXISTS "Admins can read experience"   ON public.application_experience;

DROP POLICY IF EXISTS "Allow anon uploads to career-applications"  ON storage.objects;
DROP POLICY IF EXISTS "Admins can read career-applications"        ON storage.objects;

-- Step 3: Re-create policies using is_admin()

-- profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- vacancies
CREATE POLICY "Public can read open vacancies"
  ON public.vacancies FOR SELECT
  USING (status = 'open');

CREATE POLICY "Admins can do everything on vacancies"
  ON public.vacancies FOR ALL
  USING (public.is_admin());

-- applications
CREATE POLICY "Anyone can insert applications"
  ON public.applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all applications"
  ON public.applications FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (public.is_admin());

-- application_education
CREATE POLICY "Anyone can insert education"
  ON public.application_education FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read education"
  ON public.application_education FOR SELECT
  USING (public.is_admin());

-- application_experience
CREATE POLICY "Anyone can insert experience"
  ON public.application_experience FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read experience"
  ON public.application_experience FOR SELECT
  USING (public.is_admin());

-- storage
CREATE POLICY "Allow anon uploads to career-applications"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'career-applications');

CREATE POLICY "Admins can read career-applications"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'career-applications'
    AND auth.role() = 'authenticated'
    AND public.is_admin()
  );
