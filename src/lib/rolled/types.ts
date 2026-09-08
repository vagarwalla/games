export interface GameStack {
  id: string
  slug: string
  name: string
  created_at: string
  item_count?: number
}

export interface GameStackItem {
  id: string
  stack_id: string
  bgg_id: string
  title: string
  year: number | null
  thumbnail: string | null
  min_players: number | null
  max_players: number | null
  sort_order: number
  created_at: string
}

export interface BggSearchResult {
  bgg_id: string
  title: string
  year: number | null
  thumbnail: string | null
  min_players: number | null
  max_players: number | null
}

export interface EbayListing {
  id: string
  title: string
  price: number
  shipping: number | null // null = free
  total: number // price + shipping (0 if free)
  condition: string
  url: string
  image: string | null
}

export interface PriceResult {
  item_id: string
  bgg_id: string
  title: string
  listings: EbayListing[]
  best: EbayListing | null
  ebay_search_url: string  // fallback search link
}
