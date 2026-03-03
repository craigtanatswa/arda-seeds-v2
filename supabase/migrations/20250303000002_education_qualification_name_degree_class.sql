-- Add qualification_name and degree_class for tertiary education
ALTER TABLE public.application_education
  ADD COLUMN IF NOT EXISTS qualification_name TEXT,
  ADD COLUMN IF NOT EXISTS degree_class TEXT;
