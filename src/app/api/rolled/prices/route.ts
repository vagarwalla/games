import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/rolled/supabase'
import { fetchEbayListings, ebaySearchUrl } from '@/lib/rolled/ebay'
import type { GameStackItem, PriceResult, EbayListing } from '@/lib/rolled/types'

const CACHE_TTL_HOURS = 6

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items } = body as { items: GameStackItem[] }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 })
    }

    const results: PriceResult[] = []

    for (const item of items) {
      try {
        const cacheKey = item.bgg_id

        // Check cache
        const { data: cached } = await supabaseClient()
          .from('game_price_cache')
          .select('listings, cached_at')
          .eq('cache_key', cacheKey)
          .single()

        let listings: EbayListing[] = []
        let usedCache = false

        if (cached) {
          const cachedAt = new Date(cached.cached_at)
          const ageHours = (Date.now() - cachedAt.getTime()) / (1000 * 60 * 60)
          if (ageHours < CACHE_TTL_HOURS) {
            listings = cached.listings as EbayListing[]
            usedCache = true
          }
        }

        if (!usedCache) {
          listings = await fetchEbayListings(item.title)

          await supabaseClient().from('game_price_cache').upsert(
            { cache_key: cacheKey, listings, cached_at: new Date().toISOString() },
            { onConflict: 'cache_key' }
          )
        }

        const best = listings.length > 0 ? listings[0] : null

        results.push({
          item_id: item.id,
          bgg_id: item.bgg_id,
          title: item.title,
          listings,
          best,
          ebay_search_url: ebaySearchUrl(item.title),
        })
      } catch (err) {
        console.error(`Price lookup failed for ${item.title}:`, err)
        results.push({
          item_id: item.id,
          bgg_id: item.bgg_id,
          title: item.title,
          listings: [],
          best: null,
          ebay_search_url: ebaySearchUrl(item.title),
        })
      }
    }

    return NextResponse.json(results)
  } catch (err) {
    console.error('POST /api/rolled/prices error:', err)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
