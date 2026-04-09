'use client'

import { Plus, FileText } from 'lucide-react'
import { SnippetCard } from './snippet-card'

interface Snippet {
  id: string
  title: string
  content: string
  url: string | null
  language: string | null
  folderId: string
  createdAt: string
}

interface SnippetGridProps {
  snippets: Snippet[]
  loading: boolean
  folderName: string
  searchQuery: string
  onNewSnippet: () => void
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-[#091413]/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-[#091413]/10 dark:bg-white/10" />
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-[#091413]/10 dark:bg-white/10" />
      <div className="mb-2 h-3 w-5/6 animate-pulse rounded bg-[#091413]/10 dark:bg-white/10" />
      <div className="mb-4 h-3 w-2/3 animate-pulse rounded bg-[#091413]/10 dark:bg-white/10" />
      <div className="mt-auto h-3 w-1/4 animate-pulse rounded bg-[#091413]/10 dark:bg-white/10" />
    </div>
  )
}

export function SnippetGrid({
  snippets,
  loading,
  folderName,
  searchQuery,
  onNewSnippet,
  onEdit,
  onDelete,
}: SnippetGridProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-medium leading-[23px]">
            {searchQuery ? `Results for "${searchQuery}"` : folderName}
          </h2>
          <p className="text-[14px] font-normal leading-[23.8px] text-[#091413]/60 dark:text-white/60">
            {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onNewSnippet}
          className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[14px] font-medium leading-[23.8px] text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={16} />
          New Snippet
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && snippets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText size={48} className="mb-4 text-[#091413]/30 dark:text-white/20" />
          <h3 className="mb-1 text-[14px] font-medium leading-[23.8px] text-[#091413]/60 dark:text-white/60">
            {searchQuery ? 'No snippets match your search' : 'No snippets yet'}
          </h3>
          <p className="text-[14px] font-normal leading-[23.8px] text-[#091413]/40 dark:text-white/40">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first snippet to get started'}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && snippets.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={() => onEdit(snippet)}
              onDelete={() => onDelete(snippet.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
