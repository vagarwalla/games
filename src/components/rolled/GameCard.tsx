'use client'

import type { GameStackItem, PriceResult } from '@/lib/rolled/types'

interface Props {
  item: GameStackItem
  priceResult?: PriceResult
  onRemove: (id: string) => void
}

export function GameCard({ item, priceResult, onRemove }: Props) {
  const best = priceResult?.best

  return (
    <div className="game-card group flex gap-4 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-sm hover:shadow-md transition-all">
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--hover-bg)] flex items-center justify-center">
        {item.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
              const parent = (e.target as HTMLImageElement).parentElement
              if (parent) parent.innerHTML = '<span class="text-2xl">🎲</span>'
            }}
          />
        ) : (
          <span className="text-2xl">🎲</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-[var(--text)] leading-tight">{item.title}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {item.year && (
                <span className="text-xs text-[var(--muted)]">{item.year}</span>
              )}
              {item.min_players != null && item.max_players != null && (
                <span className="text-xs text-[var(--muted)]">
                  {item.min_players === item.max_players
                    ? `${item.min_players} players`
                    : `${item.min_players}–${item.max_players} players`}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted)] hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 flex-shrink-0"
            aria-label="Remove game"
          >
            ✕
          </button>
        </div>

        {/* Deal info */}
        {priceResult && (
          <div className="mt-2">
            {best ? (
              <a
                href={best.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm"
              >
                <span className="font-bold text-emerald-500">${best.total.toFixed(2)}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    best.condition === 'Like New'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}
                >
                  {best.condition}
                </span>
                <span className="text-xs text-amber-500 hover:text-amber-400">View on eBay →</span>
              </a>
            ) : (
              <span className="text-xs text-[var(--muted)]">No deals found</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
