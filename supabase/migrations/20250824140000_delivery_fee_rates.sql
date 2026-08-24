-- Delivery fee: max($5 + $0.10/km + $0.10/kg)
UPDATE public.delivery_settings
SET
  base_fee_usd = 5.00,
  per_km_usd = 0.10,
  per_kg_usd = 0.10,
  minimum_fee_usd = 5.00,
  updated_at = now()
WHERE id = true;
