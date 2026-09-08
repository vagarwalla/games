import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/rolled/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseClient()
      .from('game_stacks')
      .select(`
        id, slug, name, created_at,
        game_stack_items(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const stacks = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      created_at: row.created_at,
      item_count: Array.isArray(row.game_stack_items)
        ? (row.game_stack_items[0] as { count: number } | undefined)?.count ?? 0
        : 0,
    }))

    return NextResponse.json(stacks)
  } catch (err) {
    console.error('GET /api/rolled/stacks error:', err)
    return NextResponse.json({ error: 'Failed to fetch stacks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate slug from name
    const base = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Ensure uniqueness by appending a short random suffix
    const { nanoid } = await import('nanoid')
    const slug = `${base}-${nanoid(6)}`

    const { data, error } = await supabaseClient()
      .from('game_stacks')
      .insert({ name: name.trim(), slug })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('POST /api/rolled/stacks error:', err)
    return NextResponse.json({ error: 'Failed to create stack' }, { status: 500 })
  }
}
