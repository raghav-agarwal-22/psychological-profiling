export interface TestimonialItem {
  id: string
  firstName: string
  personalityTag?: string | null
  rating: number
  quote: string
}

interface TestimonialGridProps {
  testimonials: TestimonialItem[]
  /** Max number to display */
  limit?: number
}

export function TestimonialGrid({ testimonials, limit = 6 }: TestimonialGridProps) {
  const items = testimonials.slice(0, limit)
  if (items.length === 0) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex flex-col rounded-2xl border border-stone-800 bg-stone-900/60 p-7"
        >
          {/* Stars */}
          <div className="mb-4 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < t.rating ? 'text-amber-400 text-sm' : 'text-stone-700 text-sm'}
              >
                ★
              </span>
            ))}
          </div>
          <p className="mb-6 flex-1 font-serif text-sm text-stone-300 leading-relaxed italic">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3 border-t border-stone-800 pt-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-stone-400">
              {t.firstName[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-medium text-stone-300">{t.firstName}</p>
              {t.personalityTag && (
                <p className="text-xs text-stone-600">{t.personalityTag}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
