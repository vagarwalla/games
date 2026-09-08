'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateStackDialog({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!open) return null

  async function handleCreate() {
    if (!name.trim()) {
      toast.error('Please enter a stack name')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/rolled/stacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) throw new Error('Failed to create stack')
      const stack = await res.json()
      toast.success(`Stack "${stack.name}" created!`)
      onClose()
      setName('')
      router.push(`/rolled/stack/${stack.slug}`)
      router.refresh()
    } catch {
      toast.error('Failed to create stack')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md shadow-2xl mx-4">
        <h2 className="text-xl font-bold mb-4 text-[var(--text)]">New Stack</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="e.g. Social Deduction Night"
          className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-amber-500 transition-colors mb-4"
          autoFocus
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Stack'}
          </button>
        </div>
      </div>
    </div>
  )
}
