# Rebrand member ID prefix: VNY → FFM

The `VNY-` string is hardcoded in the database function that mints member codes and in the welcome email template. Update both, and rewrite existing rows.

## Changes

### 1. Database migration (new SQL file under `supabase/migrations/`)
- Replace `public.generate_member_code(...)` so it returns `'FFM-' || prefix || '-' || yr || '-' || lpad(n::text, 4, '0')` instead of `'VNY-...'`.
- Backfill existing rows: `UPDATE public.members SET member_code = REPLACE(member_code, 'VNY-', 'FFM-') WHERE member_code LIKE 'VNY-%';` (and the same on any other table storing the code, e.g. `member_id_cards` if present — the migration will guard with `IF EXISTS`).

### 2. Email template — `src/lib/email-templates/membership-welcome.tsx`
- Change default `memberCode` fallback from `'VNY-X-0000-0000'` to `'FFM-X-0000-0000'`.
- Update the sample preview code `'VNY-A-2026-0001'` → `'FFM-A-2026-0001'`.

## Notes / caveats
- Rewriting all existing IDs means any previously issued digital cards, printed cards, or past welcome emails referencing `VNY-...` become stale. Members looking up an old ID won't find a match unless they use the new `FFM-...` version. If you have a small member base right now this is fine; if not, we may want to also store the old code as an alias — say the word and I'll add that.
- No frontend/UI copy changes are needed beyond the email template — the prefix isn't referenced anywhere else in `src/`.
- After the migration runs, new signups will automatically get `FFM-...` codes with no further code changes.
