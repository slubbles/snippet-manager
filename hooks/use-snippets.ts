'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface Snippet {
  id: string
  title: string
  content: string
  url: string | null
  language: string | null
  folderId: string
  createdAt: string
  updatedAt: string
}

export function useSnippets(folderId: string | null, searchActive: boolean) {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSnippets = useCallback(async (targetFolderId?: string | null) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      // When search is active, fetch all. Otherwise fetch for selected folder.
      const id = targetFolderId !== undefined ? targetFolderId : null
      if (id) params.set('folderId', id)

      const res = await fetch(`/api/snippets?${params.toString()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSnippets(data)
    } catch {
      toast.error('Failed to load snippets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchActive) {
      // Fetch all snippets for search
      fetchSnippets(null)
    } else {
      fetchSnippets(folderId)
    }
  }, [folderId, searchActive, fetchSnippets])

  const createSnippet = async (data: {
    title: string
    content: string
    url: string
    language: string
    folderId: string
  }) => {
    try {
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Snippet saved')
      await fetchSnippets(folderId)
    } catch {
      toast.error('Failed to create snippet')
    }
  }

  const updateSnippet = async (data: {
    id: string
    title: string
    content: string
    url: string
    language: string
    folderId: string
  }) => {
    try {
      const res = await fetch('/api/snippets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Snippet updated')
      await fetchSnippets(folderId)
    } catch {
      toast.error('Failed to update snippet')
    }
  }

  const deleteSnippet = async (id: string) => {
    try {
      const res = await fetch('/api/snippets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      toast.success('Snippet deleted')
      await fetchSnippets(folderId)
    } catch {
      toast.error('Failed to delete snippet')
    }
  }

  return { snippets, loading, fetchSnippets, createSnippet, updateSnippet, deleteSnippet }
}
