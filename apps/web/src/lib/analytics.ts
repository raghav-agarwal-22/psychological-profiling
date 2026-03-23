/**
 * Funnel analytics helpers — thin wrappers over posthog.capture.
 * Provides a typed event catalog for the acquisition → conversion funnel.
 */
import { posthog } from './posthog'

export type FunnelEvent =
  | 'landing_page_viewed'
  | 'assessment_started'
  | 'assessment_completed'
  | 'profile_viewed'
  | 'results_page_viewed'
  | 'signup_wall_shown'
  | 'signup_completed'
  | 'paywall_hit'
  | 'upgrade_clicked'
  | 'checkout_started'
  | 'payment_success'
  | 'upgrade_initiated'
  | 'upgrade_completed'
  | 'b2b_upgrade_completed'
  | 'referral_link_clicked'
  | 'referral_link_copied'
  | 'referral_page_viewed'
  | 'referral_signup'
  | 'referral_converted'

interface EventProperties {
  landing_page_viewed: {
    source?: string
    medium?: string
    campaign?: string
    affiliate_code?: string
    referral_code?: string
  }
  assessment_started: { framework: string }
  assessment_completed: { framework: string }
  profile_viewed: { profile_id?: string; is_anonymous?: boolean }
  results_page_viewed: { profile_id?: string; is_anonymous?: boolean }
  signup_wall_shown: { profile_id?: string; frameworks_completed?: number }
  signup_completed: { method?: string }
  paywall_hit: { section: string; source: string; ab_variant?: string }
  upgrade_clicked: { tier: string; interval: string; ab_variant?: string }
  checkout_started: { tier: string; interval: string; ab_variant?: string }
  payment_success: { tier?: string; interval?: string }
  upgrade_initiated: { tier: string; interval: string }
  upgrade_completed: { tier?: string; interval?: string }
  b2b_upgrade_completed: { workspace_id?: string; tier?: string }
  referral_link_clicked: { code: string }
  referral_link_copied: { code: string; source: string }
  referral_page_viewed: { referrer_name?: string; code: string }
  referral_signup: { code: string }
  referral_converted: { code: string }
}

export function track<E extends FunnelEvent>(
  event: E,
  properties?: EventProperties[E],
): void {
  if (typeof window === 'undefined') return
  posthog.capture(event, properties ?? {})
}
