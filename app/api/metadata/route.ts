import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ title: '' })
  }

  try {
    new URL(url)
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
