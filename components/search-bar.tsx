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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#091413]/40"
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search snippets..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-[#091413]/15 bg-white pl-9 pr-14 text-[14px] leading-[23.8px] text-[#091413] placeholder-[#091413]/40 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-brand-500"
        />
        {query ? (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#091413]/40 hover:text-[#091413]/70 dark:hover:text-white/80"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded border border-[#091413]/15 bg-[#091413]/5 px-1.5 py-0.5 text-[10px] font-medium text-[#091413]/40 sm:flex dark:border-white/15 dark:bg-white/10 dark:text-white/60">
            Ctrl K
          </kbd>
        )}
      </div>
    )
  }
)
