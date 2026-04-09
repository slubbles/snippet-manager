# Snippet Manager — Copilot Instructions

> Read **notes/ROADMAP.md** before every response.
> It is the single source of truth for architecture, conventions, and known gotchas.
>
> After every response that changes code or completes a task, update **notes/progress.md**.
> Compare each checkbox in ROADMAP.md against actual project state and mark done/not-done.
> Include a session timestamp, percentage complete, and what was accomplished.
> This lets us pick up exactly where we left off even after context resets.

## Progress Tracking Rules

1. **`notes/progress.md`** is the living session log. Create it if it doesn't exist.
2. At the **start** of a session: read `notes/progress.md` to understand where we are.
3. At the **end** of a task/session: update `notes/progress.md` with:
   - Current date/time
   - Overall completion percentage (count done vs total checkboxes in ROADMAP.md)
   - Phase-by-phase status (✅ done, 🟡 in progress, ⬜ not started)
   - List of what was done this session
   - Known blockers or next steps
4. Keep `notes/progress.md` concise — bullet points, not paragraphs.

## Quick Rules

1. **Framework**: Next.js 16 (App Router, Turbopack default). Do NOT use Pages Router.
2. **Styling**: Tailwind CSS with `class` dark-mode strategy (controlled by `next-themes`).
3. **Database**: Neon PostgreSQL (serverless, free tier). Connection string in `DATABASE_URL`.
4. **ORM**: Prisma with `@prisma/client`. Use the singleton pattern in `src/lib/prisma.ts`.
5. **Deployment**: Vercel.

## File Structure Convention

```
src/
  app/
    api/
      folders/route.ts        # Folder CRUD
      snippets/route.ts       # Snippet CRUD
      metadata/route.ts       # URL title fetch
    layout.tsx                 # Root layout (ThemeProvider, fonts)
    page.tsx                   # Dashboard (main page)
    globals.css                # Tailwind directives + custom styles
  components/
    sidebar.tsx                # Folder sidebar
    snippet-grid.tsx           # Snippet card grid
    snippet-modal.tsx          # Create/Edit modal
    search-bar.tsx             # Real-time search
    theme-toggle.tsx           # Dark/Light toggle
    folder-item.tsx            # Individual folder in sidebar
    snippet-card.tsx           # Individual snippet card
  lib/
    prisma.ts                  # Prisma client singleton
    utils.ts                   # Shared utilities
  hooks/
    use-folders.ts             # Folder state/fetching
    use-snippets.ts            # Snippet state/fetching
prisma/
  schema.prisma                # Database schema
```

## Critical Patterns

### Prisma Singleton (MUST use in Next.js dev)
```ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Route Handler Pattern (App Router)
```ts
// Always use NextRequest/NextResponse
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.folder.findMany()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
```

### Theme Setup (next-themes)
- Add `suppressHydrationWarning` to `<html>` tag in layout.tsx
- Wrap children with `<ThemeProvider attribute="class" defaultTheme="dark">`
- Use Tailwind `dark:` prefix for dark mode styles

### URL Metadata Fetch
- Use `cheerio` (NOT a headless browser) to parse HTML and extract `<title>`
- Always set a fetch timeout (5 seconds max)
- Validate URL format before fetching
- Handle errors gracefully — return empty title, don't crash

## Known Gotchas

1. **Next.js 16 async params**: Dynamic route params are now async. Use `const { id } = await params`.
2. **Prisma in Vercel**: Add `prisma generate` to build command or use `postinstall` script.
3. **Neon cold starts**: First query after idle may take ~500ms. Show loading state.
4. **Tailwind dark mode**: Must use `darkMode: 'class'` in tailwind config (or `'selector'` in v4).
5. **CORS on metadata fetch**: Fetch happens server-side in API route, so no CORS issues.
6. **Hydration mismatch**: Theme toggle can cause hydration issues — use `mounted` state check.
7. **Search is client-side**: Filter from already-fetched snippets, don't re-query DB on each keystroke.

## Don'ts

- Don't add authentication (not required, wastes time)
- Don't add SSR data fetching for the dashboard — use client-side fetch for simplicity
- Don't over-engineer — this is a 6-hour build
- Don't use `pages/` directory at all
- Don't install unnecessary packages
