# ROADMAP.md — Snippet Manager

> **This file is the single source of truth.**
> Copilot MUST read this before every response to stay aligned.
> Last updated: 2026-04-10

---

## 🎯 Project Goal

Build and deploy a **Personal Knowledge Base** (snippet manager) where users can save links, code snippets, or notes — organized in folders with full CRUD, URL auto-fetch, search, and theming.

**Challenge constraints**: 6-hour time limit. Functional > perfect. No auth required.

---

## 📐 Architecture Decisions & Rationale

### Stack Choices

| Layer | Choice | Why | Risk / Gotcha |
|-------|--------|-----|---------------|
| **Framework** | Next.js 16 (App Router) | Required by challenge. Latest stable (16.2). Turbopack is default bundler. | Params are async in dynamic routes. `next dev` uses Turbopack by default — no `--turbo` flag needed. |
| **Styling** | Tailwind CSS v4 | Required by challenge. Ships with `create-next-app`. v4 uses CSS-first config (`@theme` in CSS). | Dark mode: use `@custom-variant dark (&:where(.dark *))` in globals.css or `darkMode: 'selector'` in v4. `next-themes` `attribute="class"` still works. |
| **Database** | Neon PostgreSQL (free) | Serverless, cloud-hosted, scales to zero, 0.5 GB free storage, 100 CU-hrs/mo per project. | Cold start ~500ms after idle. Connection string needs `?sslmode=require`. Scale-to-zero after 5 min idle. |
| **ORM** | Prisma | Type-safe queries, auto-generated client, easy migrations, Prisma Studio for debugging. | Must use singleton pattern in dev mode (prevents connection exhaustion). Must `prisma generate` before deploy. |
| **URL Scraping** | `cheerio` | Lightweight HTML parser (~200KB). No headless browser needed. Server-side only = no CORS. | Some SPAs won't have `<title>` in initial HTML. Acceptable — we return empty title. |
| **Theming** | `next-themes` | 3KB, handles SSR hydration, persists to localStorage. | Must add `suppressHydrationWarning` to `<html>`. Must check `mounted` state before showing toggle icon. |
| **Toasts** | `sonner` | 5KB, beautiful defaults, works with Next.js App Router. | Place `<Toaster />` in layout.tsx, not in individual components. |
| **Icons** | `lucide-react` | Tree-shakable, consistent style, widely used with Tailwind. | Import individual icons: `import { Folder } from 'lucide-react'`. |
| **Deployment** | Vercel | Zero-config for Next.js, free tier, auto-deploy from GitHub push. | Need `DATABASE_URL` in Vercel env vars. No free tier build minutes limit for hobby. |

### Why NOT These Alternatives

| Alternative | Why Skipped |
|-------------|-------------|
| MongoDB Atlas | No relational integrity for folder→snippet join. PostgreSQL is better for this schema. |
| Supabase | Great but adds auth/storage complexity we don't need. Neon is simpler for DB-only use. |
| Drizzle ORM | Good but Prisma has better DX for rapid prototyping (Studio, auto-migrations, richer docs). |
| Server Actions | Could work, but API routes are clearer for CRUD, easier to test in browser/curl, and more portable. |
| tRPC | Overkill for 3 endpoints with no shared types needed across client/server. Plain fetch is simpler. |
| shadcn/ui | Beautiful but adds time to install individual components. We'll hand-write minimal Tailwind components for speed. |

---

## 📊 Data Model

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Folder {
  id        String    @id @default(cuid())
  name      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  snippets  Snippet[]
}

model Snippet {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  url       String?
  language  String?
  folderId  String
  folder    Folder   @relation(fields: [folderId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([folderId])
  @@index([createdAt])
}
```

### Data Model Decisions

| Decision | Why |
|----------|-----|
| `cuid()` IDs | URL-safe, K-sortable, no collisions, shorter than UUID. |
| `@db.Text` on content | PostgreSQL `TEXT` type — no 255-char limit like default `VARCHAR`. Snippets can be long. |
| `onDelete: Cascade` | Deleting a folder deletes all its snippets. This is expected UX — user confirms before delete. |
| `@@index([folderId])` | Fast lookup when fetching snippets for a specific folder (most common query). |
| `@@index([createdAt])` | Fast sorting by date (default sort order for snippet grid). |
| `language` optional | Only used for code snippets. Notes and links don't need it. Stored as string like `"javascript"`, `"python"`. |
| `url` optional | Only present for bookmark-type snippets. When set, triggers auto-title-fetch in the modal. |
| No `userId` | No auth = no user scoping. Single-tenant app. |

### Example Data Flow

```
User creates folder "React Patterns"
  → POST /api/folders { name: "React Patterns" }
  → Prisma creates Folder { id: "clx...", name: "React Patterns" }
  → Sidebar re-fetches and shows new folder

User creates snippet in that folder, pastes a URL
  → User types URL: "https://react.dev/learn/thinking-in-react"
  → Frontend calls GET /api/metadata?url=https://react.dev/learn/thinking-in-react
  → API fetches page, extracts <title>: "Thinking in React – React"
  → Title field auto-fills
  → User hits Save
  → POST /api/snippets { title: "Thinking in React – React", content: "", url: "https://...", folderId: "clx..." }
  → Snippet grid re-fetches and shows new card

User searches "debounce"
  → User types in search bar
  → Client-side filter runs on already-loaded snippets
  → Matches title OR content containing "debounce"
  → Grid shows only matching cards instantly (no API call)
```

---

## 🔌 API Design

### Folders API — `src/app/api/folders/route.ts`

#### `GET /api/folders`
Returns all folders sorted by name, with snippet count for the badge.
```ts
// Response shape
[
  {
    "id": "clx123...",
    "name": "JavaScript",
    "createdAt": "2026-04-10T...",
    "updatedAt": "2026-04-10T...",
    "_count": { "snippets": 12 }
  }
]
```
```ts
// Implementation approach
const folders = await prisma.folder.findMany({
  include: { _count: { select: { snippets: true } } },
  orderBy: { name: 'asc' }
})
```

#### `POST /api/folders`
Creates a new folder. Validates name is non-empty and trimmed.
```ts
// Request body
{ "name": "React Patterns" }

// Validation
- name must be non-empty string after trim
- name max length: 50 characters
- Return 400 if invalid

// Response: 201 + created folder object
```

#### `PUT /api/folders`
Renames a folder. Same validation as POST.
```ts
// Request body
{ "id": "clx123...", "name": "Updated Name" }

// Response: 200 + updated folder object
```

#### `DELETE /api/folders`
Deletes folder and cascades to all its snippets.
```ts
// Request body
{ "id": "clx123..." }

// Response: 200 + { message: "Folder deleted" }
// Prisma cascade handles snippet cleanup automatically
```

---

### Snippets API — `src/app/api/snippets/route.ts`

#### `GET /api/snippets?folderId=xxx`
Returns snippets. When `folderId` is provided, filters by that folder. When omitted, returns ALL snippets (for search across all folders).
```ts
// Response shape
[
  {
    "id": "clx456...",
    "title": "Array Unique Filter",
    "content": "const unique = [...new Set(arr)]",
    "url": null,
    "language": "javascript",
    "folderId": "clx123...",
    "createdAt": "2026-04-10T...",
    "updatedAt": "2026-04-10T..."
  }
]

// Implementation approach
const where = folderId ? { folderId } : {}
const snippets = await prisma.snippet.findMany({
  where,
  orderBy: { createdAt: 'desc' }
})
```

#### `POST /api/snippets`
Creates a new snippet. Title and folderId are required.
```ts
// Request body
{
  "title": "Debounce Function",
  "content": "function debounce(fn, ms) { ... }",
  "folderId": "clx123...",
  "url": "https://...",       // optional
  "language": "javascript"    // optional
}

// Validation
- title: required, non-empty, max 200 chars
- content: required (can be empty string for bookmarks)
- folderId: required, must exist in DB
- url: optional, if provided must be valid URL format
- language: optional, free-form string

// Response: 201 + created snippet object
```

#### `PUT /api/snippets`
Updates an existing snippet. All fields can be updated.
```ts
// Request body
{
  "id": "clx456...",
  "title": "Updated Title",
  "content": "updated content",
  "folderId": "clx789...",    // can move to different folder
  "language": "typescript"
}

// Response: 200 + updated snippet object
```

#### `DELETE /api/snippets`
Deletes a single snippet.
```ts
// Request body
{ "id": "clx456..." }

// Response: 200 + { message: "Snippet deleted" }
```

---

### Metadata API — `src/app/api/metadata/route.ts`

#### `GET /api/metadata?url=https://example.com`
Fetches a URL server-side, extracts `<title>` tag, returns it.
```ts
// Implementation details
1. Extract `url` from searchParams
2. Validate format: new URL(url) — catch TypeError for invalid
3. Fetch with AbortController timeout (5 seconds)
4. Set User-Agent header to avoid bot blocks
5. Parse HTML with cheerio: $('title').text()
6. Return { title: extractedTitle.trim() }

// Edge cases handled
- Invalid URL → { title: "" }
- Timeout → { title: "" }
- Network error → { title: "" }
- No <title> tag → { title: "" }
- Title too long → truncate to 200 chars

// NEVER throw or return 500 — always return { title: "" } on failure
// This ensures snippet creation is never blocked by metadata fetch issues
```

---

## 🏗️ Build Phases (execute in order)

### Phase 1 — Project Setup
- [x] Plan architecture and create roadmap
- [x] Run `npx create-next-app@latest . --yes` (in snippet-manager directory)
- [x] Verify dev server starts: `npm run dev` → http://localhost:3000
- [x] Install runtime deps: `npm i @prisma/client cheerio next-themes sonner lucide-react`
- [x] Install dev deps: `npm i -D prisma`
- [x] Initialize Prisma: `npx prisma init`
- [x] Write Prisma schema (Folder + Snippet models as specified above)
- [x] Create `.env` with `DATABASE_URL=postgresql://...?sslmode=require`
- [x] Push schema to Neon: `npx prisma db push`
- [x] Create `lib/prisma.ts` with singleton pattern
- [x] Add `"postinstall": "prisma generate"` to package.json scripts
- [x] Verify: DB tables created and tested with seed data
- [x] **CHECKPOINT: Project scaffolded, DB connected, schema synced.**

### Phase 2 — API Routes
- [x] Create `app/api/folders/route.ts`
  - [x] GET: return all folders with `_count.snippets`, sorted by name
  - [x] POST: create folder, validate name non-empty
  - [x] PUT: update folder name by id
  - [x] DELETE: delete folder by id (cascade)
- [x] Create `app/api/snippets/route.ts`
  - [x] GET: return snippets, optional `folderId` filter, sorted by `createdAt desc`
  - [x] POST: create snippet, validate title + folderId required
  - [x] PUT: update snippet by id
  - [x] DELETE: delete snippet by id
- [x] Create `app/api/metadata/route.ts`
  - [x] GET: fetch URL, extract `<title>` with cheerio, 5s timeout
  - [x] Always return `{ title: "" }` on any failure
- [x] Test all endpoints: create folder → create snippet → read → update → delete
- [x] **CHECKPOINT: Backend complete. All 3 API route files work.**

### Phase 3 — Dashboard Layout + Theme
- [x] Update `app/layout.tsx`:
  - [x] Add `suppressHydrationWarning` to `<html>`
  - [x] Wrap children with ThemeProvider from `next-themes` (`attribute="class"`, `defaultTheme="dark"`)
  - [x] Add `<Toaster />` from sonner
  - [x] Set metadata: title "SnippetVault", description
- [x] Update `app/globals.css`:
  - [x] Keep Tailwind directives
  - [x] Add dark mode custom variant for Tailwind v4
  - [x] Add custom scrollbar styles (thin, subtle)
- [x] Create `components/theme-toggle.tsx`:
  - [x] Sun/Moon icon button
  - [x] Use `useTheme()` from next-themes
  - [x] Add `mounted` state check to prevent hydration mismatch
- [x] Update `app/page.tsx` as the dashboard shell:
  - [x] `"use client"` — entire dashboard is client-rendered
  - [x] Two-panel layout: sidebar (w-72 fixed) + main content (flex-1)
  - [x] Top bar with search bar, theme toggle
  - [x] All state managed here: selectedFolderId, searchQuery, snippets, folders
- [x] **CHECKPOINT: Dashboard shell renders. Theme toggle works. Layout looks right.**

### Phase 4 — Sidebar + Folder Management
- [x] Create `components/sidebar.tsx`:
  - [x] Header: app icon/logo + "SnippetVault" label
  - [x] "All Snippets" option at top (selectedFolderId = null)
  - [x] List of folder items
  - [x] "+ New Folder" button at bottom
  - [x] Selected folder has highlighted background
  - [x] Snippet count badge on each folder
- [x] Create `components/folder-item.tsx`:
  - [x] Folder icon + name + count
  - [x] Hover: show rename (pencil) and delete (trash) icons
  - [x] Rename: inline edit mode — click pencil → name becomes input → Enter to save, Escape to cancel
  - [x] Delete: click trash → confirmation dialog → delete
- [x] Create custom hook `hooks/use-folders.ts`:
  - [x] `folders`: array state
  - [x] `loading`: boolean
  - [x] `fetchFolders()`: GET /api/folders → set state
  - [x] `createFolder(name)`: POST /api/folders → refetch
  - [x] `updateFolder(id, name)`: PUT /api/folders → refetch
  - [x] `deleteFolder(id)`: DELETE /api/folders → refetch
  - [x] Auto-fetch on mount with `useEffect`
- [x] Wire everything together in `page.tsx`
- [x] **CHECKPOINT: Can create, rename, delete folders. Sidebar shows counts.**

### Phase 5 — Snippet Grid + CRUD
- [x] Create `components/snippet-card.tsx`:
  - [x] Card layout: title (bold, truncated), content preview (3 lines, truncated), language badge (top-right corner)
  - [x] Bottom row: relative date on left, action icons on right
  - [x] Action icons (visible on hover): edit (pencil), copy (clipboard), delete (trash)
  - [x] If snippet has URL: show link icon next to title, opens URL in new tab
  - [x] Dark mode + Light mode styling
- [x] Create `components/snippet-grid.tsx`:
  - [x] CSS Grid: responsive columns with gap-4
  - [x] Receives filtered snippets as prop
  - [x] Shows header: "FolderName — X snippets"
  - [x] "+ New Snippet" button in header area
  - [x] Empty state when no snippets: icon + message
- [x] Create `components/snippet-modal.tsx`:
  - [x] Full-screen overlay with centered modal (max-w-2xl)
  - [x] URL field with auto-fetch + spinner
  - [x] Title field (auto-filled from URL fetch)
  - [x] Content textarea (6 rows)
  - [x] Folder dropdown + Language dropdown
  - [x] Cancel + Save buttons
  - [x] Edit mode: pre-fill all fields
  - [x] Create mode: empty fields, folder = current
- [x] Create custom hook `hooks/use-snippets.ts`:
  - [x] `snippets`, `loading`, `fetchSnippets`, `createSnippet`, `updateSnippet`, `deleteSnippet`
  - [x] Re-fetch when `selectedFolderId` changes
- [x] Wire URL field to metadata API with auto-fill
- [x] Wire delete: confirmation → API call → refetch → toast
- [x] Wire copy: clipboard → toast "Copied!"
- [x] **CHECKPOINT: Full CRUD for both folders and snippets. URL auto-fetch works. Copy works.**

### Phase 6 — Search
- [x] Create `components/search-bar.tsx`:
  - [x] Magnifying glass icon + text input
  - [x] Placeholder: "Search snippets..."
  - [x] On change: update `searchQuery` state in parent (page.tsx)
  - [x] Clear button (X) when query is non-empty
  - [x] `Ctrl+K` keyboard hint badge
- [x] Filtering logic (in `page.tsx` via `useMemo`):
  - [x] When `searchQuery` is set: fetch ALL snippets, filter client-side
  - [x] Match title OR content (case-insensitive)
  - [x] Show result count: "Results for 'query'"
  - [x] When search is cleared: go back to showing current folder's snippets
- [x] **CHECKPOINT: Search filters across all snippets in real-time.**

### Phase 7 — Loading States + Error Handling + Polish
- [x] Loading skeletons:
  - [x] Snippet grid: 6 skeleton cards (pulse animation)
  - [x] Show skeletons on initial load and when switching folders
- [x] Error handling:
  - [x] Wrap all API calls in try/catch in hooks
  - [x] On error: `toast.error(...)` (sonner)
  - [x] On success: `toast.success(...)` (sonner)
- [x] Empty states:
  - [x] No snippets in folder: icon + message
  - [x] No search results: icon + message
- [x] Responsive mobile:
  - [x] Sidebar: hidden by default on `<md` screens
  - [x] Hamburger button in top-left to toggle sidebar
  - [x] Sidebar slides in as overlay on mobile (with backdrop)
  - [x] Snippet grid: single column on mobile
- [x] Keyboard shortcuts:
  - [x] `Ctrl+K`: focus search bar
  - [x] `Escape`: close modal, close mobile sidebar
- [x] **CHECKPOINT: App feels polished and production-ready.**

### Phase 8 — Deploy
- [x] Initialize git + commit
- [x] Push to GitHub: https://github.com/slubbles/snippet-manager
- [x] Import to Vercel + connect Neon
- [x] Deploy → verify live URL
- [x] Test all features on live URL:
  - [x] Create folder
  - [x] Create snippet
  - [x] URL auto-fetch
  - [x] Edit snippet
  - [x] Delete snippet
  - [x] Delete folder (cascade)
  - [x] Search
  - [x] Theme toggle
  - [x] Mobile responsive
- [x] **CHECKPOINT: Live URL works. Submission-ready.**

### Phase 9 — Exceed Expectations
- [ ] Syntax highlighting: use `highlight.js` with auto-detection
- [x] Favicon: SVG code bracket icon
- [ ] OG meta tags: title, description, image for social sharing
- [x] README.md: project description, tech stack, setup instructions, "What I'd do next" section
- [ ] Drag-and-drop: move snippets between folders (stretch)
- [ ] Export: download all snippets as JSON (stretch)

---

## 🧩 Package List (exact deps)

### Dependencies (installed via `npm i`)
```
@prisma/client    — Prisma ORM client (auto-generated)
cheerio           — HTML parser for URL title extraction
next-themes       — Dark/light mode with SSR support
sonner            — Toast notifications
lucide-react      — Icon library (tree-shakable)
```

### Dev Dependencies (installed via `npm i -D`)
```
prisma            — Prisma CLI for migrations, generate, studio
```

### Already included by `create-next-app --yes`
```
next, react, react-dom
typescript, @types/node, @types/react, @types/react-dom
tailwindcss, postcss
eslint, eslint-config-next (or biome)
```

Total extra packages: **5 runtime + 1 dev** — deliberately minimal.

---

## 🎨 UI Specifications

### Layout Dimensions
```
┌─────────────────────────────────────────────────┐
│  Top Bar (h-14)    [☰] [🔍 Search...] [🌙]     │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │  Main Content Area                   │
│ (w-72)   │                                      │
│          │  ┌──────┐ ┌──────┐ ┌──────┐         │
│ Folders  │  │ Card │ │ Card │ │ Card │         │
│ ────────-│  └──────┘ └──────┘ └──────┘         │
│ 📁 All   │  ┌──────┐ ┌──────┐ ┌──────┐         │
│ 📁 JS    │  │ Card │ │ Card │ │ Card │         │
│ 📁 React │  └──────┘ └──────┘ └──────┘         │
│ 📁 DevOps│                                      │
│          │                                      │
│ [+ New]  │                       [+ New Snippet]│
└──────────┴──────────────────────────────────────┘
```

- Sidebar: `w-72` (288px), fixed left, full height, scrollable, border-right
- Main content: `flex-1`, padding `p-6`, scrollable
- Top bar: `h-14`, sticky top, flex row, items-center
- Cards: min-height `160px`, rounded-xl, p-4
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` gap-4
- Mobile breakpoint: `md:` (768px) — sidebar hidden below this

### Color Tokens (Dark Mode — default)
```
Background:      zinc-950  (#09090b)
Sidebar:         zinc-900  (#18181b)
Card:            zinc-800/50 with border zinc-700/50
Card hover:      zinc-800 with border zinc-600
Top bar:         zinc-900/80 + backdrop-blur
Primary text:    zinc-50   (#fafafa)
Secondary text:  zinc-400  (#a1a1aa)
Muted text:      zinc-500  (#71717a)
Accent:          blue-500  (#3b82f6)
Accent hover:    blue-400  (#60a5fa)
Danger:          red-500   (#ef4444)
Danger hover:    red-400   (#f87171)
Border:          zinc-800  (#27272a)
Input bg:        zinc-800  (#27272a)
Input border:    zinc-700  (#3f3f46)
Input focus:     ring-blue-500/50
```

### Color Tokens (Light Mode)
```
Background:      gray-50   (#f9fafb)
Sidebar:         white     (#ffffff)
Card:            white with border gray-200
Card hover:      gray-50 with border gray-300
Top bar:         white/80 + backdrop-blur
Primary text:    gray-900  (#111827)
Secondary text:  gray-500  (#6b7280)
Muted text:      gray-400  (#9ca3af)
Accent:          blue-600  (#2563eb)
Accent hover:    blue-500  (#3b82f6)
Danger:          red-600   (#dc2626)
Danger hover:    red-500   (#ef4444)
Border:          gray-200  (#e5e7eb)
Input bg:        white     (#ffffff)
Input border:    gray-300  (#d1d5db)
Input focus:     ring-blue-500/50
```

### Component Visual Detail

#### Folder Item (`folder-item.tsx`)
```
Normal state:
┌──────────────────────────────┐
│ 📁  JavaScript          (12)│
└──────────────────────────────┘

Hover state:
┌──────────────────────────────┐
│ 📁  JavaScript      ✏️ 🗑️ (12)│
└──────────────────────────────┘
  - bg changes to zinc-800 (dark) / gray-100 (light)
  - edit + delete icons fade in on right

Selected state:
┌──────────────────────────────┐
│ 📁  JavaScript          (12)│  ← bg-blue-500/10, text-blue-500, left border accent
└──────────────────────────────┘

Rename mode:
┌──────────────────────────────┐
│ 📁  [JavaScript________]    │  ← input replaces text, auto-focused, auto-selected
└──────────────────────────────┘
  - Enter: save + exit
  - Escape: cancel + exit
  - Click outside: save + exit
```

#### Snippet Card (`snippet-card.tsx`)
```
┌─────────────────────────────────┐
│                      [JS]       │  ← language badge, rounded pill
│                                 │
│  Array Unique Filter       🔗  │  ← title (bold), link icon if URL
│                                 │
│  const unique = [...new Set(    │  ← content preview (3 lines max)
│  arr)]; // removes duplicates   │     text-sm, text-secondary, mono
│  console.log(unique);           │     font if language is set
│                                 │
│  2 hours ago      ✏️  📋  🗑️   │  ← relative time + actions
└─────────────────────────────────┘

Hover: subtle lift + border change
Actions: opacity-0 group-hover:opacity-100 transition
Card click: could open detail/edit view (or just use edit icon)
Link icon: opens URL in new tab
Copy icon: copies content to clipboard → toast "Copied!"
```

#### Snippet Modal (`snippet-modal.tsx`)
```
┌─────────────────────────────────────────┐
│           Create New Snippet            │  ← or "Edit Snippet"
│  ───────────────────────────────────    │
│                                         │
│  URL (optional)                         │
│  ┌─────────────────────────────── ⟳ ┐  │  ← spinner when fetching
│  │ https://react.dev/learn...        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Title                                  │
│  ┌───────────────────────────────────┐  │
│  │ Thinking in React – React        │  │  ← auto-filled from URL
│  └───────────────────────────────────┘  │
│                                         │
│  Content                                │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │  ← textarea, min 6 rows
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Folder              Language           │  ← side by side on desktop
│  ┌──────────────┐   ┌──────────────┐   │
│  │ JavaScript ▾ │   │ None       ▾ │   │
│  └──────────────┘   └──────────────┘   │
│                                         │
│              [Cancel]   [Save]          │
└─────────────────────────────────────────┘

- Backdrop: bg-black/50, click to close
- Modal: rounded-2xl, p-6, max-w-2xl, centered
- Save button: bg-blue-500, text-white, rounded-lg
- Cancel button: ghost style, text-secondary
- Form validation: inline red text below invalid fields
- Animate in: fade + slight scale
```

### Language Options for Dropdown
```ts
const LANGUAGES = [
  { value: '', label: 'None' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'other', label: 'Other' },
]
```

---

## ⚠️ Error Handling Strategy

| Scenario | Where | Handling |
|----------|-------|----------|
| API route DB error | Server | Log error, return `{ error: "message" }` + HTTP 500 |
| API validation error | Server | Return `{ error: "Name is required" }` + HTTP 400 |
| Network failure | Client hook | `toast.error("Something went wrong. Try again.")` |
| Empty folder selected | Client UI | Show friendly empty state SVG + "No snippets yet" |
| No folders exist | Client UI | Show "Create your first folder" prompt |
| URL fetch fails | Server metadata API | Return `{ title: "" }` — never throw, never block |
| URL fetch timeout | Server metadata API | AbortController after 5s → return `{ title: "" }` |
| Invalid URL in modal | Client UI | Inline validation: red border + "Enter a valid URL" |
| Delete folder | Client UI | Confirmation dialog: "Delete 'JavaScript' and all 12 snippets?" |
| Delete snippet | Client UI | Confirmation dialog: "Delete 'Array Filter'? This can't be undone." |
| Clipboard API blocked | Client | `toast.error("Clipboard access denied")` — fallback: select text |

### Toast Patterns (sonner)
```ts
// Success after CRUD
toast.success("Folder created")
toast.success("Snippet saved")
toast.success("Copied to clipboard!")

// Error on failure
toast.error("Failed to delete folder")
toast.error("Something went wrong")

// Loading state for async ops
const id = toast.loading("Fetching page title...")
// later:
toast.dismiss(id)
```

---

## 🔄 State Management Architecture

All state lives in `page.tsx` (dashboard) and flows down as props. No global state library needed.

```
page.tsx (state owner)
├── selectedFolderId: string | null     ← which folder is active (null = All)
├── searchQuery: string                 ← current search text
├── folders: Folder[]                   ← from useFolders hook
├── snippets: Snippet[]                 ← from useSnippets hook
├── foldersLoading: boolean
├── snippetsLoading: boolean
├── modalOpen: boolean                  ← create/edit modal visibility
├── editingSnippet: Snippet | null      ← null = create mode, Snippet = edit mode
├── mobileSidebarOpen: boolean          ← mobile sidebar toggle
│
├── Sidebar (props: folders, selectedFolderId, onSelectFolder, onCreateFolder, ...)
├── SearchBar (props: searchQuery, onSearchChange)
├── ThemeToggle ()
├── SnippetGrid (props: filteredSnippets, loading, onEdit, onDelete, onCopy)
└── SnippetModal (props: open, editingSnippet, folders, onClose, onSave)
```

### Data Flow for Key Actions

**Selecting a folder:**
1. User clicks folder in sidebar
2. `setSelectedFolderId(folderId)`
3. `useSnippets` hook re-fetches with new `folderId`
4. Grid re-renders with new snippets

**Searching:**
1. User types in search bar
2. `setSearchQuery(text)`
3. If query non-empty: fetch ALL snippets (no folder filter), filter client-side
4. If query empty: revert to showing selected folder's snippets
5. Filtering is a `useMemo` over snippets array

**Creating a snippet:**
1. User clicks "+ New Snippet"
2. `setEditingSnippet(null)` + `setModalOpen(true)`
3. Modal opens in create mode (empty fields)
4. User fills form, pastes URL → title auto-fills
5. User hits Save → POST /api/snippets
6. `useSnippets.createSnippet(data)` → refetch → grid updates
7. `setModalOpen(false)` → toast "Snippet saved!"

---

## 🚀 Deployment Checklist

- [ ] `package.json` has `"postinstall": "prisma generate"`
- [ ] `.env` is in `.gitignore` (not committed)
- [ ] `.env.example` exists with placeholder: `DATABASE_URL=postgresql://...`
- [ ] `DATABASE_URL` is set in Vercel → Settings → Environment Variables → all environments
- [ ] Local build works: `npm run build` succeeds with no errors
- [ ] All API routes return proper JSON (no HTML error pages)
- [ ] No `console.log` left in production code (only `console.error` in catches)
- [ ] README.md includes: project description, live URL, GitHub link, tech stack, setup steps

---

## 📝 What's Needed From the User

1. **Neon Database URL**: Create a free project at https://neon.tech → Dashboard → Connection Details → copy the `postgresql://...?sslmode=require` string
2. **GitHub Repo**: To push code and connect to Vercel for auto-deploy
3. **Vercel Account**: vercel.com → sign in with GitHub → import repo → set env var

No tokens or API keys needed in advance. Everything is configured via dashboards.

---

## 🔄 Status Tracker

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Setup | ✅ Done | Scaffolded, deps, schema, DB synced |
| Phase 2 — API | ✅ Done | All 3 routes with full CRUD + validation |
| Phase 3 — Layout + Theme | ✅ Done | ThemeProvider, dark mode, Toaster |
| Phase 4 — Sidebar + Folders | ✅ Done | Create, rename, delete, counts |
| Phase 5 — Snippet Grid + CRUD | ✅ Done | Cards, grid, modal, URL fetch, copy |
| Phase 6 — Search | ✅ Done | Client-side filter, Ctrl+K shortcut |
| Phase 7 — Polish | ✅ Done | Skeletons, toasts, empty states, mobile |
| Phase 8 — Deploy | ✅ Done | Live on Vercel + Neon |
| Phase 9 — Extras | 🟡 Partial | Favicon + README done, syntax highlighting skipped |
# ROADMAP.md — Snippet Manager

> **This file is the single source of truth.**
> Copilot MUST read this before every response to stay aligned.
> Last updated: 2026-04-10

---

## 🎯 Project Goal

Build and deploy a **Personal Knowledge Base** (snippet manager) where users can save links, code snippets, or notes — organized in folders with full CRUD, URL auto-fetch, search, and theming.

---

## 📐 Architecture Decisions & Rationale

### Stack Choices

| Layer | Choice | Why | Risk / Gotcha |
|-------|--------|-----|---------------|
| **Framework** | Next.js 16 (App Router) | Required by challenge. Latest stable (16.2). Turbopack is default bundler. | Params are async in dynamic routes. |
| **Styling** | Tailwind CSS | Required by challenge. Ships with `create-next-app`. | Dark mode needs `class` strategy + next-themes. |
| **Database** | Neon PostgreSQL (free) | Serverless, cloud-hosted, scales to zero, 0.5 GB free storage, 100 CU-hrs/mo. | Cold start ~500ms after idle. Connection string needs `?sslmode=require`. |
| **ORM** | Prisma | Type-safe queries, auto-generated client, easy migrations, Prisma Studio for debugging. | Must use singleton pattern in dev. Must `prisma generate` before Vercel build. |
| **URL Scraping** | `cheerio` | Lightweight HTML parser (~200KB). No headless browser overhead. | Some SPAs won't have title in initial HTML. That's acceptable. |
| **Theming** | `next-themes` | 3KB, handles SSR hydration, localStorage persistence. | Must add `suppressHydrationWarning` to `<html>`. |
| **Toasts** | `sonner` | 5KB, beautiful defaults, works with Next.js. | None. |
| **Deployment** | Vercel | Zero-config for Next.js, free tier, auto-deploy from GitHub. | Need `DATABASE_URL` in env vars. |

### Why NOT These Alternatives

| Alternative | Why Skipped |
|-------------|-------------|
| MongoDB Atlas | No relational integrity for folder→snippet. PostgreSQL is better for this schema. |
| Supabase | Great but adds auth complexity we don't need. Neon is simpler for DB-only. |
| Drizzle ORM | Good but Prisma has better DX for rapid prototyping (Studio, migrations). |
| Server Actions | Could work, but API routes are clearer for CRUD and easier to test/debug. |
| tRPC | Overkill for 3 endpoints. Plain fetch + route handlers is simpler. |

---

## 📊 Data Model

```prisma
model Folder {
  id        String    @id @default(cuid())
  name      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  snippets  Snippet[]
}

model Snippet {
  id        String   @id @default(cuid())
  title     String
  content   String
  url       String?
  language  String?  // For syntax highlighting
  folderId  String
  folder    Folder   @relation(fields: [folderId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([folderId])
}
```

**Key decisions:**
- `cuid()` for IDs (URL-safe, sortable, no collisions)
- `onDelete: Cascade` — deleting a folder deletes its snippets (expected UX)
- `@@index([folderId])` — fast queries when filtering snippets by folder
- `language` is optional — only used for code snippets, not notes/links
- `url` is optional — only present for bookmark-type snippets

---

## 🔌 API Design

### `GET /api/folders`
Returns all folders with snippet count.
```json
[{ "id": "...", "name": "JavaScript", "_count": { "snippets": 12 } }]
```

### `POST /api/folders`
Body: `{ "name": "React Patterns" }`
Creates a new folder.

### `PUT /api/folders`
Body: `{ "id": "...", "name": "Updated Name" }`
Renames a folder.

### `DELETE /api/folders`
Body: `{ "id": "..." }`
Deletes folder + all its snippets (cascade).

---

### `GET /api/snippets?folderId=xxx&search=yyy`
Returns snippets. Optional filters:
- `folderId` — filter by folder (omit for "All")
- `search` — server-side search across title+content (for initial load; client filters after)

### `POST /api/snippets`
Body: `{ "title": "...", "content": "...", "folderId": "...", "url?": "...", "language?": "..." }`

### `PUT /api/snippets`
Body: `{ "id": "...", "title": "...", "content": "...", "folderId": "...", "language?": "..." }`

### `DELETE /api/snippets`
Body: `{ "id": "..." }`

---

### `GET /api/metadata?url=https://example.com`
Fetches the URL, extracts `<title>` tag, returns `{ "title": "Page Title" }`.
- 5-second timeout
- Validate URL format
- Return `{ "title": "" }` on failure (don't error)

---

## 🏗️ Build Phases (execute in order)

### Phase 1 — Project Setup
- [x] Plan architecture and create roadmap
- [ ] Run `npx create-next-app@latest snippet-manager --yes`
- [ ] Install deps: `prisma @prisma/client cheerio next-themes sonner`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Configure `prisma/schema.prisma` with Folder + Snippet models
- [ ] Create `.env` with `DATABASE_URL` (Neon connection string)
- [ ] Run `npx prisma db push` to sync schema with Neon
- [ ] Create `src/lib/prisma.ts` singleton
- [ ] Verify: Prisma Studio shows tables → `npx prisma studio`

### Phase 2 — API Routes
- [ ] Create `src/app/api/folders/route.ts` (GET, POST, PUT, DELETE)
- [ ] Create `src/app/api/snippets/route.ts` (GET, POST, PUT, DELETE)
- [ ] Create `src/app/api/metadata/route.ts` (GET with URL param)
- [ ] Test all endpoints via browser/curl
- [ ] **Checkpoint: Backend complete. All CRUD works.**

### Phase 3 — Dashboard Layout
- [ ] Set up `layout.tsx` with ThemeProvider, font, metadata
- [ ] Build sidebar component (folder list, selected state, + New Folder)
- [ ] Build main content area shell (header bar + grid area)
- [ ] Wire sidebar to folder API (fetch, create, rename, delete)
- [ ] **Checkpoint: Can create/manage folders in the UI.**

### Phase 4 — Snippet CRUD UI
- [ ] Build snippet card component (title, preview, language badge, actions)
- [ ] Build snippet grid (responsive, filtered by selected folder)
- [ ] Build create/edit modal (form with title, content, URL field, folder selector, language picker)
- [ ] Wire URL field → auto-fetch title from `/api/metadata`
- [ ] Wire modal to snippet API (create, update)
- [ ] Add delete confirmation dialog
- [ ] **Checkpoint: Full CRUD for both folders and snippets works in UI.**

### Phase 5 — Search + Theme
- [ ] Add search bar in header
- [ ] Implement client-side real-time filtering (title + content match)
- [ ] Add dark/light toggle using next-themes
- [ ] Configure Tailwind dark mode classes
- [ ] **Checkpoint: All core requirements met.**

### Phase 6 — Polish
- [ ] Add loading skeletons for folders and snippets
- [ ] Add error handling with toast notifications (sonner)
- [ ] Add empty states (no folders, no snippets, no search results)
- [ ] Add responsive mobile layout (collapsible sidebar)
- [ ] **Checkpoint: Production-ready feel.**

### Phase 7 — Deploy
- [ ] Initialize git repo + push to GitHub
- [ ] Connect repo to Vercel
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Add `"postinstall": "prisma generate"` to package.json
- [ ] Deploy and verify live URL works
- [ ] **Checkpoint: Submission-ready (live URL + GitHub repo).**

### Phase 8 — Exceed Expectations (if time allows)
- [ ] Syntax highlighting on code snippets (highlight.js or Prism)
- [ ] Copy-to-clipboard button on snippet cards
- [ ] Keyboard shortcuts (Ctrl+K search, Ctrl+N new snippet)
- [ ] Favicon + OG meta tags
- [ ] README with screenshots, tech stack, and "what's next" section
- [ ] Drag-and-drop snippet reordering or folder moving

---

## 🧩 Package List (exact deps)

### Dependencies
```
next (comes with create-next-app)
react (comes with create-next-app)
react-dom (comes with create-next-app)
@prisma/client
next-themes
sonner
cheerio
```

### Dev Dependencies
```
prisma
typescript (comes with create-next-app)
tailwindcss (comes with create-next-app)
@types/node (comes with create-next-app)
@types/react (comes with create-next-app)
```

Total extra packages: **4 runtime + 1 dev** — deliberately minimal.

---

## 🎨 UI Specifications

### Layout
- Sidebar: 280px wide, fixed left, scrollable, dark surface
- Main: remaining width, scrollable content area
- Top bar: search input (centered/left), theme toggle (right)
- Mobile: sidebar collapses to hamburger menu

### Color Tokens (Dark Mode)
- Background: `zinc-950` (#09090b)
- Sidebar surface: `zinc-900` (#18181b)
- Card surface: `zinc-800` (#27272a)
- Card hover: `zinc-700` (#3f3f46)
- Primary text: `zinc-50` (#fafafa)
- Secondary text: `zinc-400` (#a1a1aa)
- Accent/active: `blue-500` (#3b82f6)
- Danger: `red-500` (#ef4444)

### Color Tokens (Light Mode)
- Background: `gray-50` (#f9fafb)
- Sidebar surface: `white` (#ffffff)
- Card surface: `white` (#ffffff) with border
- Card hover: `gray-50` (#f9fafb)
- Primary text: `gray-900` (#111827)
- Secondary text: `gray-500` (#6b7280)
- Accent/active: `blue-600` (#2563eb)
- Danger: `red-600` (#dc2626)

### Components Spec
- **Folder item**: icon + name + snippet count + hover actions (rename/delete)
- **Snippet card**: title (bold), first 3 lines of content (truncated), language badge (top-right), date (bottom-left), actions (bottom-right: edit, copy, delete)
- **Modal**: centered overlay, max-w-lg, form fields stacked, URL field with fetch indicator
- **Search bar**: magnifying glass icon, debounced input, shows result count
- **Theme toggle**: sun/moon icon, smooth transition

---

## ⚠️ Error Handling Strategy

| Scenario | Handling |
|----------|----------|
| API route throws | Return `{ error: message }` with appropriate HTTP status |
| Network failure (client) | Show toast: "Something went wrong. Try again." |
| Empty folder | Show friendly empty state: "No snippets yet. Create your first one!" |
| URL fetch fails | Silently return empty title — don't block snippet creation |
| Invalid URL format | Show inline validation: "Please enter a valid URL" |
| Delete confirmation | Modal: "Are you sure? This can't be undone." |

---

## 🚀 Deployment Checklist

- [ ] `package.json` has `"postinstall": "prisma generate"`
- [ ] `.env` is NOT committed (in `.gitignore`)
- [ ] `DATABASE_URL` is set in Vercel dashboard → Settings → Environment Variables
- [ ] Build succeeds: `npm run build` works locally
- [ ] All API routes return proper JSON responses
- [ ] No `console.log` left in production code
- [ ] README.md includes: description, tech stack, live URL, setup instructions

---

## 📝 What's Needed From the User

1. **Neon Database URL**: Create a free Neon project at https://neon.tech → copy the connection string
2. **Vercel Account**: For deployment (can use GitHub login)
3. **GitHub Repo**: To push code and connect to Vercel

No Vercel token needed — we'll deploy via the Vercel dashboard (connect GitHub repo → auto-deploy). This is simpler and more reliable than CLI deployment.

---

## 🔄 Status Tracker

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Setup | 🟡 In Progress | Roadmap done, project scaffold next |
| Phase 2 — API | ⬜ Not Started | |
| Phase 3 — Layout | ⬜ Not Started | |
| Phase 4 — Snippet CRUD | ⬜ Not Started | |
| Phase 5 — Search + Theme | ⬜ Not Started | |
| Phase 6 — Polish | ⬜ Not Started | |
| Phase 7 — Deploy | ⬜ Not Started | |
| Phase 8 — Extras | ⬜ Not Started | |
