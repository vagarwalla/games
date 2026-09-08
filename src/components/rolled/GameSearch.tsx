'use client'

import { useState, useRef, useEffect } from 'react'
import type { BggSearchResult, GameStackItem } from '@/lib/rolled/types'
import { toast } from 'sonner'

interface Props {
  slug: string
  onAdded: (item: GameStackItem) => void
}

export function GameSearch({ slug, onAdded }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BggSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInput(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/rolled/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: value.trim() }),
        })
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        setResults(data)
        setShowDropdown(true)
      } catch {
        toast.error('Search failed')
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  async function handleAdd(game: BggSearchResult) {
    setAddingId(game.bgg_id)
    try {
      const res = await fetch(`/api/rolled/stacks/${slug}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      })
      if (!res.ok) throw new Error('Failed to add game')
      const item = await res.json()
      onAdded(item)
      setQuery('')
      setResults([])
      setShowDropdown(false)
      toast.success(`Added "${game.title}"`)
    } catch {
      toast.error('Failed to add game')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search BoardGameGeek..."
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-amber-500 transition-colors text-sm"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-xs animate-spin">🎲</span>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.map((game) => (
            <button
              key={game.bgg_id}
              onClick={() => handleAdd(game)}
              disabled={addingId === game.bgg_id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--hover-bg)] flex items-center justify-center">
                {game.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="text-lg">🎲</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[var(--text)] text-sm truncate">{game.title}</div>
                <div className="text-xs text-[var(--muted)]">
                  {game.year && <span>{game.year}</span>}
                  {game.min_players && game.max_players && (
                    <span className="ml-2">
                      {game.min_players}–{game.max_players} players
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-amber-500 flex-shrink-0">
                {addingId === game.bgg_id ? 'Adding...' : '+ Add'}
              </span>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !loading && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl p-4 text-center text-[var(--muted)] text-sm z-50">
          No games found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
