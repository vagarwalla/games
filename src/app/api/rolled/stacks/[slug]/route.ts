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
      .select('*')
      .eq('slug', slug)
      .single()

    if (stackError || !stack) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 })
    }

    const { data: items, error: itemsError } = await supabaseClient()
      .from('game_stack_items')
      .select('*')
      .eq('stack_id', stack.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (itemsError) throw itemsError

    return NextResponse.json({ stack, items: items || [] })
  } catch (err) {
    console.error('GET /api/rolled/stacks/[slug] error:', err)
    return NextResponse.json({ error: 'Failed to fetch stack' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { error } = await supabaseClient().from('game_stacks').delete().eq('slug', slug)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/rolled/stacks/[slug] error:', err)
    return NextResponse.json({ error: 'Failed to delete stack' }, { status: 500 })
  }
}
