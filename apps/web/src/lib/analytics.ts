/**
 * Funnel analytics helpers — thin wrappers over posthog.capture.
 * Provides a typed event catalog for the acquisition → conversion funnel.
 */
import { posthog } from './posthog'

export type FunnelEvent =
  | 'landing_page_viewed'
  | 'assessment_started'
  | 'assessment_completed'
  | 'results_page_viewed'
  | 'signup_wall_shown'
  | 'signup_completed'
  | 'upgrade_initiated'
  | 'upgrade_completed'
  | 'b2b_upgrade_completed'

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
  results_page_viewed: { profile_id?: string; is_anonymous?: boolean }
  signup_wall_shown: { profile_id?: string; frameworks_completed?: number }
  signup_completed: { method?: string }
  upgrade_initiated: { tier: string; interval: string }
  upgrade_completed: { tier?: string; interval?: string }
  b2b_upgrade_completed: { workspace_id?: string; tier?: string }
}

export function track<E extends FunnelEvent>(
  event: E,
  properties?: EventProperties[E],
): void {
  if (typeof window === 'undefined') return
  posthog.capture(event, properties ?? {})
}
