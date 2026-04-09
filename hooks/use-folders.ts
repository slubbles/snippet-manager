'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface FolderData {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  _count: { snippets: number }
}

export function useFolders() {
  const [folders, setFolders] = useState<FolderData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/folders')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFolders(data)
    } catch {
      toast.error('Failed to load folders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const createFolder = async (name: string) => {
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error()
      toast.success('Folder created')
      await fetchFolders()
    } catch {
      toast.error('Failed to create folder')
    }
  }

  const updateFolder = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/folders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      })
      if (!res.ok) throw new Error()
      toast.success('Folder renamed')
      await fetchFolders()
    } catch {
      toast.error('Failed to rename folder')
    }
  }

  const deleteFolder = async (id: string) => {
    try {
      const res = await fetch('/api/folders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      toast.success('Folder deleted')
      await fetchFolders()
    } catch {
      toast.error('Failed to delete folder')
    }
  }

  return { folders, loading, fetchFolders, createFolder, updateFolder, deleteFolder }
}
