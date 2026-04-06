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
  | 'exit_intent_triggered'
  | 'exit_intent_cta_clicked'
  | 'annual_auto_flip'
  | 'annual_nudge_clicked'
  | 'quiz_started'
  | 'quiz_completed'
  | 'quiz_email_captured'
  | 'bridge_cta_clicked'

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
  exit_intent_triggered: Record<string, never>
  exit_intent_cta_clicked: Record<string, never>
  annual_auto_flip: Record<string, never>
  annual_nudge_clicked: Record<string, never>
  quiz_started: { quiz_type: string }
  quiz_completed: { quiz_type: string; scores?: Record<string, number> }
  quiz_email_captured: { quiz_type: string }
  bridge_cta_clicked: { quiz_type: string; source?: string }
}

export function track<E extends FunnelEvent>(
  event: E,
  properties?: EventProperties[E],
): void {
  if (typeof window === 'undefined') return
  posthog.capture(event, properties ?? {})
}
