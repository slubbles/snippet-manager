# Snip Labs

A **Personal Knowledge Base** for saving links, code snippets, and notes — organized in folders with full CRUD, URL auto-fetch, real-time search, and dark/light theming.

## Live Demo

**[Snip Labs on Vercel](https://snippet-manager-lemon.vercel.app)**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL (serverless, free tier) |
| ORM | Prisma |
| Deployment | Vercel |

### Additional Libraries
- `next-themes` — Dark/light mode with SSR support
- `sonner` — Toast notifications
- `lucide-react` — Icon library
- `cheerio` — Server-side HTML parsing for URL title extraction

## Features

- **Folder Management** — Create, rename, and delete folders with snippet count badges
- **Snippet CRUD** — Create, edit, delete snippets with title, content, URL, and language
- **URL Auto-Fetch** — Paste a URL and the title is automatically extracted server-side
- **Real-Time Search** — Client-side filtering across all snippets as you type
- **Dark/Light Mode** — Toggle with persistent theme via `next-themes`
- **Responsive Design** — Mobile sidebar with hamburger toggle, single-column grid on small screens
- **Keyboard Shortcuts** — `Ctrl+K` to focus search, `Escape` to close modals
- **Copy to Clipboard** — One-click copy snippet content
- **Loading Skeletons** — Pulse animations during data fetching
- **Toast Notifications** — Success/error feedback on all operations

## Getting Started

```bash
# Clone
git clone https://github.com/slubbles/snippet-manager.git
cd snippet-manager

# Install
npm install

# Set up database
# Create a free Neon project at https://neon.tech
# Copy your connection string
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push schema
npx prisma db push

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/
    folders/route.ts     # Folder CRUD API
    snippets/route.ts    # Snippet CRUD API
    metadata/route.ts    # URL title extraction
  layout.tsx             # Root layout (ThemeProvider, fonts)
  page.tsx               # Dashboard (all state management)
  globals.css            # Tailwind + custom styles
components/
  sidebar.tsx            # Folder sidebar
  folder-item.tsx        # Individual folder (rename/delete)
  snippet-grid.tsx       # Snippet card grid + empty states
  snippet-card.tsx       # Individual snippet card
  snippet-modal.tsx      # Create/Edit modal with URL fetch
  search-bar.tsx         # Search with Ctrl+K shortcut
  theme-toggle.tsx       # Dark/Light toggle
hooks/
  use-folders.ts         # Folder state + API calls
  use-snippets.ts        # Snippet state + API calls
lib/
  prisma.ts              # Prisma singleton
prisma/
  schema.prisma          # Database schema
```

## What I'd Do Next

Given more time, I would add:

- **Syntax highlighting** for code snippets using `highlight.js` or `shiki`
- **Drag-and-drop** to move snippets between folders
- **Export/Import** — download all snippets as JSON, bulk import
- **Tags** — cross-folder labeling system alongside folders
- **Pinned snippets** — pin important snippets to the top
- **Markdown rendering** — render markdown content in snippet cards
- **OG meta tags** — social sharing preview cards
