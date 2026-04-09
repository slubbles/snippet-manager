'use client'

import { useState, useRef, useEffect } from 'react'
import { Folder, Pencil, Trash2 } from 'lucide-react'

interface FolderData {
  id: string
  name: string
  _count: { snippets: number }
}

interface FolderItemProps {
  folder: FolderData
  selected: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onDelete: () => void
}

export function FolderItem({ folder, selected, onSelect, onRename, onDelete }: FolderItemProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(folder.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const save = () => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== folder.name) {
      onRename(trimmed)
    } else {
      setName(folder.name)
    }
    setEditing(false)
  }

  return (
    <div
      className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] leading-[23.8px] cursor-pointer transition-colors ${
        selected
          ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white border-l-2 border-black dark:border-white'
          : 'text-black/70 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5'
      }`}
      onClick={() => !editing && onSelect()}
    >
      <Folder size={16} className="shrink-0" />

      {editing ? (
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setName(folder.name)
              setEditing(false)
            }
          }}
          className="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-[23.8px]"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 min-w-0 truncate">{folder.name}</span>
      )}

      {!editing && (
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditing(true)
            }}
            className="rounded p-1.5 hover:bg-white/10"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="rounded p-1.5 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <span className="ml-auto text-[12px] text-black/40 dark:text-white/40 tabular-nums">
        {folder._count.snippets}
      </span>
    </div>
  )
}
