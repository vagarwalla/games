import type { BggSearchResult } from './types'

const BGG_API = 'https://www.boardgamegeek.com/xmlapi2'

async function fetchWithRetry(url: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Rolled/1.0 (board game deal finder)',
      },
      next: { revalidate: 0 },
    })
    if (res.status === 202) {
      // BGG is queuing the request, wait and retry
      await new Promise((r) => setTimeout(r, 2000))
      continue
    }
    if (!res.ok) {
      throw new Error(`BGG API error: ${res.status}`)
    }
    return res.text()
  }
  throw new Error('BGG API returned 202 too many times')
}

function parseAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]+${attr}="([^"]*)"`, 'i')
  const m = xml.match(re)
  return m ? m[1] : null
}

function parseTagContent(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const m = xml.match(re)
  return m ? m[1].trim() : null
}

function parseSearchXml(xml: string): Array<{ bgg_id: string; title: string; year: number | null }> {
  const results: Array<{ bgg_id: string; title: string; year: number | null }> = []
  const itemRe = /<item type="boardgame"[^>]+id="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRe.exec(xml)) !== null) {
    const id = match[1]
    const body = match[2]
    // Primary name
    const nameMatch = body.match(/<name type="primary"[^>]+value="([^"]+)"/)
    const title = nameMatch ? nameMatch[1] : ''
    // Year
    const yearMatch = body.match(/<yearpublished value="(\d+)"/)
    const year = yearMatch ? parseInt(yearMatch[1]) : null
    if (title) {
      results.push({ bgg_id: id, title, year })
    }
  }
  return results
}

function parseThingXml(xml: string, bgg_id: string): BggSearchResult | null {
  // Primary name
  const nameMatch = xml.match(/<name type="primary"[^>]+value="([^"]+)"/)
  const title = nameMatch ? nameMatch[1] : null
  if (!title) return null

  const yearMatch = xml.match(/<yearpublished value="(\d+)"/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null

  const thumbnail = parseTagContent(xml, 'thumbnail')
  const minMatch = xml.match(/<minplayers value="(\d+)"/)
  const maxMatch = xml.match(/<maxplayers value="(\d+)"/)
  const min_players = minMatch ? parseInt(minMatch[1]) : null
  const max_players = maxMatch ? parseInt(maxMatch[1]) : null

  return {
    bgg_id,
    title,
    year,
    thumbnail: thumbnail || null,
    min_players,
    max_players,
  }
}

export async function searchBgg(query: string): Promise<BggSearchResult[]> {
  try {
    // Try exact search first
    let xml = await fetchWithRetry(
      `${BGG_API}/search?query=${encodeURIComponent(query)}&type=boardgame&exact=1`
    )
    let items = parseSearchXml(xml)

    // Fall back to non-exact if no results
    if (items.length === 0) {
      xml = await fetchWithRetry(
        `${BGG_API}/search?query=${encodeURIComponent(query)}&type=boardgame`
      )
      items = parseSearchXml(xml)
    }

    // Limit to top 10
    const top = items.slice(0, 10)
    if (top.length === 0) return []

    // Fetch thing details for thumbnails and player counts
    const ids = top.map((i) => i.bgg_id).join(',')
    const thingXml = await fetchWithRetry(`${BGG_API}/thing?id=${ids}&stats=1`)

    // Parse each thing
    const thingRe = /<item type="boardgame"[^>]+id="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi
    const thingMap = new Map<string, BggSearchResult>()
    let thingMatch
    while ((thingMatch = thingRe.exec(thingXml)) !== null) {
      const id = thingMatch[1]
      const body = thingMatch[2]
      const parsed = parseThingXml(body, id)
      if (parsed) thingMap.set(id, parsed)
    }

    return top.map((item) => {
      const thing = thingMap.get(item.bgg_id)
      return thing || {
        bgg_id: item.bgg_id,
        title: item.title,
        year: item.year,
        thumbnail: null,
        min_players: null,
        max_players: null,
      }
    })
  } catch (err) {
    console.error('BGG search error:', err)
    return []
  }
}

export async function getBggGame(bggId: string): Promise<BggSearchResult | null> {
  try {
    const xml = await fetchWithRetry(`${BGG_API}/thing?id=${bggId}&stats=1`)
    return parseThingXml(xml, bggId)
  } catch (err) {
    console.error('BGG get game error:', err)
    return null
  }
}
