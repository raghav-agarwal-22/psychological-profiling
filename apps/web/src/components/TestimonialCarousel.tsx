'use client'

import { useEffect, useState } from 'react'
import type { TestimonialItem } from './TestimonialGrid'

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const items = testimonials.slice(0, 6)
  if (items.length === 0) return null

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(id)
  }, [items.length])

  const t = items[index]
  if (!t) return null

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div
        className="transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Stars */}
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < t.rating ? 'text-amber-400 text-sm' : 'text-stone-700 text-sm'}
              >
                ★
              </span>
            ))}
          </div>
          <p className="mb-4 font-serif text-base text-stone-300 leading-relaxed italic sm:text-lg">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-stone-400">
              {t.firstName[0]?.toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-stone-300">{t.firstName}</p>
              {t.personalityTag && (
                <p className="text-[11px] text-stone-600">{t.personalityTag}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="mt-5 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setVisible(false); setTimeout(() => { setIndex(i); setVisible(true) }, 150) }}
              className={[
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-4 bg-amber-400' : 'w-1.5 bg-stone-700 hover:bg-stone-500',
              ].join(' ')}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
