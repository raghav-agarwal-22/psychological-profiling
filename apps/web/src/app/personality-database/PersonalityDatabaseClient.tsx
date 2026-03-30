'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Character, Category } from './characters-data'

const CATEGORIES: Category[] = ['Movies', 'TV Shows', 'Books', 'Music', 'Business']

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

// Color coding by MBTI temperament group
const MBTI_COLORS: Record<string, { badge: string; bg: string; border: string }> = {
  // Analysts — violet
  INTJ: { badge: 'text-violet-400 bg-violet-500/10 ring-violet-500/30', bg: 'bg-violet-500/5', border: 'border-violet-500/20' },
  INTP: { badge: 'text-violet-400 bg-violet-500/10 ring-violet-500/30', bg: 'bg-violet-500/5', border: 'border-violet-500/20' },
  ENTJ: { badge: 'text-violet-400 bg-violet-500/10 ring-violet-500/30', bg: 'bg-violet-500/5', border: 'border-violet-500/20' },
  ENTP: { badge: 'text-violet-400 bg-violet-500/10 ring-violet-500/30', bg: 'bg-violet-500/5', border: 'border-violet-500/20' },
  // Diplomats — emerald
  INFJ: { badge: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
  INFP: { badge: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
  ENFJ: { badge: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
  ENFP: { badge: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
  // Sentinels — sky
  ISTJ: { badge: 'text-sky-400 bg-sky-500/10 ring-sky-500/30', bg: 'bg-sky-500/5', border: 'border-sky-500/20' },
  ISFJ: { badge: 'text-sky-400 bg-sky-500/10 ring-sky-500/30', bg: 'bg-sky-500/5', border: 'border-sky-500/20' },
  ESTJ: { badge: 'text-sky-400 bg-sky-500/10 ring-sky-500/30', bg: 'bg-sky-500/5', border: 'border-sky-500/20' },
  ESFJ: { badge: 'text-sky-400 bg-sky-500/10 ring-sky-500/30', bg: 'bg-sky-500/5', border: 'border-sky-500/20' },
  // Explorers — amber
  ISTP: { badge: 'text-amber-400 bg-amber-500/10 ring-amber-500/30', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
  ISFP: { badge: 'text-amber-400 bg-amber-500/10 ring-amber-500/30', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
  ESTP: { badge: 'text-amber-400 bg-amber-500/10 ring-amber-500/30', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
  ESFP: { badge: 'text-amber-400 bg-amber-500/10 ring-amber-500/30', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
}

const CATEGORY_ICONS: Record<Category, string> = {
  Movies: '◎',
  'TV Shows': '◈',
  Books: '◇',
  Music: '✦',
  Business: '◉',
}

function getMbtiColors(mbti: string) {
  return MBTI_COLORS[mbti] ?? {
    badge: 'text-stone-400 bg-stone-500/10 ring-stone-500/30',
    bg: 'bg-stone-500/5',
    border: 'border-stone-500/20',
  }
}

function CharacterCard({ character }: { character: Character }) {
  const colors = getMbtiColors(character.mbti)
  return (
    <article
      id={character.id}
      className={[
        'flex flex-col gap-3 rounded-2xl border p-5 transition-colors',
        'border-stone-800 bg-stone-900/50 hover:bg-stone-900 hover:border-stone-700',
      ].join(' ')}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-base font-medium text-stone-100">
            {character.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-stone-500">{character.source}</p>
        </div>
        <span className="shrink-0 rounded-md bg-stone-800/80 px-2 py-0.5 text-[10px] uppercase tracking-widest text-stone-500">
          {character.category}
        </span>
      </div>

      {/* Type badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={[
            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
            colors.badge,
          ].join(' ')}
        >
          {character.mbti}
        </span>
        <span className="inline-flex items-center rounded-full bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-400 ring-1 ring-stone-700/50">
          {character.enneagram}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-stone-500">{character.description}</p>
    </article>
  )
}

interface Props {
  characters: Character[]
}

export function PersonalityDatabaseClient({ characters }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [activeMbti, setActiveMbti] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return characters.filter((c) => {
      if (activeCategory !== 'All' && c.category !== activeCategory) return false
      if (activeMbti !== 'All' && c.mbti !== activeMbti) return false
      if (q) {
        return (
          c.name.toLowerCase().includes(q) ||
          c.source.toLowerCase().includes(q) ||
          c.mbti.toLowerCase().includes(q) ||
          c.enneagram.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [characters, search, activeCategory, activeMbti])

  // When grouping, only show categories that have at least one result
  const grouped = useMemo(() => {
    const map = new Map<Category, Character[]>()
    for (const cat of CATEGORIES) {
      const entries = filtered.filter((c) => c.category === cat)
      if (entries.length > 0) map.set(cat, entries)
    }
    return map
  }, [filtered])

  const hasResults = filtered.length > 0

  function clearFilters() {
    setSearch('')
    setActiveCategory('All')
    setActiveMbti('All')
  }

  const isFiltered = search.trim() !== '' || activeCategory !== 'All' || activeMbti !== 'All'

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 text-[10px] uppercase tracking-widest text-amber-500/70">
            Personality Database
          </p>
          <h1 className="mb-4 font-serif text-4xl font-medium tracking-tight text-stone-100 sm:text-5xl">
            Famous Characters &amp; Celebrities
          </h1>
          <p className="mb-8 text-base text-stone-400 leading-relaxed sm:text-lg">
            Browse MBTI types and Enneagram numbers for {characters.length} fictional characters and
            real-world icons — from Darth Vader to Elon Musk. Search, filter, and find yours.
          </p>

          {/* CTA strip */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quiz/16-types"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              Find your MBTI type →
            </Link>
            <Link
              href="/quiz/enneagram"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-6 py-3 text-sm font-semibold text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-colors"
            >
              Find your Enneagram →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Search + Filters ──────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 border-y border-stone-800/60 bg-stone-950/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl space-y-3">
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-stone-600 text-sm">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Search by name, show, MBTI type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-900 py-2.5 pl-8 pr-4 text-sm text-stone-200 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          {/* Filter rows */}
          <div className="flex flex-wrap gap-2">
            {/* Category filters */}
            <button
              onClick={() => setActiveCategory('All')}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeCategory === 'All'
                  ? 'bg-amber-500 text-stone-950'
                  : 'border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300',
              ].join(' ')}
            >
              All categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)}
                className={[
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-amber-500 text-stone-950'
                    : 'border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300',
                ].join(' ')}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {/* MBTI filter */}
            <button
              onClick={() => setActiveMbti('All')}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeMbti === 'All'
                  ? 'bg-stone-700 text-stone-100'
                  : 'border border-stone-800 text-stone-600 hover:border-stone-700 hover:text-stone-400',
              ].join(' ')}
            >
              All types
            </button>
            {MBTI_TYPES.map((t) => {
              const colors = getMbtiColors(t)
              const isActive = activeMbti === t
              return (
                <button
                  key={t}
                  onClick={() => setActiveMbti(t === activeMbti ? 'All' : t)}
                  className={[
                    'rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition-colors',
                    isActive
                      ? colors.badge + ' opacity-100'
                      : 'border-stone-800 text-stone-600 ring-stone-800 hover:text-stone-400',
                  ].join(' ')}
                >
                  {t}
                </button>
              )
            })}
          </div>

          {/* Results summary + clear */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-600">
              {isFiltered
                ? `${filtered.length} of ${characters.length} entries`
                : `${characters.length} entries across ${CATEGORIES.length} categories`}
            </p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Character Grid ────────────────────────────────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {!hasResults ? (
            <div className="py-20 text-center">
              <p className="mb-2 text-stone-400">No characters matched your search.</p>
              <button
                onClick={clearFilters}
                className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-14">
              {Array.from(grouped.entries()).map(([category, entries]) => (
                <div key={category}>
                  {/* Category heading */}
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-lg text-amber-400">{CATEGORY_ICONS[category]}</span>
                    <h2 className="font-serif text-xl text-stone-200">{category}</h2>
                    <span className="rounded-full bg-stone-800/80 px-2 py-0.5 text-[10px] text-stone-500">
                      {entries.length}
                    </span>
                    <div className="flex-1 border-t border-stone-800/60" />
                  </div>

                  {/* Cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {entries.map((c) => (
                      <CharacterCard key={c.id} character={c} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MBTI Type legend ──────────────────────────────────────────────── */}
      <section className="border-t border-stone-800/60 bg-stone-900/30 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-[10px] uppercase tracking-widest text-stone-600">
            MBTI type groups
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Analysts', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', desc: 'Intuitive and thinking — strategic, innovative, and intellectually driven.' },
              { label: 'Diplomats', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Intuitive and feeling — idealistic, empathic, and purpose-oriented.' },
              { label: 'Sentinels', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', desc: 'Observant and judging — structured, reliable, and community-focused.' },
              { label: 'Explorers', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', desc: 'Observant and prospecting — spontaneous, practical, and present-focused.' },
            ].map((group) => (
              <div
                key={group.label}
                className={['rounded-2xl border p-5', group.bg].join(' ')}
              >
                <p className={['mb-1 text-sm font-semibold', group.color].join(' ')}>{group.label}</p>
                <p className="mb-3 text-[11px] text-stone-500">{group.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.types.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setActiveMbti(t); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={['rounded-full px-2 py-0.5 text-xs font-medium ring-1', getMbtiColors(t).badge].join(' ')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-amber-500/70">
            Find your type
          </p>
          <h2 className="mb-4 font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
            Which character are you most like?
          </h2>
          <p className="mb-8 text-stone-400 leading-relaxed">
            Take our free personality quizzes to find out your MBTI type and Enneagram number. No
            account needed — instant results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quiz/16-types"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              Free 16-type test →
            </Link>
            <Link
              href="/quiz/enneagram"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3.5 text-sm font-semibold text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-colors"
            >
              Free Enneagram test →
            </Link>
          </div>
          <p className="mt-5 text-xs text-stone-600">
            Takes 3–5 minutes &nbsp;·&nbsp; No account required &nbsp;·&nbsp; Instant results
          </p>

          {/* Deeper portrait CTA */}
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-stone-800 bg-stone-900/50 p-7">
            <p className="mb-1 text-sm font-semibold text-stone-200">Want more than a type label?</p>
            <p className="mb-5 text-sm text-stone-500">
              Innermind combines six validated frameworks — Big Five, Enneagram, Attachment Style,
              Jungian Archetypes, and more — into one AI-written psychological portrait of who you actually are.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-stone-800 px-6 py-3 text-sm font-semibold text-stone-200 hover:bg-stone-700 transition-colors"
            >
              Take the full assessment →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
