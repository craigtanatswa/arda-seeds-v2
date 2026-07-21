-- Sales marketplace: collection points, customers, orders, sales admin role helpers + RLS

CREATE OR REPLACE FUNCTION public.is_admin_sales()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin_sales');
$$;

CREATE TYPE public.collection_point_type AS ENUM ('head_office', 'depot', 'retail_partner');
CREATE TYPE public.order_fulfillment_type AS ENUM ('collection', 'delivery');
CREATE TYPE public.order_status_enum AS ENUM (
  'pending_payment',
  'paid',
  'processing',
  'awaiting_customer_collection',
  'awaiting_customer_delivery',
  'ready_for_collection',
  'out_for_delivery',
  'collected',
  'delivered',
  'cancelled',
  'payment_failed'
);

CREATE TABLE IF NOT EXISTS public.collection_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  type public.collection_point_type NOT NULL DEFAULT 'depot',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS collection_points_city_idx ON public.collection_points (city);
CREATE INDEX IF NOT EXISTS collection_points_active_idx ON public.collection_points (is_active);

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  fulfillment_type public.order_fulfillment_type NOT NULL DEFAULT 'collection',
  collection_point_id UUID REFERENCES public.collection_points(id) ON DELETE SET NULL,
  collection_point_name TEXT,
  collection_city TEXT,
  collection_address TEXT,
  delivery_address TEXT,
  total_usd NUMERIC(12, 2) NOT NULL,
  status public.order_status_enum NOT NULL DEFAULT 'pending_payment',
  paynow_poll_url TEXT,
  paynow_reference TEXT,
  paynow_status TEXT,
  paid_at TIMESTAMPTZ,
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS orders_created_idx ON public.orders (created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  pack_size TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  line_total NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items (order_id);

ALTER TABLE public.collection_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Collection points: public can read active; sales/super manage all
CREATE POLICY "Public can read active collection points"
  ON public.collection_points FOR SELECT
  USING (is_active = true);

CREATE POLICY "Sales admins manage collection points"
  ON public.collection_points FOR ALL
  USING (public.is_super_admin() OR public.is_admin_sales())
  WITH CHECK (public.is_super_admin() OR public.is_admin_sales());

-- Customers / orders / items: sales + super only (writes also via service role)
CREATE POLICY "Sales admins read customers"
  ON public.customers FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_sales());

CREATE POLICY "Sales admins update customers"
  ON public.customers FOR UPDATE
  USING (public.is_super_admin() OR public.is_admin_sales());

CREATE POLICY "Sales admins read orders"
  ON public.orders FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_sales());

CREATE POLICY "Sales admins update orders"
  ON public.orders FOR UPDATE
  USING (public.is_super_admin() OR public.is_admin_sales());

CREATE POLICY "Sales admins read order items"
  ON public.order_items FOR SELECT
  USING (public.is_super_admin() OR public.is_admin_sales());
