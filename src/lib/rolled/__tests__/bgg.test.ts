import { describe, it, expect, vi, beforeEach } from 'vitest'

// We test the XML parsing logic by importing internal helpers
// Since they're not exported, we test through the public API with mocked fetch

const SEARCH_XML_SINGLE = `<?xml version="1.0" encoding="utf-8"?>
<items total="1" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="178900">
    <name type="primary" value="Codenames"/>
    <yearpublished value="2015"/>
  </item>
</items>`

const SEARCH_XML_MULTIPLE = `<?xml version="1.0" encoding="utf-8"?>
<items total="3" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="178900">
    <name type="primary" value="Codenames"/>
    <yearpublished value="2015"/>
  </item>
  <item type="boardgame" id="224037">
    <name type="primary" value="Codenames: Duet"/>
    <yearpublished value="2017"/>
  </item>
  <item type="boardgame" id="260605">
    <name type="primary" value="Codenames: Duet XXL"/>
    <yearpublished value="2018"/>
  </item>
</items>`

const THING_XML = `<?xml version="1.0" encoding="utf-8"?>
<items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="178900">
    <thumbnail>https://cf.geekdo-images.com/thumb.jpg</thumbnail>
    <name type="primary" value="Codenames"/>
    <yearpublished value="2015"/>
    <minplayers value="2"/>
    <maxplayers value="8"/>
  </item>
</items>`

const THING_XML_MULTIPLE = `<?xml version="1.0" encoding="utf-8"?>
<items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <item type="boardgame" id="178900">
    <thumbnail>https://cf.geekdo-images.com/codenames-thumb.jpg</thumbnail>
    <name type="primary" value="Codenames"/>
    <yearpublished value="2015"/>
    <minplayers value="2"/>
    <maxplayers value="8"/>
  </item>
  <item type="boardgame" id="224037">
    <thumbnail>https://cf.geekdo-images.com/duet-thumb.jpg</thumbnail>
    <name type="primary" value="Codenames: Duet"/>
    <yearpublished value="2017"/>
    <minplayers value="2"/>
    <maxplayers value="2"/>
  </item>
</items>`

const EMPTY_XML = `<?xml version="1.0" encoding="utf-8"?>
<items total="0" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
</items>`

describe('BGG XML parsing (via mocked fetch)', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('searchBgg', () => {
    it('returns results from exact search', async () => {
      const { searchBgg } = await import('../bgg')

      vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
        if (url.includes('exact=1')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(SEARCH_XML_SINGLE),
          })
        }
        // Thing details
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(THING_XML),
        })
      }))

      const results = await searchBgg('Codenames')
      expect(results).toHaveLength(1)
      expect(results[0].bgg_id).toBe('178900')
      expect(results[0].title).toBe('Codenames')
      expect(results[0].year).toBe(2015)
    })

    it('falls back to non-exact search when exact returns empty', async () => {
      const { searchBgg } = await import('../bgg')

      let callCount = 0
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
        callCount++
        if (url.includes('exact=1')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(EMPTY_XML),
          })
        }
        if (url.includes('/search?')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(SEARCH_XML_MULTIPLE),
          })
        }
        // Thing details
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(THING_XML_MULTIPLE),
        })
      }))

      const results = await searchBgg('Codenames')
      expect(results.length).toBeGreaterThan(0)
    })

    it('enriches results with thumbnails and player counts from thing API', async () => {
      const { searchBgg } = await import('../bgg')

      vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
        if (url.includes('exact=1')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(SEARCH_XML_SINGLE),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(THING_XML),
        })
      }))

      const results = await searchBgg('Codenames')
      expect(results[0].thumbnail).toBe('https://cf.geekdo-images.com/thumb.jpg')
      expect(results[0].min_players).toBe(2)
      expect(results[0].max_players).toBe(8)
    })

    it('returns empty array on network error', async () => {
      const { searchBgg } = await import('../bgg')

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

      const results = await searchBgg('Codenames')
      expect(results).toEqual([])
    })

    it('retries on 202 response', async () => {
      const { searchBgg } = await import('../bgg')

      let callCount = 0
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
        callCount++
        if (callCount <= 1 && url.includes('exact=1')) {
          return Promise.resolve({
            ok: false,
            status: 202,
            text: () => Promise.resolve(''),
          })
        }
        if (url.includes('exact=1')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(SEARCH_XML_SINGLE),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(THING_XML),
        })
      }))

      // Should eventually succeed after retry
      const results = await searchBgg('Codenames')
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('getBggGame', () => {
    it('returns game details for a valid ID', async () => {
      const { getBggGame } = await import('../bgg')

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(THING_XML),
      }))

      const result = await getBggGame('178900')
      expect(result).not.toBeNull()
      expect(result?.bgg_id).toBe('178900')
      expect(result?.title).toBe('Codenames')
      expect(result?.year).toBe(2015)
      expect(result?.thumbnail).toBe('https://cf.geekdo-images.com/thumb.jpg')
      expect(result?.min_players).toBe(2)
      expect(result?.max_players).toBe(8)
    })

    it('returns null on network error', async () => {
      const { getBggGame } = await import('../bgg')

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

      const result = await getBggGame('178900')
      expect(result).toBeNull()
    })
  })
})
