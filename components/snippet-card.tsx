'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, Pencil, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import java from 'highlight.js/lib/languages/java'
import csharp from 'highlight.js/lib/languages/csharp'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import markdown from 'highlight.js/lib/languages/markdown'
import yaml from 'highlight.js/lib/languages/yaml'
import dockerfile from 'highlight.js/lib/languages/dockerfile'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', html)
hljs.registerLanguage('xml', html)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('dockerfile', dockerfile)

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
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current && snippet.content && snippet.language) {
      codeRef.current.removeAttribute('data-highlighted')
      try {
        hljs.highlightElement(codeRef.current)
      } catch {
        // language not registered â€” leave as plain text
      }
    }
  }, [snippet.content, snippet.language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Clipboard access denied')
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-[#091413]/10 bg-white p-4 transition-all hover:border-[#091413]/15 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/15">
      {/* Language badge */}
      {snippet.language && (
        <span className="absolute right-3 top-3 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-500">
          {snippet.language}
        </span>
      )}

      {/* Title */}
      <div className="mb-2 flex items-center gap-1.5 pr-16">
        <h3 className="text-[14px] font-medium leading-[23.8px] truncate">{snippet.title}</h3>
        {snippet.url && (
          <a
            href={snippet.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 p-1 text-brand-500 hover:text-brand-200"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Content preview */}
      {snippet.content ? (
        snippet.language ? (
          <pre className="mb-4 flex-1 overflow-hidden rounded-md bg-[#091413]/[0.03] p-2 text-[11px] leading-relaxed dark:bg-[#091413]/60">
            <code
              ref={codeRef}
              className={`language-${snippet.language} !bg-transparent line-clamp-4`}
            >
              {snippet.content}
            </code>
          </pre>
        ) : (
          <p className="mb-4 flex-1 text-[12px] font-normal leading-[20.4px] text-[#091413]/60 dark:text-white/60 line-clamp-3">
            {snippet.content}
          </p>
        )
      ) : (
        <p className="mb-4 flex-1 text-[12px] font-normal leading-[20.4px] text-[#091413]/40 dark:text-white/40 italic line-clamp-3">
          No content
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#091413]/40 dark:text-white/40">
          {timeAgo(snippet.createdAt)}
        </span>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded p-2 text-[#091413]/40 hover:bg-[#091413]/5 hover:text-[#091413]/70 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/70"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="rounded p-2 text-[#091413]/40 hover:bg-[#091413]/5 hover:text-[#091413]/70 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/70"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-2 text-red-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
