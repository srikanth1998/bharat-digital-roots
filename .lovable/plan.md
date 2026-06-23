## Goal

After payment, the member gets an account auto-created. They receive an email with their ID card image + a temporary password. They log in, are forced to change the password, then land in their member area. Admins (emails you designate) see a list of all members with search.

## What I'll build

### 1. Database (migration)
- `members` table — all fields from the membership form (name, mobile, address, country/state/district, plan, amount, payment IDs, `member_code` like `VNY-A-2026-0001`, `created_at`). Linked to `auth.users` via `user_id`.
- `user_roles` table + `app_role` enum (`admin`, `member`) + `has_role()` security-definer function (standard Lovable pattern, no recursive RLS).
- RLS: members read/update only their own row; admins read all.

### 2. Payment + signup flow (server)
Update `verifyRazorpayPayment` to:
1. Verify signature (already done).
2. Generate temp password + member code.
3. Create the auth user with `supabaseAdmin.auth.admin.createUser` (email_confirm=true, `must_change_password: true` in metadata).
4. Insert the `members` row with all form data.
5. Enqueue an email to the member: welcome + member code + temp password + login link. (ID card as inline rendered card in the email; PDF/image attachment is not supported by Lovable Emails — the card is rendered with HTML/CSS in the email body, and a downloadable version is available in the member portal.)

### 3. Email infrastructure
- Set up Lovable Emails (domain delegation → infra → scaffold transactional). One-time setup; I'll guide you through the domain step in the UI.
- Create one template: `membership-welcome` with the ID card design + credentials.

### 4. Login page (`/login`)
- Real email + password form using `supabase.auth.signInWithPassword`.
- After sign-in, if `user_metadata.must_change_password === true` → redirect to `/set-password`.
- Otherwise → redirect to `/account` (member) or `/admin` (admin).

### 5. `/set-password` (forced first-time change)
- Simple form, calls `supabase.auth.updateUser({ password, data: { must_change_password: false } })`.

### 6. `/account` (member home, `_authenticated/`)
- Shows their ID card, plan, expiry (1 yr from join), member code. Download-as-image button.

### 7. `/admin` (admin only, `_authenticated/_admin/`)
- Table of all members: name, email, member code, plan, mobile, district, joined date.
- Search box (name / email / code / mobile).
- Gated by `has_role(auth.uid(), 'admin')`.

### 8. Seed first admin
- After deploy, tell me the email of the user who should be admin. I'll run an INSERT into `user_roles` for that user_id.

## Out of scope for this round
- PDF attachment of ID card (Lovable Emails doesn't support attachments — rendered inline in the email instead, downloadable from `/account`).
- Forgot-password / reset-by-email link (can add next).
- Editing member data from the admin dashboard (read-only list for now, per your "just a basic list" choice).
- Bulk export / CSV.

## Order of execution
1. Create DB migration (members + user_roles + RLS + has_role).
2. Set up email domain + infrastructure (needs your DNS step in the UI).
3. Scaffold transactional email + write `membership-welcome` template.
4. Update payment verify fn to create user + send email.
5. Rewrite `/login`, add `/set-password`, `/account`, `/admin`.
6. You give me the admin email → I seed the role.

Approve and I'll start with step 1.