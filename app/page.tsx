import Link from 'next/link'
import { Code2, Folder, Search, Moon, Zap, ExternalLink } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
            <Code2 size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold">SnippetVault</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
            <Zap size={14} className="text-blue-500" />
            <span className="text-gray-600 dark:text-zinc-400">Your personal knowledge base</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Save, organize, and find
            <span className="text-blue-500"> code snippets</span> instantly
          </h1>
          <p className="mb-8 text-lg text-gray-500 dark:text-zinc-400 sm:text-xl">
            Stop losing useful links, code, and notes. SnippetVault keeps everything
            organized in folders with real-time search and auto-title fetching.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 hover:shadow-blue-500/40 transition-all"
            >
              Start for free
            </Link>
          </div>
        </div>
      </main>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Folder size={24} />}
            title="Folder System"
            description="Organize snippets into folders. Rename, delete, or move them anytime."
          />
          <FeatureCard
            icon={<ExternalLink size={24} />}
            title="URL Auto-Fetch"
            description="Paste a link and we'll grab the page title automatically."
          />
          <FeatureCard
            icon={<Search size={24} />}
            title="Instant Search"
            description="Filter all snippets in real-time as you type. Ctrl+K to jump in."
          />
          <FeatureCard
            icon={<Moon size={24} />}
            title="Dark & Light"
            description="Switch themes with one click. Your preference is remembered."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-6 text-center text-sm text-gray-400 dark:border-zinc-800 dark:text-zinc-500">
        Built with Next.js, Tailwind CSS, and Neon PostgreSQL
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300 dark:border-zinc-700/50 dark:hover:border-zinc-600">
      <div className="mb-3 text-blue-500">{icon}</div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}
