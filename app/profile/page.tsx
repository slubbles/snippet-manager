'use client'

import { useState, useEffect } from 'react'
import { useSession, authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Check, X, Folder, FileCode2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'

export default function ProfilePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [stats, setStats] = useState({ folders: 0, snippets: 0 })

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name)
    }
  }, [session])

  useEffect(() => {
    async function fetchStats() {
      try {
        const [foldersRes, snippetsRes] = await Promise.all([
          fetch('/api/folders'),
          fetch('/api/snippets'),
        ])
        if (foldersRes.ok && snippetsRes.ok) {
          const folders = await foldersRes.json()
          const snippets = await snippetsRes.json()
          setStats({ folders: folders.length, snippets: snippets.length })
        }
      } catch {
        // Stats are non-critical
      }
    }
    if (session) fetchStats()
  }, [session])

  const handleSaveName = async () => {
    if (!name.trim()) return
    try {
      await authClient.updateUser({ name: name.trim() })
      toast.success('Name updated')
      setEditingName(false)
    } catch {
      toast.error('Failed to update name')
    }
  }

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const memberSince = new Date(session.user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 py-2 text-[14px] leading-[23.8px] text-[#091413]/60 hover:text-[#091413]/80 dark:text-white/60 dark:hover:text-white/80"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <ThemeToggle />
      </div>

      <h1 className="mb-8 text-[28px] font-medium leading-[29.4px]">Profile</h1>

      {/* Avatar + Name */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-[20px] font-medium leading-[23px] text-white">
          {session.user.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-[#091413]/15 bg-white px-3 py-1.5 text-[14px] leading-[23.8px] outline-none focus:border-brand-500 dark:border-white/15 dark:bg-white/5"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName()
                  if (e.key === 'Escape') { setEditingName(false); setName(session.user.name) }
                }}
              />
              <button onClick={handleSaveName} className="rounded p-2 text-green-500 hover:bg-green-500/10">
                <Check size={16} />
              </button>
              <button onClick={() => { setEditingName(false); setName(session.user.name) }} className="rounded p-2 text-[#091413]/40 hover:bg-[#091413]/5 dark:hover:bg-white/5">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold leading-[27px]">{session.user.name}</h2>
              <button onClick={() => setEditingName(true)} className="rounded p-2 text-[#091413]/40 hover:bg-[#091413]/5 hover:text-[#091413]/70 dark:hover:bg-white/5 dark:hover:text-white/70">
                <Pencil size={14} />
              </button>
            </div>
          )}
          <p className="text-[14px] leading-[23.8px] text-[#091413]/60 dark:text-white/60">{session.user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#091413]/10 p-4 dark:border-white/10">
          <Folder size={20} className="mb-2 text-brand-500" />
          <p className="text-[20px] font-medium leading-[23px]">{stats.folders}</p>
          <p className="text-[12px] font-normal leading-[20.4px] text-[#091413]/60 dark:text-white/60">Folders</p>
        </div>
        <div className="rounded-xl border border-[#091413]/10 p-4 dark:border-white/10">
          <FileCode2 size={20} className="mb-2 text-brand-500" />
          <p className="text-[20px] font-medium leading-[23px]">{stats.snippets}</p>
          <p className="text-[12px] font-normal leading-[20.4px] text-[#091413]/60 dark:text-white/60">Snippets</p>
        </div>
        <div className="rounded-xl border border-[#091413]/10 p-4 dark:border-white/10">
          <Calendar size={20} className="mb-2 text-brand-500" />
          <p className="text-[14px] font-medium leading-[23.8px]">{memberSince}</p>
          <p className="text-[12px] font-normal leading-[20.4px] text-[#091413]/60 dark:text-white/60">Member since</p>
        </div>
      </div>

      {/* Links */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/settings"
          className="rounded-lg border border-[#091413]/15 px-4 py-2 text-[14px] font-medium leading-[23.8px] transition-colors hover:bg-[#091413]/5 dark:border-white/15 dark:hover:bg-white/5"
        >
          Account Settings
        </Link>
      </div>
    </div>
  )
}
