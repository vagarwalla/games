import type { EbayListing } from './types'

// eBay Finding API — free official API, requires App ID from developer.ebay.com
// Set EBAY_APP_ID in .env.local (or Vercel env vars)
// Get one free at: https://developer.ebay.com/my/keys

const FINDING_API_URL = 'https://svcs.ebay.com/services/search/FindingService/v1'

// Condition IDs accepted: Used (3000) covers all used subcategories.
// We then filter by conditionDisplayName for "Like New" and "Very Good" only.
const ACCEPTABLE_CONDITIONS = ['like new', 'very good']

function isAcceptableCondition(name: string): boolean {
  return ACCEPTABLE_CONDITIONS.some((c) => name.toLowerCase().includes(c))
}

interface FindingItem {
  itemId: string[]
  title: string[]
  viewItemURL: string[]
  galleryURL?: string[]
  sellingStatus: {
    currentPrice: { __value__: string }[]
    convertedCurrentPrice?: { __value__: string }[]
  }[]
  shippingInfo?: {
    shippingServiceCost?: { __value__: string }[]
    shippingType?: string[]
  }[]
  condition?: {
    conditionId?: string[]
    conditionDisplayName?: string[]
  }[]
  listingInfo?: {
    listingType?: string[]
    buyItNowAvailable?: string[]
  }[]
}

export async function fetchEbayListings(gameName: string): Promise<EbayListing[]> {
  const appId = process.env.EBAY_APP_ID
  if (!appId) {
    console.warn('EBAY_APP_ID not set — cannot fetch eBay listings')
    return []
  }

  try {
    const keywords = encodeURIComponent(`${gameName} board game`)
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.13.0',
      'SECURITY-APPNAME': appId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      keywords: `${gameName} board game`,
      'itemFilter(0).name': 'ListingType',
      'itemFilter(0).value': 'FixedPrice',
      'itemFilter(1).name': 'Condition',
      'itemFilter(1).value(0)': '3000',
      'itemFilter(2).name': 'LocatedIn',
      'itemFilter(2).value': 'US',
      sortOrder: 'PricePlusShippingLowest',
      'paginationInput.entriesPerPage': '20',
      'paginationInput.pageNumber': '1',
      'outputSelector(0)': 'SellerInfo',
      'outputSelector(1)': 'PictureURLLarge',
    })

    const res = await fetch(`${FINDING_API_URL}?${params}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      console.warn(`eBay Finding API returned ${res.status}`)
      return []
    }

    const data = await res.json()
    const response = data?.findItemsByKeywordsResponse?.[0]
    const ack = response?.ack?.[0]

    if (ack !== 'Success' && ack !== 'Warning') {
      console.warn('eBay Finding API error:', JSON.stringify(response?.errorMessage ?? data))
      return []
    }

    const items: FindingItem[] = response?.searchResult?.[0]?.item ?? []
    const listings: EbayListing[] = []

    for (const item of items) {
      const conditionName = item.condition?.[0]?.conditionDisplayName?.[0] ?? ''
      if (!isAcceptableCondition(conditionName)) continue

      const priceStr = item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ ?? '0'
      const price = parseFloat(priceStr)
      if (!price || price <= 0) continue

      const shippingCostStr = item.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ ?? '0'
      const shippingType = item.shippingInfo?.[0]?.shippingType?.[0] ?? ''
      const shipping = shippingType === 'Free' ? 0 : parseFloat(shippingCostStr) || 0

      const url = item.viewItemURL?.[0] ?? ''
      if (!url) continue

      listings.push({
        id: item.itemId?.[0] ?? '',
        title: item.title?.[0] ?? '',
        price,
        shipping,
        total: price + shipping,
        condition: conditionName,
        url,
        image: item.galleryURL?.[0] ?? null,
      })
    }

    listings.sort((a, b) => a.total - b.total)
    return listings.slice(0, 5)
  } catch (err) {
    console.error('eBay Finding API error:', err)
    return []
  }
}

/** Returns a direct eBay search URL for a game (used when no API key is configured). */
export function ebaySearchUrl(gameName: string): string {
  const query = encodeURIComponent(`${gameName} board game complete`)
  return `https://www.ebay.com/sch/i.html?_nkw=${query}&LH_BIN=1&LH_ItemCondition=3&_sop=15`
}
