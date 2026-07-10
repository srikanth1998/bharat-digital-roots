# Portal Shell + UX Overhaul

Turn the current split screens (Account, Forum, Admin) into one cohesive portal with a shared sidebar, better dashboards, and friendlier admin flows.

## 1. Portal shell

New layout route `src/routes/_authenticated/_portal.tsx` wrapping all portal pages with a shadcn `Sidebar` + top bar (mobile: sheet). Move existing routes under it:

- `/portal` → landing (redirects to role-appropriate dashboard)
- `/portal/id` — My ID card (from `account.tsx`)
- `/portal/forum` — feed + posts (from `forum.tsx`, split)
- `/portal/members` — member directory (admin + scoped admins)
- `/portal/messages` — contact messages (from `admin-messages.tsx`)
- `/portal/policies` — senate policies
- `/portal/units` — geographic units admin

Sidebar items filtered by `getMyRoleContext()` so members see only ID + Forum; admins see Members/Messages; senate sees Policies/Units. Collapsible with icon rail; mobile uses `SidebarTrigger` in the top bar. Keep old `/account`, `/admin`, `/forum` as redirects for one release.

## 2. Member dashboard (`/portal/id`)

- Existing ID card at top.
- Below: two cards side-by-side (stack on mobile):
  - **Recent posts** in member's scope (last 5, via `listPosts` filtered by member's branch ancestors).
  - **Upcoming events** (`kind='event'`, `event_starts_at >= now()`, next 5).
- CTA row: "Go to Forum", "Update branch" (if unset).

## 3. Admin dashboard improvements

For `/portal/members`:
- Summary counter row: total members, active this month, by plan, by state (4 stat cards).
- Table with column sorting (name, joined_at, plan, state), sticky header, pagination (25/page), search box (name/email/member_code).
- Mobile: card list instead of table (name, plan badge, location, joined date).
- Filter chips: plan, status, state.

For `/portal/messages`: same counter + pagination + mobile card treatment.

For `/portal/units` and forum admin: counters (units by level, admins assigned, posts this week).

## 4. Searchable member picker for admin assignment

Replace raw `userId` UUID input with a `Command`-based combobox:
- New server fn `searchMembers({ query })` in `forum.functions.ts` — returns `{ user_id, full_name, email, member_code }[]` (senate/admin only, uses `ilike` on name/email/code, limit 20).
- New component `<MemberPicker value onChange />` using shadcn `Command` + `Popover`.
- Used in `assignAdmin` form and `addPolicyCollaborator` form.

## 5. Empty & loading states

Shared components:
- `<EmptyState icon title description action />` — used everywhere a list is empty ("No posts yet in your branch — be the first to post").
- `<LoadingState />` — skeletons matching each layout (card grid, table rows, ID card shimmer).
- Role-specific onboarding banner on `/portal`:
  - No senate president: card prompting `claimSenatePresident`.
  - Member with no branch: banner "Pick your branch to see local posts".
  - New admin with no posts/units: 3-step checklist.

## 6. Out of scope

- No schema changes.
- No new roles or permissions.
- No realtime, notifications, or comments.
- Member ID generation still deferred.

## Technical notes

- All changes are frontend + one read-only server fn (`searchMembers`).
- Reuse existing `getMyRoleContext`, `listPosts`, `listMembersInScope`, `listAdminAssignments`.
- Sidebar uses shadcn `Sidebar` primitives already available; add `@/components/portal/app-sidebar.tsx`.
- Sorting/pagination client-side initially (data volumes small); revisit if >500 rows.
- Redirect stubs: existing `account.tsx`, `admin.tsx`, `forum.tsx`, `admin-messages.tsx` become `Navigate` to `/portal/...`.

Approve and I'll build in this order: shell + redirects → member dashboard → member picker → admin dashboards → empty/loading polish.
