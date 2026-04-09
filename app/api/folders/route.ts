import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      include: { _count: { select: { snippets: true } } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(folders)
  } catch (error) {
    console.error('Failed to fetch folders:', error)
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (!name || name.length > 50) {
      return NextResponse.json(
        { error: 'Name is required and must be 50 characters or less' },
        { status: 400 }
      )
    }

    const folder = await prisma.folder.create({ data: { name } })
    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Failed to create folder:', error)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    if (!name || name.length > 50) {
      return NextResponse.json(
        { error: 'Name is required and must be 50 characters or less' },
        { status: 400 }
      )
    }

    const folder = await prisma.folder.update({ where: { id }, data: { name } })
    return NextResponse.json(folder)
  } catch (error) {
    console.error('Failed to update folder:', error)
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.folder.delete({ where: { id } })
    return NextResponse.json({ message: 'Folder deleted' })
  } catch (error) {
    console.error('Failed to delete folder:', error)
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 })
  }
}
