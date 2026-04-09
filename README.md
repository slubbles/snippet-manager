# Snip Labs

A **Personal Knowledge Base** for saving links, code snippets, and notes. Organized in folders with full CRUD, URL auto-fetch, real-time search, syntax highlighting, and dark/light theming.

## Live Demo

**[snippet-manager-lemon.vercel.app](https://snippet-manager-lemon.vercel.app)**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma |
| Auth | BetterAuth (email/password) |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

### Libraries
- `next-themes` for dark/light mode
- `sonner` for toast notifications
- `lucide-react` for icons
- `cheerio` for server-side URL title extraction
- `highlight.js` for syntax highlighting (17 languages)

## Features

- **Authentication** with email/password (BetterAuth), per-user data isolation
- **Folder management** with create, rename, delete, and snippet count badges
- **Snippet CRUD** with title, content, URL, language, and folder assignment
- **URL auto-fetch** that extracts page titles server-side
- **Syntax highlighting** for 17 languages (JS, TS, Python, Go, Rust, Java, C#, PHP, Ruby, SQL, HTML, CSS, JSON, Bash, Markdown, YAML, Dockerfile)
- **Real-time search** with client-side filtering across all snippets
- **Dark/light mode** toggle on every page, persistent via localStorage
- **Profile panel** with inline name editing, stats, password change, account deletion
- **Keyboard shortcuts** like Ctrl+K to focus search, Escape to close modals
- **Copy to clipboard** on every snippet card
- **Responsive design** with mobile sidebar, touch-optimized buttons
- **Loading skeletons** during data fetching

## Getting Started

```bash
git clone https://github.com/slubbles/snippet-manager.git
cd snippet-manager
npm install

# Create a .env file with your Neon DATABASE_URL
# and BETTER_AUTH_SECRET, BETTER_AUTH_URL
cp .env.example .env

npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/
    auth/[...all]/route.ts  # BetterAuth handler
    folders/route.ts         # Folder CRUD API
    snippets/route.ts        # Snippet CRUD API
    metadata/route.ts        # URL title extraction
  layout.tsx                 # Root layout (ThemeProvider, Analytics)
  page.tsx                   # Landing page
  login/page.tsx             # Auth page
  dashboard/page.tsx         # Main app (sidebar + snippets)
  profile/page.tsx           # User profile
  settings/page.tsx          # Account settings
components/
  sidebar.tsx                # Folder sidebar
  folder-item.tsx            # Individual folder
  snippet-grid.tsx           # Snippet card grid
  snippet-card.tsx           # Snippet card with syntax highlighting
  snippet-modal.tsx          # Create/Edit modal
  search-bar.tsx             # Search with Ctrl+K
  theme-toggle.tsx           # Dark/Light toggle
  theme-logo.tsx             # Dynamic logo (dark/light)
  profile-panel.tsx          # Slide-out profile panel
lib/
  prisma.ts                  # Prisma singleton
  auth.ts                    # BetterAuth server config
  auth-client.ts             # BetterAuth client
prisma/
  schema.prisma              # Database schema (6 models)
```
- **OG meta tags** — social sharing preview cards
