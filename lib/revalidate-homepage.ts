import { supabase } from "@/lib/supabaseClient"

/** Bust the production homepage cache after promo banner changes. */
export async function revalidateHomepage(): Promise<void> {
  if (!supabase) return

  const token = (await supabase.auth.getSession()).data.session?.access_token
  if (!token) return

  try {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: "/" }),
    })
  } catch (error) {
    console.error("Homepage revalidation failed:", error)
  }
}
