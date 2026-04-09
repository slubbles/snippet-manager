import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')

    const where = folderId ? { folderId } : {}
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

    const snippet = await prisma.snippet.update({
      where: { id },
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
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.snippet.delete({ where: { id } })
    return NextResponse.json({ message: 'Snippet deleted' })
  } catch (error) {
    console.error('Failed to delete snippet:', error)
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 })
  }
}
