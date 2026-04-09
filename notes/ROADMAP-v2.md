# ROADMAP v2 — SnippetVault SaaS Conversion

> **Single source of truth for the SaaS conversion.**
> Read this before every response. Last updated: 2026-04-10

---

## Overview

Convert SnippetVault from a single-tenant demo into a multi-user SaaS with:
- Landing page at `/`
- BetterAuth (email+password, no OTP/email verification for now)
- Per-user dashboards, profiles, settings
- Design system for visual consistency

**No email verification / OTP** — this is a test/demo site. Users sign up and are immediately active. Can be added later via BetterAuth's email-otp plugin.

---

## Architecture Changes

### Before (v1)
```
/ → Dashboard (single user, no auth)
```

### After (v2)
```
/              → Landing page (public, marketing)
/login         → Sign in + Sign up (public)
/dashboard     → Snippet manager (protected, per-user)
/profile       → User profile (protected)
/settings      → Account settings (protected)
/api/auth/*    → BetterAuth catch-all handler
/api/folders   → Scoped by userId
/api/snippets  → Scoped by userId
/api/metadata  → Scoped by userId (auth required)
```

### Auth Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Auth library | BetterAuth | Modern, plugin-based, supports Prisma adapter natively |
| DB adapter | `@better-auth/prisma-adapter` | Direct Prisma integration, schema generated via CLI |
| Auth methods | Email + Password only | Simple for test site, no OAuth complexity |
| Session | Cookie-based (default) | Automatic, no token management needed |
| Client | `better-auth/react` | `useSession` hook, `signIn`/`signUp`/`signOut` methods |

---

## File Cleanup Plan

### Files to DELETE (unused defaults)
```
public/file.svg      ← create-next-app default, unused
public/globe.svg     ← create-next-app default, unused
public/next.svg      ← create-next-app default, unused
public/vercel.svg    ← create-next-app default, unused
public/window.svg    ← create-next-app default, unused
app/favicon.ico      ← redundant, we have app/icon.svg
```

### Files to KEEP (all functional)
```
notes/               ← user's docs (ROADMAP, progress)
.github/             ← user's copilot instructions
credentials/         ← user's PAT
.env, .env.example   ← config
AGENTS.md, CLAUDE.md ← agent instructions
```

---

## Database Schema Changes

### New BetterAuth tables (auto-generated)
```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  folders       Folder[]
  snippets      Snippet[]
}

model Session {
  id        String   @id
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Account {
  id                    String    @id
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Modified existing tables
```prisma
model Folder {
  id        String    @id @default(cuid())
  name      String
  userId    String                          // ← NEW: scope to user
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  snippets  Snippet[]
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])                         // ← NEW: fast per-user queries
}

model Snippet {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  url       String?
  language  String?
  folderId  String
  userId    String                          // ← NEW: scope to user
  folder    Folder   @relation(fields: [folderId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([folderId])
  @@index([createdAt])
  @@index([userId])                         // ← NEW: fast per-user queries
}
```

### Migration Strategy
Since we're on Neon (dev/test), we'll:
1. Generate schema via `npx auth generate` (adds BetterAuth tables to schema.prisma)
2. Manually add `userId` to Folder + Snippet
3. Clear existing test data (it's a demo)
4. Run `npx prisma db push --force-reset` to sync clean schema

---

## Build Phases

### Phase 1 — File Cleanup
- [ ] Delete `public/file.svg`
- [ ] Delete `public/globe.svg`
- [ ] Delete `public/next.svg`
- [ ] Delete `public/vercel.svg`
- [ ] Delete `public/window.svg`
- [ ] Delete `app/favicon.ico`
- [ ] Verify build still passes

### Phase 2 — BetterAuth Setup
- [ ] Install: `npm i better-auth @better-auth/prisma-adapter`
- [ ] Add env vars to `.env`:
  - `BETTER_AUTH_SECRET` (32+ char random string)
  - `BETTER_AUTH_URL=http://localhost:3000`
- [ ] Add env vars to `.env.example`
- [ ] Create `lib/auth.ts` — server-side BetterAuth instance:
  ```ts
  import { betterAuth } from "better-auth"
  import { prismaAdapter } from "better-auth/adapters/prisma"
  import { prisma } from "./prisma"

  export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
  })
  ```
- [ ] Create `lib/auth-client.ts` — client-side auth:
  ```ts
  import { createAuthClient } from "better-auth/react"
  export const authClient = createAuthClient()
  export const { signIn, signUp, signOut, useSession } = authClient
  ```
- [ ] Create `app/api/auth/[...all]/route.ts` — catch-all:
  ```ts
  import { auth } from "@/lib/auth"
  import { toNextJsHandler } from "better-auth/next-js"
  export const { POST, GET } = toNextJsHandler(auth)
  ```
- [ ] Run `npx auth generate` to get Prisma schema additions
- [ ] Manually add `userId` field + relation to Folder and Snippet models
- [ ] Run `npx prisma db push --force-reset`
- [ ] Run `npx prisma generate`
- [ ] Verify BetterAuth is responding: `curl http://localhost:3000/api/auth/ok`
- [ ] **CHECKPOINT: Auth backend running, schema synced.**

### Phase 3 — Auth Middleware + Route Protection
- [ ] Create `middleware.ts` at project root:
  - Check session for protected routes (`/dashboard`, `/profile`, `/settings`)
  - Redirect to `/login` if no session
  - Redirect `/login` → `/dashboard` if already authenticated
- [ ] Verify: unauthenticated user hitting `/dashboard` → redirected to `/login`
- [ ] **CHECKPOINT: Protected routes redirect properly.**

### Phase 4 — Login Page (`/login`)
- [ ] Create `app/login/page.tsx`:
  - Two modes: Sign In / Sign Up (toggle between them)
  - Fields: name (sign up only), email, password
  - Submit handler calls `signIn.email()` or `signUp.email()`
  - Error display (inline, not toast)
  - Loading state on submit button
  - Redirect to `/dashboard` on success
  - "Back to home" link
  - Dark theme styling matching design system
- [ ] Test: create account → lands on dashboard → sign out → sign in again
- [ ] **CHECKPOINT: Full auth flow works end to end.**

### Phase 5 — Move Dashboard to `/dashboard`
- [ ] Move current `app/page.tsx` logic → `app/dashboard/page.tsx`
- [ ] Update all API routes to require auth + scope by `userId`:
  - `GET /api/folders` → `where: { userId }`
  - `POST /api/folders` → include `userId` from session
  - `PUT /api/folders` → verify ownership (`where: { id, userId }`)
  - `DELETE /api/folders` → verify ownership
  - Same pattern for `/api/snippets`
  - `/api/metadata` → require auth (reject if no session)
- [ ] Create auth helper: `lib/auth-utils.ts`
  ```ts
  import { auth } from "./auth"
  import { headers } from "next/headers"
  
  export async function getUser() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error("Unauthorized")
    return session.user
  }
  ```
- [ ] Update `use-folders.ts` and `use-snippets.ts` — no changes needed (they call the same API routes, which now scope by session cookie automatically)
- [ ] Add sign-out button to dashboard sidebar
- [ ] **CHECKPOINT: Dashboard shows only authenticated user's data.**

### Phase 6 — Landing Page (`/`)
- [ ] Create `app/page.tsx` as the public landing page:
  - Hero section: title, subtitle, CTA button → `/login`
  - Features section: 3-4 cards showing key features
  - Footer: minimal
  - Dark theme, follows design system tokens
  - Responsive
- [ ] **CHECKPOINT: Landing page looks professional, links to login.**

### Phase 7 — Profile Page (`/profile`)
- [ ] Create `app/profile/page.tsx`:
  - Display user info: name, email, avatar placeholder
  - Show account stats: total folders, total snippets, member since
  - Edit name inline
  - Upload/change profile image (optional stretch)
  - Navigation back to dashboard
- [ ] **CHECKPOINT: Profile page shows user info.**

### Phase 8 — Settings Page (`/settings`)
- [ ] Create `app/settings/page.tsx`:
  - Change password (current + new + confirm)
  - Change display name
  - Delete account (with confirmation modal — cascades all data)
  - Dark theme styling
- [ ] Wire delete account to BetterAuth + cascade delete user's folders/snippets
- [ ] **CHECKPOINT: Settings page works, password change works.**

### Phase 9 — Shared Layout for Protected Pages
- [ ] Create `app/(protected)/layout.tsx`:
  - Shared nav: logo, dashboard link, profile link, settings link, sign out
  - Move `/dashboard`, `/profile`, `/settings` under `(protected)` route group
  - This layout wraps all auth-required pages
  - Mobile responsive nav
- [ ] **CHECKPOINT: All protected pages share consistent navigation.**

### Phase 10 — Polish + Build + Deploy
- [ ] Test full flow: landing → sign up → dashboard → create data → profile → settings → sign out → sign in → data persists
- [ ] Verify build passes: `npm run build`
- [ ] Update `.env.example` with new vars
- [ ] Update `README.md` with auth info
- [ ] Update progress.md
- [ ] Commit and push
- [ ] Add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` to Vercel env vars
- [ ] Verify live deployment
- [ ] **CHECKPOINT: SaaS conversion complete.**

---

## Critical Gotchas

1. **BetterAuth + Prisma adapter**: Import from `"better-auth/adapters/prisma"`, NOT `"@better-auth/prisma-adapter"` (the docs show both but the built-in adapter is preferred).
2. **Schema generation**: Run `npx auth generate` AFTER configuring `lib/auth.ts` — it reads your auth config to know what tables to generate.
3. **Session in API routes**: Use `auth.api.getSession({ headers: await headers() })` — must pass headers from `next/headers`.
4. **Force reset DB**: Since we're adding required `userId` to existing tables with no default, we need `--force-reset`. This deletes all data. Fine for dev.
5. **Middleware vs server-side check**: Middleware handles redirects. API routes still need to verify session independently (defense in depth).
6. **Cookie domain**: BetterAuth sets cookies automatically. On Vercel, `BETTER_AUTH_URL` must match the deployed domain.
7. **Prisma singleton**: Keep using the existing singleton in `lib/prisma.ts` — pass it to BetterAuth's prisma adapter.

---

## OTP / Email Verification Decision

**Not implementing for now.** Reasons:
- Test site — no real user friction needed
- BetterAuth supports it via `email-otp` plugin, easy to add later
- Saves significant complexity (email provider config, templates, verification flow)

To add later: `import { emailOTP } from "better-auth/plugins"` → add to plugins array → configure email transport (Resend, etc.)
