/**
 * Resolve the public base URL used in emails and redirects.
 *
 * Order of preference:
 * 1. An explicit canonical URL (`NEXT_PUBLIC_SITE_URL` / `SITE_URL`).
 * 2. `NEXT_PUBLIC_APP_URL`.
 * 3. Vercel's production URL, then the deployment URL.
 * 4. The host/proto the request actually arrived on.
 * 5. Local development fallback.
 *
 * Any configured value that points at localhost is ignored when the request
 * itself came from a real host. This prevents reset links being emailed with
 * `http://localhost:3000` in production just because a local `.env` value was
 * copied into the deployment environment.
 */
export function getSiteUrl(request?: Request): string {
  const requestOrigin = getRequestOrigin(request)
  const requestIsLocal = requestOrigin ? isLocalUrl(requestOrigin) : false

  for (const candidate of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ]) {
    const url = candidate?.trim()
    if (!url) continue
    // Never use a localhost URL for a request that arrived on a real domain.
    if (isLocalUrl(url) && !requestIsLocal) continue
    return normalizeUrl(url)
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProduction) return normalizeUrl(`https://${vercelProduction}`)

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return normalizeUrl(`https://${vercelUrl}`)

  if (requestOrigin) return normalizeUrl(requestOrigin)

  return "http://localhost:3000"
}

function getRequestOrigin(request?: Request): string | null {
  if (!request) return null
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!host) return null
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("192.168.")
      ? "http"
      : "https")
  return `${proto}://${host}`
}

function isLocalUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.|10\.)/i.test(url.trim())
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "")
}

/** Build the canonical admin password reset URL for a recovery token. */
export function buildPasswordResetUrl(siteUrl: string, hashedToken: string): string {
  return `${normalizeUrl(siteUrl)}/admin/reset-password?token_hash=${encodeURIComponent(
    hashedToken
  )}&type=recovery`
}
