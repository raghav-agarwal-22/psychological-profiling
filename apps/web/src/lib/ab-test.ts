/**
 * A/B test: blurred result preview vs full reveal
 * INN-186 — measure free-to-pro conversion impact
 *
 * Variant assignment: deterministic hash of userId (last hex digit parity)
 *   even (0,2,4,6,8,a,c,e) → 'control'  (full results)
 *   odd  (1,3,5,7,9,b,d,f) → 'blurred'  (partial + upgrade CTA)
 */

export type ABVariant = 'control' | 'blurred'

const STORAGE_KEY = 'ab_blurred_preview'

/** Deterministic variant from userId (UUID). Falls back to 'control' if userId is missing. */
function computeVariant(userId: string): ABVariant {
  const last = userId.replace(/-/g, '').slice(-1).toLowerCase()
  const odd = '13579bdf'.includes(last)
  return odd ? 'blurred' : 'control'
}

/**
 * Initialise the A/B test for a user. Persists to localStorage so the
 * assignment is stable across page reloads even after the user object changes.
 */
export function initABTest(userId: string): ABVariant {
  if (typeof window === 'undefined') return 'control'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'control' || stored === 'blurred') return stored
  const variant = computeVariant(userId)
  localStorage.setItem(STORAGE_KEY, variant)
  return variant
}

/** Read the already-initialised variant (or 'control' if not yet set). */
export function getABVariant(): ABVariant {
  if (typeof window === 'undefined') return 'control'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'blurred' ? 'blurred' : 'control'
}
