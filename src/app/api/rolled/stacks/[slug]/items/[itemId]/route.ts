import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/rolled/supabase'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; itemId: string }> }
) {
  try {
    const { itemId } = await params
    const { error } = await supabaseClient()
      .from('game_stack_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/rolled/stacks/[slug]/items/[itemId] error:', err)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
