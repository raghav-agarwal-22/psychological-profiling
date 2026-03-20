/**
 * Ads conversion tracking utilities.
 * Fires events to Google Ads (via GTM dataLayer) and Meta Pixel.
 * All functions are no-ops if the pixel/tag IDs are not configured.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    fbq: (...args: unknown[]) => void
    gtag: (...args: unknown[]) => void
  }
}

// Push an event to the GTM dataLayer
export function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(event)
}

// Fire a Meta Pixel event
export function fireMetaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  if (params) {
    window.fbq('track', eventName, params)
  } else {
    window.fbq('track', eventName)
  }
}

// Fire a Google Ads conversion event via gtag (injected via GTM)
export function fireGoogleConversion(conversionLabel: string, value?: number) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  if (!gadsId) return
  window.gtag('event', 'conversion', {
    send_to: `${gadsId}/${conversionLabel}`,
    value: value ?? 0,
    currency: 'USD',
  })
}

/**
 * Track signup conversion.
 * Fire on email verification / account creation success.
 */
export function trackSignup() {
  // GTM
  pushDataLayer({ event: 'signup_complete', category: 'acquisition' })
  // Meta Pixel
  fireMetaEvent('CompleteRegistration')
  // Google Ads
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL
  if (label) fireGoogleConversion(label)
}

/**
 * Track assessment completion.
 * Fire when a user finishes a psychology assessment.
 */
export function trackAssessmentComplete(framework: string) {
  pushDataLayer({ event: 'assessment_complete', framework, category: 'engagement' })
  fireMetaEvent('CustomEvent', { event_name: 'assessment_complete', framework })
}

/**
 * Track purchase/subscription conversion.
 * Fire when Stripe checkout succeeds (user lands on /dashboard?upgraded=1).
 */
export function trackPurchase(plan: string, valueMonthlyCents: number) {
  const value = valueMonthlyCents / 100
  pushDataLayer({
    event: 'purchase',
    ecommerce: {
      currency: 'USD',
      value,
      items: [{ item_id: plan, item_name: `Innermind ${plan}`, price: value, quantity: 1 }],
    },
  })
  fireMetaEvent('Purchase', { currency: 'USD', value })
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL
  if (label) fireGoogleConversion(label, value)
}
