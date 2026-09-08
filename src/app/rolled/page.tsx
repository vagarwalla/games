'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/rolled/ThemeToggle'
import { CreateStackDialog } from '@/components/rolled/CreateStackDialog'
import type { GameStack } from '@/lib/rolled/types'

export default function HomePage() {
  const [stacks, setStacks] = useState<GameStack[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchStacks()
  }, [])

  async function fetchStacks() {
    try {
      const res = await fetch('/api/rolled/stacks')
      if (res.ok) {
        const data = await res.json()
        setStacks(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <span className="text-xl font-bold text-[var(--text)]">Rolled</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors shadow-md shadow-amber-500/20"
            >
              + New Stack
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-pattern relative border-b border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-amber-500 text-sm font-medium mb-6">
            <span>🎲</span>
            <span>Board game deals, rolled up</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4 leading-tight">
            Find great board games<br />
            <span className="text-amber-500">for less.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-8">
            Build a stack of games you want secondhand. Click &ldquo;Find Deals&rdquo; to search
            eBay for Like New and Very Good condition listings — cheapest first.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-colors shadow-lg shadow-amber-500/25"
          >
            <span>🎲</span>
            Create your first stack
          </button>
        </div>
      </section>

      {/* Stacks list */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text)]">Your Stacks</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            + New Stack
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[var(--muted)]">
            <span className="animate-spin text-3xl mr-3">🎲</span>
            Loading stacks...
          </div>
        ) : stacks.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--card-border)] rounded-2xl">
            <div className="text-5xl mb-4">🎲</div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No stacks yet</h3>
            <p className="text-[var(--muted)] mb-6 text-sm">
              Create a stack to start finding deals on secondhand board games.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
            >
              Create a Stack
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <Link
                key={stack.id}
                href={`/rolled/stack/${stack.slug}`}
                className="group block bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text)] group-hover:text-amber-500 transition-colors truncate">
                      {stack.name}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      {stack.item_count ?? 0} game{stack.item_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-[var(--muted)] group-hover:text-amber-500 transition-colors text-xl flex-shrink-0">
                    🎲
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                  <span className="text-xs text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                    View &amp; find deals →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* How it works */}
        <section className="mt-20">
          <h2 className="text-xl font-bold text-[var(--text)] mb-8 text-center">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '1',
                icon: '📋',
                title: 'Build a Stack',
                desc: 'Create a named list of board games you want to buy secondhand.',
              },
              {
                step: '2',
                icon: '🔍',
                title: 'Search & Add',
                desc: 'Search BoardGameGeek to find and add games to your stack.',
              },
              {
                step: '3',
                icon: '🎲',
                title: 'Find Deals',
                desc: 'Click "Find Deals" to instantly see the cheapest Like New or Very Good listings on eBay.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-amber-500 mb-1">STEP {item.step}</div>
                <h3 className="font-bold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--muted)] text-sm">
            made with ♥ by vaidehi
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Looking for books?{' '}
            <a
              href="https://earmarked.vercel.app"
              className="text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Earmarked →
            </a>
          </p>
        </div>
      </footer>

      <CreateStackDialog open={showCreate} onClose={() => { setShowCreate(false); fetchStacks() }} />
    </div>
  )
}
