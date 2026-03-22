interface TestimonialSnippetProps {
  firstName: string
  quote: string
  rating: number
  personalityTag?: string
}

/** Compact single-row testimonial for gates and paywall pages */
export function TestimonialSnippet({ firstName, quote, rating, personalityTag }: TestimonialSnippetProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/40 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-stone-400">
        {firstName[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? 'text-amber-400 text-[11px]' : 'text-stone-700 text-[11px]'}>
              ★
            </span>
          ))}
        </div>
        <p className="text-xs text-stone-400 leading-relaxed italic line-clamp-2">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="mt-1 text-[10px] font-medium text-stone-500">
          {firstName}{personalityTag ? ` · ${personalityTag}` : ''}
        </p>
      </div>
    </div>
  )
}
