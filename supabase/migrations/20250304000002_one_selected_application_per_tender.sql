-- Ensure at most one application per tender can have status 'selected'.

CREATE UNIQUE INDEX IF NOT EXISTS idx_tender_applications_one_selected_per_tender
  ON public.tender_applications (tender_id)
  WHERE status = 'selected';
