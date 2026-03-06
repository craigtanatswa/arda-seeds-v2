-- Add tax clearance document to tender applications.
ALTER TABLE public.tender_applications
  ADD COLUMN IF NOT EXISTS tax_clearance_document_url TEXT;
