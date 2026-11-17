# Admin password reset setup

The admin centre uses Supabase Auth. Passwords are **not** stored in the app or in the `profiles` table.

## Option 1: Super admin sets a password directly (recommended)

A super admin (`profiles.role = 'admin'`) can set any system admin’s password without sending an email.

1. Sign in at **/admin/login**, then open **Manage Admins** (`/admin/admins`).
2. In the row for the admin, click **Change password**.
3. Enter the new password twice (minimum **8 characters**) and click **Update password**.
4. Share the password with the admin securely. They can change it later with **Forgot password?**.

The API endpoint is `PATCH /api/admin/admins/:id` with `{ "password": "..." }`. It requires the
caller to be a super admin and refuses to change another super admin’s role or password.

## Option 2: The admin resets it themselves (Forgot password)

1. Go to **/admin/login** and click **Forgot password?**
2. Enter the admin email and submit.
3. The server sends a **branded reset email** (green ARDA Seeds design) with a one-time link to
   `/admin/reset-password`.
4. Clicking the link verifies the token and opens the “Set new password” page.
5. Sign in at **/admin/login** with the new password.

### How the reset link is built (and why it no longer goes to localhost)

The email is sent by `POST /api/admin/forgot-password`, not by Supabase’s default email sender.
It generates a recovery token with `auth.admin.generateLink()` and builds the link itself:

```
{SITE_URL}/admin/reset-password?token_hash=...&type=recovery
```

`SITE_URL` is resolved in this order:

1. `NEXT_PUBLIC_SITE_URL` or `SITE_URL` (set one in production).
2. `NEXT_PUBLIC_APP_URL`.
3. Vercel’s production/deployment URL.
4. The host the request arrived on (`x-forwarded-host` / `host`).
5. `http://localhost:3000` (local development only).

Any configured value that points at localhost is ignored when the request came from a real domain,
so copying a local `.env` value into production cannot produce localhost links.

Because the link uses `token_hash` and points straight at the app, it does **not** depend on the
Supabase **Site URL** or the **Redirect URLs** allowlist. The reset page verifies the token with
`supabase.auth.verifyOtp({ token_hash, type: "recovery" })` and then updates the password.

**Recommended:** add `NEXT_PUBLIC_SITE_URL=https://ardaseeds.co.zw` to the deployment
environment so links always use the canonical domain, even when the request is proxied.

### Email delivery

The branded email is sent with the existing SMTP settings (`SMTP_HOST`, `SMTP_PORT`,
`SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SENDER_EMAIL`). If SMTP is not configured, the endpoint
falls back to Supabase’s default recovery email so resets still work.

Responses are always generic so the endpoint cannot be used to discover which emails are admins.
Requests are rate limited to 5 per IP per 15 minutes.

### Optional: Supabase Dashboard recovery emails

If you also use **Authentication** → **Users** → **Send password recovery** from the Supabase
dashboard, those emails still use Supabase’s template. Update it to match if desired:

```html
<h2>Reset your password</h2>
<p>Follow this link to set a new password for your account:</p>
<p><a href="{{ .SiteURL }}/admin/reset-password?token_hash={{ .TokenHash }}&type=recovery">Set new password</a></p>
```

Set **Authentication** → **URL Configuration** → **Site URL** to the production domain as well.

### Creating a new admin user with a password

1. **Supabase** → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter **Email** and **Password** (this is the password they use at /admin/login).
3. Copy the user’s **UUID**.
4. In **SQL Editor** run:
   ```sql
   INSERT INTO public.profiles (id, role) VALUES ('<paste-uuid-here>', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

They can sign in at **/admin/login** with that email and password. If you didn’t set a password
when creating the user, use **Forgot password?** so they can set one via the reset page.
