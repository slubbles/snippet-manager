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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search snippets..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-black/15 bg-white pl-9 pr-14 text-[14px] leading-[23.8px] text-black placeholder-black/40 outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-black dark:focus:border-white"
        />
        {query ? (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-black/40 hover:text-black/70 dark:hover:text-white/80"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded border border-black/15 bg-black/5 px-1.5 py-0.5 text-[10px] font-medium text-black/40 sm:flex dark:border-white/15 dark:bg-white/10 dark:text-white/60">
            Ctrl K
          </kbd>
        )}
      </div>
    )
  }
)
