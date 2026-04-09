import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')

    const where = folderId ? { folderId, userId } : { userId }
    const snippets = await prisma.snippet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(snippets)
  } catch (error) {
    console.error('Failed to fetch snippets:', error)
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content : ''
    const { folderId, url, language } = body

    if (!title || title.length > 200) {
      return NextResponse.json(
        { error: 'Title is required and must be 200 characters or less' },
        { status: 400 }
      )
    }
    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
    }

    // Verify folder belongs to user
    const folder = await prisma.folder.findFirst({ where: { id: folderId, userId } })
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
    }

    const snippet = await prisma.snippet.create({
      data: {
        title,
        content,
        folderId,
        userId,
        url: url || null,
        language: language || null,
      },
    })
    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error('Failed to create snippet:', error)
    return NextResponse.json({ error: 'Failed to create snippet' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id } = body
    const title = typeof body.title === 'string' ? body.title.trim() : ''

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    if (!title || title.length > 200) {
      return NextResponse.json(
        { error: 'Title is required and must be 200 characters or less' },
        { status: 400 }
      )
    }

    // Validate URL format if provided
    if (body.url) {
      try {
        new URL(body.url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
    }

    // Verify target folder ownership if changing folder
    if (body.folderId) {
      const targetFolder = await prisma.folder.findFirst({
        where: { id: body.folderId, userId },
      })
      if (!targetFolder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
      }
    }

    // Verify ownership + update in one query
    const snippet = await prisma.snippet.update({
      where: { id, userId },
      data: {
        title,
        content: typeof body.content === 'string' ? body.content : undefined,
        folderId: body.folderId || undefined,
        url: body.url !== undefined ? (body.url || null) : undefined,
        language: body.language !== undefined ? (body.language || null) : undefined,
      },
    })
    return NextResponse.json(snippet)
  } catch (error) {
    console.error('Failed to update snippet:', error)
    return NextResponse.json({ error: 'Failed to update snippet' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.snippet.delete({ where: { id, userId } })
    return NextResponse.json({ message: 'Snippet deleted' })
  } catch (error) {
    console.error('Failed to delete snippet:', error)
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 })
  }
}
