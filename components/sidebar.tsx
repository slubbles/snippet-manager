'use client'

import { useState } from 'react'
import { FolderPlus, Layers } from 'lucide-react'
import { FolderItem } from './folder-item'
import { ThemeLogo } from './theme-logo'

interface FolderData {
  id: string
  name: string
  _count: { snippets: number }
}

interface SidebarProps {
  folders: FolderData[]
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
  onCreateFolder: (name: string) => void
  onRenameFolder: (id: string, name: string) => void
  onDeleteFolder: (id: string) => void
  totalSnippets: number
}

export function Sidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  totalSnippets,
}: SidebarProps) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    const trimmed = newName.trim()
    if (trimmed) {
      onCreateFolder(trimmed)
      setNewName('')
      setCreating(false)
    }
  }

  return (
    <aside className="flex h-full w-72 max-w-[85vw] flex-col border-r border-[#091413]/10 bg-white dark:border-white/10 dark:bg-[#091413]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#091413]/10 px-4 py-3 dark:border-white/10">
        <ThemeLogo size={22} />
        <span className="text-[14px] font-semibold leading-[23.8px]">Snip Labs</span>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* All Snippets */}
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] leading-[23.8px] cursor-pointer transition-colors ${
            selectedFolderId === null
              ? 'bg-brand-500/10 text-brand-500 border-l-2 border-brand-500'
              : 'text-[#091413]/70 hover:bg-[#091413]/5 dark:text-white/60 dark:hover:bg-white/5'
          }`}
          onClick={() => onSelectFolder(null)}
        >
          <Layers size={16} className="shrink-0" />
          <span className="flex-1 truncate">All Snippets</span>
          <span className="text-[12px] text-[#091413]/40 dark:text-white/40 tabular-nums">
            {totalSnippets}
          </span>
        </div>

        {/* New Folder button */}
        <button
          onClick={() => setCreating(true)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[14px] leading-[23.8px] text-[#091413]/60 transition-colors hover:bg-[#091413]/5 dark:text-white/60 dark:hover:bg-white/5"
        >
          <FolderPlus size={16} />
          New Folder
        </button>

        {/* Divider */}
        <div className="my-2 border-t border-[#091413]/10 dark:border-white/10" />

        {/* Folders */}
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            selected={selectedFolderId === folder.id}
            onSelect={() => onSelectFolder(folder.id)}
            onRename={(name) => onRenameFolder(folder.id, name)}
            onDelete={() => onDeleteFolder(folder.id)}
          />
        ))}

        {/* New folder input */}
        {creating && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => {
                if (!newName.trim()) setCreating(false)
                else handleCreate()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') {
                  setNewName('')
                  setCreating(false)
                }
              }}
              placeholder="Folder name..."
              className="flex-1 min-w-0 rounded bg-transparent text-[14px] leading-[23.8px] outline-none placeholder-[#091413]/40 dark:placeholder-white/40"
            />
          </div>
        )}
      </div>

    </aside>
  )
}
