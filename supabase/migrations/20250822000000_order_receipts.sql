-- Persist generated order receipt PDFs for admin access and re-download.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS receipt_path TEXT;

COMMENT ON COLUMN public.orders.receipt_path IS 'Storage path in order-receipts bucket for the paid-order PDF receipt';

-- Create bucket "order-receipts" (private) in Dashboard > Storage, then run these policies:

CREATE POLICY "Sales admins can read order receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-receipts'
    AND auth.role() = 'authenticated'
    AND (public.is_super_admin() OR public.is_admin_sales())
  );

CREATE POLICY "Sales admins can manage order receipts"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'order-receipts'
    AND auth.role() = 'authenticated'
    AND (public.is_super_admin() OR public.is_admin_sales())
  );
