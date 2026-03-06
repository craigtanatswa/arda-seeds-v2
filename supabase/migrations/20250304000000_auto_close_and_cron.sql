-- Auto-close tenders and vacancies after closing date (for use with pg_cron if enabled).
-- Alternatively use the Next.js API route GET /api/cron/auto-close with a cron job or Vercel Cron.

CREATE OR REPLACE FUNCTION public.auto_close_expired_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Close tenders where closing_date has passed and status is still 'open'
  UPDATE public.tenders
  SET status = 'closed', updated_at = now()
  WHERE status = 'open' AND closing_date < now();

  -- Close vacancies where closing_date has passed and status is still 'open'
  UPDATE public.vacancies
  SET status = 'closed', updated_at = now()
  WHERE status = 'open' AND closing_date < current_date;
END;
$$;

-- To run daily with pg_cron (Supabase Dashboard > Database > Extensions > enable pg_cron), then:
-- SELECT cron.schedule('auto-close-listings', '0 2 * * *', 'SELECT public.auto_close_expired_listings()');
-- (Runs at 02:00 UTC daily.)
