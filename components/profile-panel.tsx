'use client'

import { useState, useEffect } from 'react'
import { X, Pencil, Check, Folder, FileCode2, Calendar, ChevronRight } from 'lucide-react'
import { useSession, authClient, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProfilePanelProps {
  open: boolean
  onClose: () => void
}

export function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [stats, setStats] = useState({ folders: 0, snippets: 0 })
  const [section, setSection] = useState<'main' | 'password' | 'danger'>('main')

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (session?.user) setName(session.user.name)
  }, [session])

  useEffect(() => {
    if (!open) {
      setSection('main')
      setEditingName(false)
      setDeleteConfirm(false)
    }
  }, [open])

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
      } catch { /* non-critical */ }
    }
    if (open && session) fetchStats()
  }, [open, session])

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) { toast.error('Min 8 characters'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    setPasswordSaving(true)
    try {
      await authClient.changePassword({ currentPassword, newPassword })
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSection('main')
    } catch {
      toast.error('Failed to change password')
    }
    setPasswordSaving(false)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await authClient.deleteUser()
      await signOut()
      router.push('/')
    } catch {
      toast.error('Failed to delete account')
      setDeleting(false)
    }
  }

  if (!session) return null

  const memberSince = new Date(session.user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-[16px] font-semibold">
            {section === 'main' ? 'Profile' : section === 'password' ? 'Change Password' : 'Delete Account'}
          </h2>
          <button
            onClick={section === 'main' ? onClose : () => setSection('main')}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            {section === 'main' ? <X size={18} /> : <span className="text-[13px]">← Back</span>}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {section === 'main' && (
            <>
              {/* Avatar + Name */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[18px] font-medium text-white">
                  {session.user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  {editingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-[14px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName()
                          if (e.key === 'Escape') { setEditingName(false); setName(session.user.name) }
                        }}
                      />
                      <button onClick={handleSaveName} className="rounded p-1 text-brand-500 hover:bg-brand-500/10">
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-[16px] font-semibold">{session.user.name}</h3>
                      <button onClick={() => setEditingName(true)} className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800">
                        <Pencil size={13} />
                      </button>
                    </div>
                  )}
                  <p className="truncate text-[13px] text-gray-500 dark:text-zinc-400">{session.user.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 p-3 dark:border-zinc-700/50">
                  <Folder size={16} className="mb-1.5 text-brand-500" />
                  <p className="text-[18px] font-medium">{stats.folders}</p>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500">Folders</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3 dark:border-zinc-700/50">
                  <FileCode2 size={16} className="mb-1.5 text-brand-500" />
                  <p className="text-[18px] font-medium">{stats.snippets}</p>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500">Snippets</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3 dark:border-zinc-700/50">
                  <Calendar size={16} className="mb-1.5 text-brand-500" />
                  <p className="text-[12px] font-medium leading-tight">{memberSince}</p>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500">Joined</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-1">
                <button
                  onClick={() => setSection('password')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Change Password
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setSection('danger')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[14px] text-red-500 hover:bg-red-500/5"
                >
                  Delete Account
                  <ChevronRight size={16} className="text-red-400" />
                </button>
              </div>
            </>
          )}

          {section === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
                required
                autoComplete="current-password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={passwordSaving}
                className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {passwordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {section === 'danger' && (
            <div>
              <p className="mb-4 text-[14px] text-gray-500 dark:text-zinc-400">
                Permanently delete your account and all your data. This action cannot be undone.
              </p>
              {deleteConfirm ? (
                <div className="space-y-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Yes, delete my account'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="rounded-lg border border-red-500/50 px-4 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-500/10"
                >
                  Delete Account
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
