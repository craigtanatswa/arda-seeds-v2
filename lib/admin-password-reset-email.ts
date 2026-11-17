import { COMPANY_EMAIL, COMPANY_PHONE_MOBILE, COMPANY_PHONE_TOLL_FREE } from "@/lib/site"

type PasswordResetEmailInput = {
  /** Recipient email address (shown in the security note). */
  email: string
  /** Absolute URL that opens the reset page with a one-time recovery token. */
  resetUrl: string
  /** How long the link stays valid, in minutes. Supabase defaults to 60. */
  expiresInMinutes?: number
}

/**
 * Branded admin password reset email. Uses table-based markup and inline
 * styles so it renders consistently in Outlook, Gmail and Apple Mail.
 */
export function buildAdminPasswordResetEmail({
  email,
  resetUrl,
  expiresInMinutes = 60,
}: PasswordResetEmailInput) {
  const year = new Date().getFullYear()
  const subject = "Reset your ARDA Seeds admin password"

  const html = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${subject}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
      Use this secure link to set a new password for your ARDA Seeds admin account.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <!-- Header -->
            <tr>
              <td style="background-color: #14532d; background-image: linear-gradient(135deg, #14532d 0%, #15803d 65%, #16a34a 100%); padding: 32px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <p style="margin: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #bbf7d0;">
                        ARDA Seeds
                      </p>
                      <h1 style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; line-height: 1.3; font-weight: bold; color: #ffffff;">
                        Admin password reset
                      </h1>
                    </td>
                    <td align="right" valign="top" style="width: 56px;">
                      <div style="width: 44px; height: 44px; border-radius: 12px; background-color: rgba(255,255,255,0.16); text-align: center; line-height: 44px; font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: #ffffff;">
                        &#128274;
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px 40px 32px;">
                <p style="margin: 0 0 8px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #111827;">
                  Hello,
                </p>
                <p style="margin: 0 0 16px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: #374151;">
                  We received a request to reset the password for the ARDA Seeds admin account linked to
                  <strong style="color: #111827;">${escapeHtml(email)}</strong>.
                </p>
                <p style="margin: 0 0 28px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: #374151;">
                  Click the button below to choose a new password. This link can only be used once.
                </p>

                <!-- Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 28px;">
                  <tr>
                    <td align="center" style="border-radius: 10px; background-color: #15803d;">
                      <a href="${escapeHtml(resetUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 15px 34px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 10px;">
                        Set a new password
                      </a>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.6; color: #166534;">
                      This link expires in ${expiresInMinutes} minutes. If it has expired, request a new one from the admin login page.
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 8px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6b7280;">
                  If the button does not work, copy and paste this address into your browser:
                </p>
                <p style="margin: 0 0 28px; padding: 12px 14px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-family: Consolas, Menlo, monospace; font-size: 12px; line-height: 1.6; color: #1f2937; word-break: break-all;">
                  <a href="${escapeHtml(resetUrl)}" target="_blank" rel="noopener noreferrer" style="color: #15803d; text-decoration: none;">${escapeHtml(resetUrl)}</a>
                </p>

                <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.7; color: #6b7280;">
                  If you did not request this reset, you can safely ignore this email. Your password will stay the same.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">
                <div style="height: 1px; background-color: #e5e7eb;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px 32px;">
                <p style="margin: 0 0 6px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; color: #14532d;">
                  ARDA Seeds &middot; Admin Centre
                </p>
                <p style="margin: 0 0 4px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.6; color: #6b7280;">
                  Need help? Call ${COMPANY_PHONE_TOLL_FREE} or ${COMPANY_PHONE_MOBILE}, or email
                  <a href="mailto:${COMPANY_EMAIL}" style="color: #15803d; text-decoration: none;">${COMPANY_EMAIL}</a>.
                </p>
                <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #9ca3af;">
                  &copy; ${year} ARDA Seeds. This is an automated message, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    "ARDA Seeds - Admin password reset",
    "",
    `We received a request to reset the password for the admin account linked to ${email}.`,
    "",
    "Open this link to choose a new password:",
    resetUrl,
    "",
    `This link expires in ${expiresInMinutes} minutes and can only be used once.`,
    "",
    "If you did not request this reset, you can safely ignore this email.",
    "",
    `Need help? Call ${COMPANY_PHONE_TOLL_FREE} or ${COMPANY_PHONE_MOBILE}, or email ${COMPANY_EMAIL}.`,
  ].join("\n")

  return { subject, html, text }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
