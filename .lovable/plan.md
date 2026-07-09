# Forum Hierarchy System — Implementation Plan

This is a large feature. Here's the scoped plan before I start building.

## 1. Concepts

**Two houses**
- **Senate House** — governance. Roles: `senate_president`, `senate_member`.
- **Caucus House** — geographic hierarchy: Continent → Country → Zone → State → District → Branch.

**Roles (RBAC)**
`senate_president`, `senate_member`, `continent_admin`, `country_admin`, `zone_admin`, `state_admin`, `district_admin`, `branch_admin`, `member`.

**Rule**: an admin sees/manages only their subtree. Senate President sees all. Senate Members act per granted policy permission.

## 2. Database (Supabase migration)

New enums:
- `caucus_level`: `continent | country | zone | state | district | branch`
- extend `app_role` with the roles above (keep existing `admin`/`member` compatibility)
- `post_kind`: `event | news | announcement | policy`

New tables (all with RLS + GRANTs):
- `geographic_units(id, level caucus_level, name, parent_id → geographic_units, slug)` — single self-referential tree covers continents…branches. Simpler than 6 tables and matches the "each level" requirement.
- `admin_assignments(id, user_id, role app_role, unit_id → geographic_units NULL)` — unit_id null for senate roles.
- `member_placements(id, member_id → members, unit_id → geographic_units)` — which branch/etc a member belongs to (drives visibility). Also extend `members` with `branch_unit_id` for convenience.
- `policies(id, title, body, status, created_by, created_at, updated_at)` — Senate-scoped.
- `policy_collaborators(policy_id, user_id, permission)` — which senate members can edit.
- `posts(id, kind post_kind, title, body, unit_id → geographic_units NULL, author_id, published_at, created_at)` — unified table for events/news/announcements. `unit_id` = scope; NULL = senate-wide. Optional `event_starts_at`, `event_location` columns used only when kind='event'.

Helper SQL functions (SECURITY DEFINER):
- `is_senate(_uid)` — true if user has senate_president/member role.
- `is_senate_president(_uid)`
- `unit_ancestors(_unit_id)` returns setof unit ids (self + ancestors)
- `unit_descendants(_unit_id)` returns setof unit ids (self + descendants)
- `user_admin_units(_uid)` — units the user administers (plus descendants)
- `user_member_unit(_uid)` — the unit the user belongs to
- `can_view_post(_uid, _post_id)` — post.unit_id is null OR user's unit is in `unit_descendants(post.unit_id)` OR user is senate/admin at/above.

RLS policies use these helpers to keep policies flat and non-recursive.

**Member IDs**: schema-ready but generation deferred. `members.member_code` already exists (kept as-is). No new generator now.

## 3. Server functions (`createServerFn` + `requireSupabaseAuth`)

`src/lib/forum.functions.ts`:
- `getMyRoleContext()` → roles, admin units, member unit — drives dashboard routing.
- `listUnits({ parentId? })`, `createUnit`, `renameUnit`, `deleteUnit` (senate/parent-admin only).
- `assignAdmin({ userId, role, unitId? })`, `revokeAdmin` (senate president / parent admin).
- `listPosts({ unitId?, kind? })`, `createPost`, `updatePost`, `deletePost` — scope enforced by RLS + server-side check that author admins the target unit.
- `listPolicies`, `createPolicy`, `updatePolicy`, `addPolicyCollaborator` (senate only).
- `listMembersInScope({ unitId? })` — respects caller's admin units.

## 4. Routes / Dashboards

Under `src/routes/_authenticated/`:
- `dashboard.tsx` — router: reads role context, renders the appropriate dashboard component (single entry point, avoids 8 URLs the user has to memorize).
- `senate/index.tsx` — senate dashboard (members, policies, house-wide posts, Caucus overview).
- `senate/policies.tsx`, `senate/members.tsx`.
- `caucus/index.tsx` — admin dashboard, level auto-detected from assignment. Shows: my scope, sub-units, admins, posts (events/news/announcements) with create forms, members in scope.
- `caucus/units/$unitId.tsx` — drill-down for senate & higher admins.
- `feed.tsx` — regular member dashboard: posts visible to them (self unit + ancestors), upcoming events, announcements.

Sidebar/nav adapts to role via `getMyRoleContext`.

## 5. UI scope

Functional but minimal — tables, forms, cards using existing brand tokens (brand-green / brand-paper / brand-saffron). No new design system work. Uses existing shadcn primitives.

## 6. Out of scope (explicitly)

- Member ID generation (schema ready, no generator).
- Comments / reactions / notifications.
- Email digests of posts.
- Realtime.
- Bulk import of geographic units — seed a small starter set (1 continent, 1 country, 1 zone, 1 state, 1 district, 1 branch) so the UI is usable; you can add the rest via the dashboard.

## 7. Bootstrap

First user with `senate_president` must be granted manually. I'll add a one-time server function `claimSenatePresident()` that succeeds only if no senate_president exists yet, so you can self-promote after signing in.

## Technical notes

- Single `geographic_units` tree + `admin_assignments` scales cleaner than 6 parallel tables and matches "every admin has a dashboard based on assigned level".
- RLS uses SECURITY DEFINER helpers to avoid recursive policy evaluation.
- All new public-schema tables get explicit GRANTs to `authenticated` and `service_role`.
- Existing `members`, `user_roles`, welcome email, FFM code — untouched.

Approve and I'll ship the migration first, then the server functions and dashboards.
