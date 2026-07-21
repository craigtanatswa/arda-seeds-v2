# Marketplace & Sales Admin — Step-by-step testing

Use this checklist after deploying the migration and env vars.

## 0. Prerequisites

1. Run the Supabase migration  
   `supabase/migrations/20250716000000_sales_orders.sql`  
   (Supabase SQL editor or `supabase db push`).
2. Set environment variables (local `.env.local` and/or Vercel):
   - `PAYNOW_INTEGRATION_ID`
   - `PAYNOW_INTEGRATION_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-domain` or `http://localhost:3000` for local — Paynow result/return URLs must be reachable by Paynow for production tests)
   - Existing `SMTP_*`, `SENDER_EMAIL`, Supabase keys
3. Create a sales admin:
   - Super admin → `/admin/admins` → add user with **Sales System** role (`admin_sales`), **or**
   - SQL: `UPDATE profiles SET role = 'admin_sales' WHERE id = '<user-uuid>';`
4. Restart `npm run dev` after changing env vars.

---

## Flow A — Seed collection points

1. Log in as super admin or sales admin → `/admin/sales/collection-points`.
2. Click **Seed defaults** (or open checkout once — first API load also seeds if empty).
3. Confirm you see Head Office, GMB depots, Farm & City branches, Electrosales.
4. Filter by city (e.g. Harare) and confirm grouping looks right.
5. **Deactivate** one location → it should disappear from the public checkout list.
6. **Activate** it again → it returns.
7. **Bulk select:** tick several rows (or use the header checkbox for all visible) → **Activate selected** / **Deactivate selected** → statuses update together.
8. **Add location** (custom name/city) → appears when active.

**Pass:** Active list is manageable (single and multi-select); inactive points stay in admin but not at checkout.

---

## Flow B — Customer pack-size order + Paynow

1. Open `/products` → **Order Seed** on a product with pack sizes.
2. Select a **pack size** (not custom kg) and pack quantity → **Add to cart**.
3. Open `/cart` → refresh the page → cart items should still be there (localStorage).
4. Click **Checkout**.
5. Enter contact details.
   - **Test mode EcoCash/OneMoney:** phone must be a Paynow simulator number (not a real line):
     - `0771111111` — success (~5s)
     - `0772222222` — delayed success (~30s)
     - `0773333333` — user cancelled
     - `0774444444` — insufficient balance
   - `PAYNOW_AUTH_EMAIL` must be your Paynow merchant login email (already set if working past the authemail error).
6. Select a **city**, then a **collection point**.
7. Choose a **payment method** on the site:
   - **EcoCash** → use a test number above (simulator; no real EcoCash prompt).
   - **OneMoney** → same test numbers, but only after OneMoney is enabled on the Paynow integration (see below).
   - **Card / Zimswitch** → redirects to Paynow; choose **TESTING: Faked Success**.
8. For EcoCash success (`0771111111`): wait a few seconds; confirmation should update to paid.
9. Check emails after paid.

**Pass:** Payment options appear on checkout; EcoCash/OneMoney never open the Paynow login page.

### Paynow dashboard setup (required for test)

1. Log in to Paynow as the merchant (`ict@ardaseeds.co.zw` or your account).
2. Open **Sell or Receive** → **3rd Party Site / Link** → integration **25688**.
3. Ensure payment methods include **EcoCash** (and **OneMoney** if you want to test it).  
   - OneMoney error *"does not have any ACTIVE 'onemoney' payment method"* means it is not enabled on this integration — turn it on or leave OneMoney for later.
4. Stay in **test mode** until you have one successful test payment, then click **Request to be Set Live**.
5. Restart `npm run dev` after env changes.

**Negative checks:**
- Crafted API call with invalid pack size / custom amount should return 400.
- Checkout without collection point or payment method should fail validation.

---

## Flow C — Sales admin: order ready

1. Log in as `admin_sales` → `/admin/sales`.
2. Open the paid order from Flow B.
3. Click **Order is ready** → confirm.
4. Status becomes `ready_for_collection`.
5. Customer receives “ready for collection” email with depot name/address.
6. Click **Mark as collected** → status `collected`.

**Pass:** Notify email + status transitions work.

---

## Flow D — Out of stock → new collection point

1. On a paid/processing order, click **OOS — new collection location**.
2. Status → `awaiting_customer_collection`.
3. Customer email includes the **full active locations list** grouped by city, and asks them to reply with a location name.
4. Simulate the reply (read email as sales).
5. On the order page, under **Apply customer reply**, select the new collection point → **Apply**.
6. Status → `processing`; collection fields update to the new point.
7. Optionally send **Order is ready** again.

**Pass:** Location does **not** change until you apply the reply; email list matches active DB points.

---

## Flow E — Out of stock → delivery

1. On another paid order, click **OOS — needs delivery address**.
2. Status → `awaiting_customer_delivery`.
3. Customer email asks for a delivery address (reply to sales inbox).
4. Paste the address into **Apply customer reply** → **Apply delivery address**.
5. Status → `out_for_delivery`; fulfillment type → delivery.
6. Mark as **delivered**.

**Pass:** Delivery is only possible via this admin path, not at checkout.

---

## Flow F — Role access

1. Log in as `admin_sales` → should land on `/admin/sales` (not HR/Procurement).
2. Confirm you **cannot** open `/admin/hr` or `/admin/admins` (redirected).
3. Super admin sees **Sales System** card on `/admin` and can assign sales admins.

**Pass:** Sales role is scoped like HR/Procurement.

---

## Flow G — Production smoke (Vercel + Paynow)

1. Confirm Vercel env: `PAYNOW_INTEGRATION_ID`, `PAYNOW_INTEGRATION_KEY`, `NEXT_PUBLIC_APP_URL` = production URL.
2. In Paynow merchant settings, ensure result/return URLs can hit  
   `{NEXT_PUBLIC_APP_URL}/api/paynow/result` and  
   `{NEXT_PUBLIC_APP_URL}/order/confirmation`.
3. Place a small real order end-to-end.
4. Rotate the Integration Key if it was ever shared in chat, then update Vercel.

---

## Quick troubleshooting

| Symptom | Check |
|--------|--------|
| “Paynow is not configured” | Env vars + restart |
| Empty collection cities | Run Seed defaults / migration applied |
| Order created but no email | SMTP vars; Paynow result must mark paid |
| Confirmation stuck on pending | Poll URL / resulturl reachable; check order `paynow_status` in DB |
| Sales admin empty tables | Migration not applied; RLS role not `admin_sales` |
| Paynow “authemail must match merchant email” (test mode) | Do not send customer email as authemail. Checkout now uses guest mode (empty authemail). |
| EcoCash “must use a test case number” | In test mode use only `0771111111` / `0772222222` / `0773333333` / `0774444444` — not a real EcoCash number. See [Paynow Test Mode](https://developers.paynow.co.zw/docs/paynow/test_mode/). |
| OneMoney “no ACTIVE onemoney payment method” | In Paynow dashboard enable OneMoney on integration 25688, or test EcoCash only until it is enabled. |
