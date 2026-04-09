'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { SnippetGrid } from '@/components/snippet-grid'
import { SnippetModal } from '@/components/snippet-modal'
import { SearchBar } from '@/components/search-bar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useFolders } from '@/hooks/use-folders'
import { useSnippets } from '@/hooks/use-snippets'
import { useSession, signOut } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Snippet {
  id: string
  title: string
  content: string
  url: string | null
  language: string | null
  folderId: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const { folders, loading: foldersLoading, createFolder, updateFolder, deleteFolder, fetchFolders } = useFolders()
  const searchActive = searchQuery.length > 0
  const { snippets, loading: snippetsLoading, createSnippet, updateSnippet, deleteSnippet } = useSnippets(
    selectedFolderId,
    searchActive
  )

  // Client-side search filtering
  const filteredSnippets = useMemo(() => {
    if (!searchQuery) return snippets
    const q = searchQuery.toLowerCase()
    return snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    )
  }, [snippets, searchQuery])

  // Folder name for header
  const folderName = useMemo(() => {
    if (selectedFolderId === null) return 'All Snippets'
    const folder = folders.find((f) => f.id === selectedFolderId)
    return folder?.name || 'All Snippets'
  }, [selectedFolderId, folders])

  // Total snippet count
  const totalSnippets = useMemo(
    () => folders.reduce((sum, f) => sum + f._count.snippets, 0),
    [folders]
  )

  const searchRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false)
        setMobileSidebarOpen(false)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleDeleteFolder = (id: string) => {
    const folder = folders.find((f) => f.id === id)
    const count = folder?._count.snippets || 0
    if (!confirm(`Delete "${folder?.name}" and ${count} snippet${count !== 1 ? 's' : ''}?`)) return
    deleteFolder(id)
    if (selectedFolderId === id) setSelectedFolderId(null)
  }

  const handleDeleteSnippet = (id: string) => {
    if (!confirm('Delete this snippet? This can\'t be undone.')) return
    deleteSnippet(id).then(() => fetchFolders())
  }

  const handleSave = async (data: {
    id?: string
    title: string
    content: string
    url: string
    language: string
    folderId: string
  }) => {
    if (data.id) {
      await updateSnippet(data as { id: string; title: string; content: string; url: string; language: string; folderId: string })
    } else {
      await createSnippet(data)
    }
    setModalOpen(false)
    setEditingSnippet(null)
    fetchFolders()
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push('/login'),
      },
    })
  }

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform md:relative md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={(id) => {
            setSelectedFolderId(id)
            setSearchQuery('')
            setMobileSidebarOpen(false)
          }}
          onCreateFolder={createFolder}
          onRenameFolder={updateFolder}
          onDeleteFolder={handleDeleteFolder}
          totalSnippets={totalSnippets}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-4 py-2.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Menu size={20} />
          </button>
          <SearchBar ref={searchRef} query={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/profile"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Profile"
            >
              <User size={18} />
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Snippet grid */}
        <SnippetGrid
          snippets={filteredSnippets}
          loading={snippetsLoading}
          folderName={folderName}
          searchQuery={searchQuery}
          onNewSnippet={() => {
            setEditingSnippet(null)
            setModalOpen(true)
          }}
          onEdit={(snippet) => {
            setEditingSnippet(snippet)
            setModalOpen(true)
          }}
          onDelete={handleDeleteSnippet}
        />
      </div>

      {/* Modal */}
      <SnippetModal
        open={modalOpen}
        snippet={editingSnippet}
        folders={folders}
        currentFolderId={selectedFolderId}
        onClose={() => {
          setModalOpen(false)
          setEditingSnippet(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
