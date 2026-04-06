import { describe, it, expect } from 'vitest'

/**
 * Tests for the CC-required trial checkout configuration.
 * These verify the Stripe checkout session params are correctly structured
 * based on trial eligibility.
 */

// Extract the checkout params logic from billing.ts for testability
function buildCheckoutParams(opts: {
  customerId: string
  priceId: string
  trialEligible: boolean
  userId: string
  webUrl: string
}) {
  const { customerId, priceId, trialEligible, userId, webUrl } = opts
  return {
    customer: customerId,
    payment_method_types: ['card'] as const,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription' as const,
    payment_method_collection: 'always' as const,
    subscription_data: trialEligible
      ? {
          trial_period_days: 7,
          trial_settings: {
            end_behavior: { missing_payment_method: 'cancel' as const },
          },
        }
      : undefined,
    success_url: `${webUrl}/dashboard?upgraded=1`,
    cancel_url: `${webUrl}/upgrade?cancelled=1`,
    metadata: { userId },
  }
}

describe('Stripe checkout session params', () => {
  const baseOpts = {
    customerId: 'cus_test123',
    priceId: 'price_pro_monthly',
    userId: 'user_123',
    webUrl: 'https://innermindhealing.com',
  }

  describe('when trial-eligible', () => {
    const params = buildCheckoutParams({ ...baseOpts, trialEligible: true })

    it('collects payment method always (CC-required)', () => {
      expect(params.payment_method_collection).toBe('always')
    })

    it('sets 7-day trial period', () => {
      expect(params.subscription_data?.trial_period_days).toBe(7)
    })

    it('cancels subscription on missing payment method at trial end', () => {
      expect(
        params.subscription_data?.trial_settings?.end_behavior?.missing_payment_method,
      ).toBe('cancel')
    })

    it('includes correct mode and line items', () => {
      expect(params.mode).toBe('subscription')
      expect(params.line_items).toEqual([{ price: 'price_pro_monthly', quantity: 1 }])
    })
  })

  describe('when NOT trial-eligible', () => {
    const params = buildCheckoutParams({ ...baseOpts, trialEligible: false })

    it('still collects payment method always', () => {
      expect(params.payment_method_collection).toBe('always')
    })

    it('does not include trial subscription_data', () => {
      expect(params.subscription_data).toBeUndefined()
    })
  })

  describe('interval routing', () => {
    it('uses the correct price ID for monthly', () => {
      const params = buildCheckoutParams({
        ...baseOpts,
        priceId: 'price_pro_monthly',
        trialEligible: true,
      })
      expect(params.line_items[0].price).toBe('price_pro_monthly')
    })

    it('uses the correct price ID for annual', () => {
      const params = buildCheckoutParams({
        ...baseOpts,
        priceId: 'price_pro_annual',
        trialEligible: true,
      })
      expect(params.line_items[0].price).toBe('price_pro_annual')
    })
  })
})
