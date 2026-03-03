# Admin password reset setup

The admin centre uses Supabase Auth. Passwords are **not** stored in the app or in the `profiles` table.

## How to set or reset an admin password

### Option A: Use the app’s “Forgot password?” flow (recommended)

1. Go to **/admin/login** and click **Forgot password?**
2. Enter the admin email and submit. A reset email is sent with a link that goes to **/admin/reset-password**.
3. Click the link in the email, then set a new password on the reset page.
4. Sign in at **/admin/login** with that email and the new password.

For this to work, the reset link must be allowed in Supabase:

1. In **Supabase Dashboard** go to **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add:
   - `http://localhost:3000/admin/reset-password` (local)
   - `https://yourdomain.com/admin/reset-password` (production)
3. Save.

### Option B: When you “Send password recovery” from Supabase Dashboard

If you use **Authentication** → **Users** → **Send password recovery**, the email uses Supabase’s default link. By default it may redirect to your **Site URL** (e.g. the homepage), which is why you were sent to the public site.

To make Dashboard-triggered resets land on the app’s reset page:

1. **Authentication** → **URL Configuration**  
   - Set **Site URL** to your app (e.g. `https://yourdomain.com` or `http://localhost:3000`).  
   - Add the same **Redirect URLs** as in Option A.

2. **Authentication** → **Email Templates** → **Reset password**  
   - Change the link so it goes to your reset page with the token.  
   - Replace the template body with something like:

```html
<h2>Reset your password</h2>
<p>Follow this link to set a new password for your account:</p>
<p><a href="{{ .SiteURL }}/admin/reset-password?token_hash={{ .TokenHash }}&type=recovery">Set new password</a></p>
```

Then both the app’s “Forgot password?” and the Dashboard “Send password recovery” will send users to **/admin/reset-password** to set their password in the UI.

### Creating a new admin user with a password

1. **Supabase** → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter **Email** and **Password** (this is the password they use at /admin/login).
3. Copy the user’s **UUID**.
4. In **SQL Editor** run:
   ```sql
   INSERT INTO public.profiles (id, role) VALUES ('<paste-uuid-here>', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

They can sign in at **/admin/login** with that email and password. If you didn’t set a password when creating the user, use **Forgot password?** (Option A) or the custom Recovery template (Option B) so they can set one via the reset page.
