'use client'

import { useState } from 'react'
import { FolderPlus, Layers } from 'lucide-react'
import { FolderItem } from './folder-item'
import { StylizedText } from './stylized-text'

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
    <aside className="flex h-full w-72 flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-zinc-800">
        <Layers size={20} className="text-brand-500" />
        <span className="text-[14px] font-semibold leading-[23.8px]">SnippetVault</span>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* All Snippets */}
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] leading-[23.8px] cursor-pointer transition-colors ${
            selectedFolderId === null
              ? 'bg-brand-500/10 text-brand-500 border-l-2 border-brand-500'
              : 'text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => onSelectFolder(null)}
        >
          <Layers size={16} className="shrink-0" />
          <span className="flex-1 truncate">All Snippets</span>
          <span className="text-[12px] text-gray-400 dark:text-zinc-500 tabular-nums">
            {totalSnippets}
          </span>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-gray-200 dark:border-zinc-800" />

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
              className="flex-1 min-w-0 rounded bg-transparent text-[14px] leading-[23.8px] outline-none placeholder-zinc-500"
            />
          </div>
        )}
      </div>

      {/* Create folder button */}
      <div className="border-t border-gray-200 p-2 dark:border-zinc-800">
        <button
          onClick={() => setCreating(true)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[14px] leading-[23.8px] text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <FolderPlus size={16} />
          New Folder
        </button>
      </div>
    </aside>
  )
}
