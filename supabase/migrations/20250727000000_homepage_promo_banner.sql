-- Homepage promo banner: scrolling announcement strip below the hero (sales admin managed)

CREATE TABLE IF NOT EXISTS public.homepage_promo_banner_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.homepage_promo_banner_settings (id, is_enabled)
VALUES (true, false)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.homepage_promo_banner_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS homepage_promo_banner_items_sort_idx
  ON public.homepage_promo_banner_items (sort_order);

ALTER TABLE public.homepage_promo_banner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_promo_banner_items ENABLE ROW LEVEL SECURITY;

-- Public can read banner settings and active items
CREATE POLICY "Public read promo banner settings"
  ON public.homepage_promo_banner_settings FOR SELECT
  USING (true);

CREATE POLICY "Public read active promo banner items"
  ON public.homepage_promo_banner_items FOR SELECT
  USING (is_active = true);

-- Sales admins and super admins manage banner content
CREATE POLICY "Sales admins manage promo banner settings"
  ON public.homepage_promo_banner_settings FOR ALL
  USING (public.is_super_admin() OR public.is_admin_sales())
  WITH CHECK (public.is_super_admin() OR public.is_admin_sales());

CREATE POLICY "Sales admins manage promo banner items"
  ON public.homepage_promo_banner_items FOR ALL
  USING (public.is_super_admin() OR public.is_admin_sales())
  WITH CHECK (public.is_super_admin() OR public.is_admin_sales());
