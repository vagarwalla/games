import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/rolled/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { data: stack, error: stackError } = await supabaseClient()
      .from('game_stacks')
      .select('id')
      .eq('slug', slug)
      .single()

    if (stackError || !stack) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 })
    }

    const { data: items, error } = await supabaseClient()
      .from('game_stack_items')
      .select('*')
      .eq('stack_id', stack.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json(items || [])
  } catch (err) {
    console.error('GET /api/rolled/stacks/[slug]/items error:', err)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await req.json()
    const { bgg_id, title, year, thumbnail, min_players, max_players } = body

    if (!bgg_id || !title) {
      return NextResponse.json({ error: 'bgg_id and title are required' }, { status: 400 })
    }

    const { data: stack, error: stackError } = await supabaseClient()
      .from('game_stacks')
      .select('id')
      .eq('slug', slug)
      .single()

    if (stackError || !stack) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 })
    }

    // Get current max sort_order
    const { data: existing } = await supabaseClient()
      .from('game_stack_items')
      .select('sort_order')
      .eq('stack_id', stack.id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const maxOrder = existing && existing.length > 0 ? existing[0].sort_order : -1

    const { data, error } = await supabaseClient()
      .from('game_stack_items')
      .insert({
        stack_id: stack.id,
        bgg_id,
        title,
        year: year ?? null,
        thumbnail: thumbnail ?? null,
        min_players: min_players ?? null,
        max_players: max_players ?? null,
        sort_order: maxOrder + 1,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('POST /api/rolled/stacks/[slug]/items error:', err)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}
