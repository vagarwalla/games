'use client'

import { useState } from 'react'
import type { GameStackItem, PriceResult } from '@/lib/rolled/types'
import { toast } from 'sonner'

interface Props {
  items: GameStackItem[]
  onResults: (results: PriceResult[]) => void
}

export function DealPanel({ items, onResults }: Props) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PriceResult[] | null>(null)
  const [noApiKey, setNoApiKey] = useState(false)

  async function handleFindDeals() {
    if (items.length === 0) {
      toast.error('Add some games to find deals')
      return
    }
    setLoading(true)
    setNoApiKey(false)
    try {
      const res = await fetch('/api/rolled/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) throw new Error('Failed to fetch deals')
      const data: PriceResult[] = await res.json()
      setResults(data)
      onResults(data)
      const found = data.filter((r) => r.best).length
      if (found === 0) {
        setNoApiKey(true)
        toast.info('No deals fetched — eBay search links provided instead')
      } else {
        toast.success(`Found deals for ${found} of ${data.length} games`)
      }
    } catch {
      toast.error('Failed to fetch deals — try again')
    } finally {
      setLoading(false)
    }
  }

  const totalBest = results ? results.reduce((sum, r) => sum + (r.best?.total ?? 0), 0) : null
  const hasAnyDeals = results ? results.some((r) => r.best !== null) : false

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-[var(--card-border)]">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          🎯 Best Deals
        </h2>
        {items.length > 0 ? (
          <p className="text-sm text-[var(--muted)] mt-1">
            {items.length} game{items.length !== 1 ? 's' : ''} in stack
          </p>
        ) : (
          <p className="text-sm text-[var(--muted)] mt-1">Add games to find deals</p>
        )}
      </div>

      {/* Find Deals button */}
      <div className="p-5 pb-0">
        <button
          onClick={handleFindDeals}
          disabled={loading || items.length === 0}
          className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-amber-500/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">🎲</span>
              Rolling for deals...
            </span>
          ) : (
            '🎲 Find Deals'
          )}
        </button>
      </div>

      {/* No API key notice */}
      {noApiKey && results && !hasAnyDeals && (
        <div className="mx-5 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400">
          <p className="font-semibold mb-1">eBay API key not configured</p>
          <p className="text-amber-600/80 dark:text-amber-400/80">
            Add <code className="bg-amber-500/10 px-1 rounded">EBAY_APP_ID</code> to your Vercel env vars to get live prices.{' '}
            <a
              href="https://developer.ebay.com/my/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Get a free key →
            </a>
          </p>
          <p className="mt-1 text-amber-600/70 dark:text-amber-400/70">
            For now, search links are provided for each game below.
          </p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="mt-4 border-t border-[var(--card-border)]">
          {hasAnyDeals && totalBest !== null && totalBest > 0 && (
            <div className="px-5 py-3 bg-emerald-500/10 border-b border-[var(--card-border)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-500">Total if all bought</span>
                <span className="text-lg font-bold text-emerald-500">${totalBest.toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="divide-y divide-[var(--card-border)] max-h-[460px] overflow-y-auto">
            {results.map((result) => (
              <div key={result.item_id} className="p-4">
                <div className="font-medium text-[var(--text)] text-sm mb-1.5 truncate">
                  {result.title}
                </div>
                {result.best ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-500">
                        ${result.best.total.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          result.best.condition.toLowerCase() === 'like new'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-blue-500/15 text-blue-400'
                        }`}
                      >
                        {result.best.condition}
                      </span>
                    </div>
                    <a
                      href={result.best.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors flex-shrink-0"
                    >
                      Buy →
                    </a>
                  </div>
                ) : (
                  <a
                    href={result.ebay_search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-500 hover:text-amber-400 underline transition-colors"
                  >
                    Search eBay →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
