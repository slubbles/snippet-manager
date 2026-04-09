'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

interface Snippet {
  id: string
  title: string
  content: string
  url: string | null
  language: string | null
  folderId: string
  createdAt: string
}

interface FolderData {
  id: string
  name: string
  _count: { snippets: number }
}

interface SnippetModalProps {
  open: boolean
  snippet: Snippet | null
  folders: FolderData[]
  currentFolderId: string | null
  onClose: () => void
  onSave: (data: {
    id?: string
    title: string
    content: string
    url: string
    language: string
    folderId: string
  }) => void
}

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

export function SnippetModal({
  open,
  snippet,
  folders,
  currentFolderId,
  onClose,
  onSave,
}: SnippetModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [language, setLanguage] = useState('')
  const [folderId, setFolderId] = useState('')
  const [fetchingTitle, setFetchingTitle] = useState(false)

  const isEdit = !!snippet

  useEffect(() => {
    if (open) {
      if (snippet) {
        setTitle(snippet.title)
        setContent(snippet.content)
        setUrl(snippet.url || '')
        setLanguage(snippet.language || '')
        setFolderId(snippet.folderId)
      } else {
        setTitle('')
        setContent('')
        setUrl('')
        setLanguage('')
        setFolderId(currentFolderId || folders[0]?.id || '')
      }
    }
  }, [open, snippet, currentFolderId, folders])

  const fetchTitle = async (inputUrl: string) => {
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) return
    if (title) return // Don't overwrite existing title

    setFetchingTitle(true)
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(inputUrl)}`)
      const data = await res.json()
      if (data.title && !title) {
        setTitle(data.title)
      }
    } catch {
      // Fail silently
    } finally {
      setFetchingTitle(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !folderId) return

    onSave({
      ...(snippet ? { id: snippet.id } : {}),
      title: title.trim(),
      content,
      url,
      language,
      folderId,
    })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-4 sm:p-6 shadow-xl dark:border-white/15 dark:bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[23px]">
            {isEdit ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-black/40 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL */}
          <div>
            <label className="mb-1 block text-[12px] font-normal leading-[20.4px] text-black/60 dark:text-white/60">
              URL (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => fetchTitle(url)}
                placeholder="https://example.com"
                className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
              {fetchingTitle && (
                <Loader2
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-black dark:text-white"
                />
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-[12px] font-normal leading-[20.4px] text-black/60 dark:text-white/60">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title"
              required
              className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1 block text-[12px] font-normal leading-[20.4px] text-black/60 dark:text-white/60">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your code, notes, or text here..."
              rows={6}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-[14px] leading-[23.8px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Folder + Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-normal leading-[20.4px] text-black/60 dark:text-white/60">
                Folder *
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-normal leading-[20.4px] text-black/60 dark:text-white/60">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-[14px] leading-[23.8px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-[14px] leading-[23.8px] text-black/60 transition-colors hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !folderId}
              className="rounded-lg bg-black dark:bg-white px-4 py-2.5 text-[14px] font-medium leading-[23.8px] text-white dark:text-black transition-colors hover:bg-black/80 dark:hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
