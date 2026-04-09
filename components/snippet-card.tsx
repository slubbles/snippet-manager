'use client'

import { ExternalLink, Pencil, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Snippet {
  id: string
  title: string
  content: string
  url: string | null
  language: string | null
  folderId: string
  createdAt: string
}

interface SnippetCardProps {
  snippet: Snippet
  onEdit: () => void
  onDelete: () => void
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Clipboard access denied')
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:hover:border-zinc-600">
      {/* Language badge */}
      {snippet.language && (
        <span className="absolute right-3 top-3 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-500">
          {snippet.language}
        </span>
      )}

      {/* Title */}
      <div className="mb-2 flex items-center gap-1.5 pr-16">
        <h3 className="text-sm font-semibold truncate">{snippet.title}</h3>
        {snippet.url && (
          <a
            href={snippet.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-blue-500 hover:text-blue-400"
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Content preview */}
      <p
        className={`mb-4 flex-1 text-xs leading-relaxed text-gray-500 dark:text-zinc-400 line-clamp-3 ${
          snippet.language ? 'font-mono' : ''
        }`}
      >
        {snippet.content || 'No content'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400 dark:text-zinc-500">
          {timeAgo(snippet.createdAt)}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleCopy}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
