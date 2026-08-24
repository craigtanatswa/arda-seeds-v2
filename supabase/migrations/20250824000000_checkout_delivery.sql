-- Checkout delivery: fees based on order weight and distance from Head Office,
-- plus admin-managed delivery cities (same pattern as collection points).

CREATE TABLE IF NOT EXISTS public.delivery_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
  origin_name TEXT NOT NULL DEFAULT 'ARDA Head Office',
  origin_city TEXT NOT NULL DEFAULT 'Harare',
  base_fee_usd NUMERIC(12, 2) NOT NULL DEFAULT 5.00,
  per_km_usd NUMERIC(12, 4) NOT NULL DEFAULT 0.10,
  per_kg_usd NUMERIC(12, 4) NOT NULL DEFAULT 0.10,
  minimum_fee_usd NUMERIC(12, 2) NOT NULL DEFAULT 5.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.delivery_settings (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.delivery_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  distance_km NUMERIC(10, 1) NOT NULL CHECK (distance_km >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT delivery_locations_city_unique UNIQUE (city)
);

CREATE INDEX IF NOT EXISTS delivery_locations_active_idx ON public.delivery_locations (is_active);
CREATE INDEX IF NOT EXISTS delivery_locations_city_idx ON public.delivery_locations (city);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS subtotal_usd NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS delivery_fee_usd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_city TEXT,
  ADD COLUMN IF NOT EXISTS delivery_distance_km NUMERIC(10, 1),
  ADD COLUMN IF NOT EXISTS delivery_weight_kg NUMERIC(10, 2);

UPDATE public.orders
SET subtotal_usd = total_usd
WHERE subtotal_usd IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN subtotal_usd SET DEFAULT 0;

ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read delivery settings"
  ON public.delivery_settings FOR SELECT
  USING (true);

CREATE POLICY "Sales admins manage delivery settings"
  ON public.delivery_settings FOR ALL
  USING (public.is_super_admin() OR public.is_admin_sales())
  WITH CHECK (public.is_super_admin() OR public.is_admin_sales());

CREATE POLICY "Public can read active delivery locations"
  ON public.delivery_locations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Sales admins manage delivery locations"
  ON public.delivery_locations FOR ALL
  USING (public.is_super_admin() OR public.is_admin_sales())
  WITH CHECK (public.is_super_admin() OR public.is_admin_sales());
