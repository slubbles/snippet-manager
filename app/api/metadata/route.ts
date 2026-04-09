import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  // Require auth
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ title: '' })
  }

  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ title: '' })
  }

  try {
    const parsed = new URL(url)
    // Block non-HTTP protocols and internal/private addresses
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ title: '' })
    }
    const hostname = parsed.hostname
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return NextResponse.json({ title: '' })
    }
  } catch {
    return NextResponse.json({ title: '' })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SnippetManager/1.0)',
      },
    })
    clearTimeout(timeout)

    const html = await response.text()
    const $ = cheerio.load(html)
    let title = $('title').first().text().trim()

    if (title.length > 200) {
      title = title.substring(0, 200)
    }

    return NextResponse.json({ title })
  } catch {
    return NextResponse.json({ title: '' })
  }
}
