import { NextRequest, NextResponse } from 'next/server'
import { searchBgg } from '@/lib/rolled/bgg'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query } = body
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const results = await searchBgg(query.trim())
    return NextResponse.json(results)
  } catch (err) {
    console.error('POST /api/rolled/search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
