// Loops.so email marketing integration.
// Used for behavior-triggered sequences and PH launch retention campaign.
// Docs: https://loops.so/docs/api-reference

const LOOPS_API_KEY = process.env.LOOPS_API_KEY ?? ''
const LOOPS_BASE_URL = 'https://app.loops.so/api/v1'

function isEnabled(): boolean {
  return !!LOOPS_API_KEY
}

interface LoopsContact {
  email: string
  firstName?: string | null
  userId: string
  userGroup: string // 'free' | 'essential' | 'pro'
  completedFrameworks?: number
  subscriptionStatus?: string
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  primaryArchetype?: string | null
  topTrait?: string | null
}

// Create or update a contact in Loops. Called on signup and whenever key properties change.
export async function upsertLoopsContact(contact: LoopsContact): Promise<void> {
  if (!isEnabled()) return

  const body: Record<string, unknown> = {
    email: contact.email,
    userId: contact.userId,
    userGroup: contact.userGroup,
  }
  if (contact.firstName) body.firstName = contact.firstName
  if (contact.completedFrameworks !== undefined) body.completedFrameworks = contact.completedFrameworks
  if (contact.subscriptionStatus) body.subscriptionStatus = contact.subscriptionStatus
  if (contact.utmSource) body.utmSource = contact.utmSource
  if (contact.utmMedium) body.utmMedium = contact.utmMedium
  if (contact.utmCampaign) body.utmCampaign = contact.utmCampaign
  if (contact.primaryArchetype) body.primaryArchetype = contact.primaryArchetype
  if (contact.topTrait) body.topTrait = contact.topTrait

  try {
    const res = await fetch(`${LOOPS_BASE_URL}/contacts/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error('[loops] upsertContact failed', res.status, await res.text())
    }
  } catch (err) {
    console.error('[loops] upsertContact error:', err)
  }
}

// Send a behavioral event to Loops to trigger automations and update contact properties.
export async function sendLoopsEvent(
  email: string,
  eventName: string,
  properties?: Record<string, string | number | boolean>,
): Promise<void> {
  if (!isEnabled()) return

  try {
    const res = await fetch(`${LOOPS_BASE_URL}/events/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, eventName, ...properties }),
    })
    if (!res.ok) {
      console.error('[loops] sendEvent failed', eventName, res.status, await res.text())
    }
  } catch (err) {
    console.error('[loops] sendEvent error:', eventName, err)
  }
}
