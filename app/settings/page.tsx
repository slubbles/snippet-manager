'use client'

import { useState } from 'react'
import { useSession, authClient, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { StylizedText } from '@/components/stylized-text'

export default function SettingsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Name
  const [name, setName] = useState('')
  const [nameSaving, setNameSaving] = useState(false)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Initialize name from session
  useState(() => {
    if (session?.user) setName(session.user.name)
  })

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setNameSaving(true)
    try {
      await authClient.updateUser({ name: name.trim() })
      toast.success('Name updated')
    } catch {
      toast.error('Failed to update name')
    }
    setNameSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setPasswordSaving(true)
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
      })
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Failed to change password. Check your current password.')
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-[14px] leading-[23.8px] text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <h1 className="mb-8 text-[28px] font-medium leading-[29.4px]"><StylizedText>Settings</StylizedText></h1>

      {/* Update Name */}
      <section className="mb-8 rounded-xl border border-gray-200 p-6 dark:border-zinc-700/50">
        <h2 className="mb-4 text-[20px] font-medium leading-[23px]">Display Name</h2>
        <form onSubmit={handleUpdateName} className="flex items-end gap-3">
          <div className="flex-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] leading-[23.8px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="Your name"
            />
          </div>
          <button
            type="submit"
            disabled={nameSaving}
            className="rounded-lg bg-brand-500 px-4 py-2 text-[14px] font-medium leading-[23.8px] text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {nameSaving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section className="mb-8 rounded-xl border border-gray-200 p-6 dark:border-zinc-700/50">
        <h2 className="mb-4 text-[20px] font-medium leading-[23px]"><StylizedText>Change Password</StylizedText></h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] leading-[23.8px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
            required
            autoComplete="current-password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 8 characters)"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] leading-[23.8px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] leading-[23.8px] outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-lg bg-brand-500 px-4 py-2 text-[14px] font-medium leading-[23.8px] text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-500/30 p-6">
        <h2 className="mb-2 text-[20px] font-medium leading-[23px] text-red-500"><StylizedText>Danger Zone</StylizedText></h2>
        <p className="mb-4 text-[14px] font-normal leading-[23.8px] text-gray-500 dark:text-zinc-400">
          Permanently delete your account and all your data. This action cannot be undone.
        </p>
        {deleteConfirm ? (
          <div className="flex items-center gap-3">
            <span className="text-[14px] leading-[23.8px] text-red-500">Are you sure?</span>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="rounded-lg bg-red-500 px-4 py-2 text-[14px] font-medium leading-[23.8px] text-white hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Yes, delete my account'}
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-[14px] font-medium leading-[23.8px] hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-[14px] font-medium leading-[23.8px] text-red-500 hover:bg-red-500/10"
          >
            Delete Account
          </button>
        )}
      </section>
    </div>
  )
}
