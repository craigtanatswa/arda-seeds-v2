-- Add tax clearance document to tender applications.
ALTER TABLE public.tender_applications
  ADD COLUMN IF NOT EXISTS tax_clearance_document_url TEXT;

-- Additional mandatory/optional compliance documents
ALTER TABLE public.tender_applications
  ADD COLUMN IF NOT EXISTS certificate_of_incorporation_document_url TEXT;

ALTER TABLE public.tender_applications
  ADD COLUMN IF NOT EXISTS cr6_document_url TEXT;

ALTER TABLE public.tender_applications
  ADD COLUMN IF NOT EXISTS cr5_document_url TEXT;

ALTER TABLE public.tender_applications
  ADD COLUMN IF NOT EXISTS praz_certificate_document_url TEXT;
