'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/rolled/ThemeToggle'
import { GameCard } from '@/components/rolled/GameCard'
import { GameSearch } from '@/components/rolled/GameSearch'
import { DealPanel } from '@/components/rolled/DealPanel'
import type { GameStack, GameStackItem, PriceResult } from '@/lib/rolled/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default function StackPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const [stack, setStack] = useState<GameStack | null>(null)
  const [items, setItems] = useState<GameStackItem[]>([])
  const [priceResults, setPriceResults] = useState<PriceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  /*
   * Fetched inside the effect rather than in a helper called by it, so the
   * state writes land after an await — and guarded by `cancelled`, so
   * navigating between stacks quickly cannot let a slow response for the old
   * slug overwrite the new one.
   */
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch(`/api/rolled/stacks/${slug}`)
        if (cancelled) return
        if (res.status === 404) {
          toast.error('Stack not found')
          router.push('/rolled')
          return
        }
        if (!res.ok) throw new Error('Failed to fetch stack')
        const data = await res.json()
        if (cancelled) return
        setStack(data.stack)
        setItems(data.items)
      } catch {
        if (!cancelled) toast.error('Failed to load stack')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [slug, router])

  function handleItemAdded(item: GameStackItem) {
    setItems((prev) => [...prev, item])
    // Clear price results when items change
    setPriceResults([])
  }

  async function handleRemoveItem(id: string) {
    try {
      const res = await fetch(`/api/rolled/stacks/${slug}/items/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to remove game')
      setItems((prev) => prev.filter((i) => i.id !== id))
      setPriceResults((prev) => prev.filter((r) => r.item_id !== id))
      toast.success('Game removed')
    } catch {
      toast.error('Failed to remove game')
    }
  }

  async function handleDeleteStack() {
    if (!confirm('Delete this stack? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/rolled/stacks/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete stack')
      toast.success('Stack deleted')
      router.push('/rolled')
    } catch {
      toast.error('Failed to delete stack')
      setDeleting(false)
    }
  }

  function getPriceForItem(itemId: string): PriceResult | undefined {
    return priceResults.find((r) => r.item_id === itemId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-spin mb-4">🎲</div>
          <p className="text-[var(--muted)]">Loading stack...</p>
        </div>
      </div>
    )
  }

  if (!stack) return null

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/rolled"
              className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors flex-shrink-0"
            >
              <span>←</span>
              <span className="text-sm hidden sm:inline">Stacks</span>
            </Link>
            <div className="w-px h-5 bg-[var(--card-border)] flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg flex-shrink-0">🎲</span>
              <h1 className="font-bold text-[var(--text)] truncate">{stack.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDeleteStack}
              disabled={deleting}
              className="text-[var(--muted)] hover:text-red-500 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Games list */}
          <div className="space-y-4">
            {/* Add game search */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4">
              <p className="text-sm font-medium text-[var(--text)] mb-3">Add a game</p>
              <GameSearch slug={slug} onAdded={handleItemAdded} />
            </div>

            {/* Game cards */}
            {items.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--card-border)] rounded-2xl">
                <div className="text-5xl mb-4">🎲</div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-2">Stack is empty</h3>
                <p className="text-[var(--muted)] text-sm">
                  Search above to add games to this stack.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-[var(--muted)] font-medium px-1">
                  {items.length} game{items.length !== 1 ? 's' : ''}
                </p>
                {items.map((item) => (
                  <GameCard
                    key={item.id}
                    item={item}
                    priceResult={getPriceForItem(item.id)}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Deal panel (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <DealPanel items={items} onResults={setPriceResults} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--muted)] text-sm">
            made with ♥ by vaidehi &middot;{' '}
            <a
              href="https://earmarked.vercel.app"
              className="text-amber-500 hover:text-amber-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Earmarked →
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
