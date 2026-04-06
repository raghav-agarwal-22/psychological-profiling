import { describe, it, expect } from 'vitest'

/**
 * Tests for the B2B professional tier middleware gate logic.
 * Tests the pure decision function extracted from apps/web/src/middleware.ts.
 */

// Extract the middleware gate decision logic
function shouldRedirectProfessional(pathname: string, enableProfessionalTier: string | undefined): boolean {
  if (pathname.startsWith('/professional')) {
    return enableProfessionalTier !== 'true'
  }
  return false
}

describe('Professional tier middleware gate', () => {
  it('redirects /professional when env var is not set', () => {
    expect(shouldRedirectProfessional('/professional', undefined)).toBe(true)
  })

  it('redirects /professional when env var is false', () => {
    expect(shouldRedirectProfessional('/professional', 'false')).toBe(true)
  })

  it('redirects /professional when env var is empty string', () => {
    expect(shouldRedirectProfessional('/professional', '')).toBe(true)
  })

  it('allows /professional when env var is true', () => {
    expect(shouldRedirectProfessional('/professional', 'true')).toBe(false)
  })

  it('redirects /professional/workspace-id when flag is off', () => {
    expect(shouldRedirectProfessional('/professional/abc-123', undefined)).toBe(true)
  })

  it('allows /professional/workspace-id when flag is on', () => {
    expect(shouldRedirectProfessional('/professional/abc-123', 'true')).toBe(false)
  })

  it('does not redirect non-professional routes', () => {
    expect(shouldRedirectProfessional('/upgrade', undefined)).toBe(false)
    expect(shouldRedirectProfessional('/dashboard', undefined)).toBe(false)
    expect(shouldRedirectProfessional('/', undefined)).toBe(false)
    expect(shouldRedirectProfessional('/quiz/big-five', undefined)).toBe(false)
  })

  it('does not redirect routes that contain professional but do not start with it', () => {
    expect(shouldRedirectProfessional('/about/professional', undefined)).toBe(false)
  })
})
