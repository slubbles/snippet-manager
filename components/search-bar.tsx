'use client'

import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  query: string
  onChange: (query: string) => void
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ query, onChange }, ref) {
    return (
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search snippets..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-14 text-[14px] leading-[23.8px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-brand-500"
        />
        {query ? (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:flex dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            Ctrl K
          </kbd>
        )}
      </div>
    )
  }
)
