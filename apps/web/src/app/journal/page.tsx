'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface JournalEntry {
  id: string
  title: string | null
  body: string
  profileId: string | null
  prompt: string | null
  tags: string[]
  mood: number | null
  createdAt: string
  updatedAt: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function entrySnippet(body: string, maxLen = 160): string {
  if (body.length <= maxLen) return body
  return body.slice(0, maxLen).trimEnd() + '…'
}

export default function JournalPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // New entry form state
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<{ entries: JournalEntry[] }>('/api/journal', token)
      .then((data) => setEntries(data.entries))
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  async function handleSave() {
    if (!newBody.trim()) return
    const token = getToken()
    if (!token) return

    setSaving(true)
    setSaveError(null)

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    try {
      const { entry } = await api.post<{ entry: JournalEntry }>(
        '/api/journal',
        {
          title: newTitle.trim() || today,
          body: newBody.trim(),
        },
        token,
      )
      setEntries((prev) => [entry, ...prev])
      setNewTitle('')
      setNewBody('')
      setShowForm(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const token = getToken()
    if (!token) return
    setDeletingId(id)
    try {
      await api.del(`/api/journal/${id}`, token)
      setEntries((prev) => prev.filter((e) => e.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-100">Your Reflections</h1>
          <p className="mt-1 text-sm text-stone-500">
            {entries.length === 0
              ? 'No entries yet'
              : `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((v) => !v)
            setSaveError(null)
          }}
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          {showForm ? 'Cancel' : '+ New entry'}
        </button>
      </div>

      {/* Inline new entry form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-stone-700 bg-stone-900/70 p-6">
          <h2 className="mb-4 font-serif text-lg text-stone-200">New reflection</h2>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
              Title <span className="font-normal normal-case text-stone-600">(optional)</span>
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              className="w-full rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
              Reflection
            </label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="What did you discover today? What patterns are you noticing? What are you sitting with?"
              rows={6}
              className="w-full resize-y rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
              style={{ minHeight: '200px' }}
            />
          </div>

          {saveError && (
            <p className="mb-3 rounded-xl border border-rose-800/30 bg-rose-950/20 px-4 py-2.5 text-sm text-rose-400">
              {saveError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setShowForm(false)
                setSaveError(null)
              }}
              className="text-sm text-stone-500 transition-colors hover:text-stone-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!newBody.trim() || saving}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save entry'}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-700 p-12 text-center">
          <div className="mb-4 text-4xl text-stone-600">◎</div>
          <p className="mb-2 font-serif text-lg text-stone-300">No reflections yet</p>
          <p className="text-sm text-stone-500">
            Start with what you discovered in your last assessment. Writing helps integrate
            what you learn about yourself.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Write your first reflection
          </button>
        </div>
      )}

      {/* Entry list */}
      {entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            const isDeleting = deletingId === entry.id
            return (
              <div
                key={entry.id}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 px-6 py-5 transition-colors hover:border-stone-700"
              >
                {/* Entry header */}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {entry.title && (
                      <p className="mb-1 font-medium text-stone-200 leading-snug truncate">
                        {entry.title}
                      </p>
                    )}
                    <p className="text-xs text-stone-500">{formatDate(entry.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={isDeleting}
                    aria-label="Delete entry"
                    className="shrink-0 rounded-lg border border-stone-700 px-2.5 py-1.5 text-xs text-stone-500 transition-colors hover:border-rose-800/50 hover:bg-rose-950/20 hover:text-rose-400 disabled:opacity-40"
                  >
                    {isDeleting ? '…' : 'Delete'}
                  </button>
                </div>

                {/* Body */}
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  {entry.prompt && (
                    <p className="mb-2 text-xs italic text-amber-400/70">
                      &ldquo;{entry.prompt}&rdquo;
                    </p>
                  )}
                  <p className="text-sm leading-relaxed text-stone-300">
                    {isExpanded ? entry.body : entrySnippet(entry.body)}
                  </p>
                  {entry.body.length > 160 && (
                    <button className="mt-2 text-xs text-amber-400 transition-colors hover:text-amber-300">
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-stone-700 bg-stone-800 px-2.5 py-0.5 text-xs text-stone-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
