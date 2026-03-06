import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Server-side Supabase client with service role. Use only in API routes or server components
 * when you need to bypass RLS (e.g. generate signed URLs for private storage).
 * Set SUPABASE_SERVICE_ROLE_KEY in .env.local for document download to work.
 */
export const supabaseServer =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
    : null
