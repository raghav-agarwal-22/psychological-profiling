# Loops Email Marketing Platform — Setup & Integration Guide

**Status:** Spec complete — requires founder account creation + Growth Engineer API integration
**Platform choice:** Loops (over ConvertKit) — SaaS-native, behavior-triggered, Resend-compatible DX
**Sending domain:** innermindhealing.com (verify in Loops dashboard after account creation)

---

## Why Loops Over ConvertKit

| Factor | Loops | ConvertKit |
|--------|-------|------------|
| SaaS segmentation | Built-in by plan/behavior | Manual tags |
| API simplicity | REST, Resend-like | Bulky legacy API |
| Pricing | Free up to 1,000 contacts | $15/mo minimum |
| Automations | Event-triggered natively | Sequence-based |
| Transactional hybrid | Yes (can replace Resend) | No |

---

## Step 1: Founder Account Setup (Human required)

1. Go to [loops.so](https://loops.so) → Create account with `team@innermindhealing.com`
2. **Add sending domain:**
   - Settings → Sending Domain → Add `innermindhealing.com`
   - Add the 3 DNS records to your domain registrar (DKIM, DMARC, SPF)
   - Click "Verify" — takes 5–30 min to propagate
3. **Create API key:** Settings → API → Create key → copy to `.env` as `LOOPS_API_KEY`
4. **Set list name:** Contacts → List → rename to "Innermind Users"

---

## Step 2: Segments to Create

Create these segments in Loops (Contacts → Segments → New):

### Segment 1: Free Users
```
Filter: userGroup = "free"
```

### Segment 2: Pro Subscribers
```
Filter: userGroup = "pro"
```

### Segment 3: Completed Portrait (5 frameworks)
```
Filter: completedFrameworks = 5
```

### Segment 4: Incomplete (Engaged but stuck)
```
Filter: completedFrameworks >= 1 AND completedFrameworks < 5
AND lastActiveAt > now - 7 days
```

### Segment 5: Churn Risk
```
Filter: userGroup = "pro"
AND lastActiveAt < now - 30 days
```

---

## Step 3: Loops Contact Properties (Custom Fields)

Set up these custom properties in Loops (Settings → Custom Fields):

| Field Name | Type | Source |
|---|---|---|
| `userId` | String | DB primary key |
| `userGroup` | String | `"free"` or `"pro"` |
| `completedFrameworks` | Number | 0–5 |
| `primaryArchetype` | String | e.g. "The Hero" |
| `topTrait` | String | e.g. "Openness" |
| `subscriptionStarted` | Date | Stripe created_at |
| `subscriptionStatus` | String | active/canceled/past_due |
| `lastActiveAt` | Date | Last session timestamp |
| `assessmentStarted` | Boolean | Has begun any assessment |
| `portraitGenerated` | Boolean | Has AI portrait |

---

## Step 4: Events to Track (API calls from backend)

These replace/extend the existing Resend 7-day drip. Growth Engineer implements:

| Event Name | Trigger | Properties |
|---|---|---|
| `signup` | User verifies email | userId, email, name |
| `assessment_started` | User begins first assessment | assessmentType |
| `assessment_completed` | User completes an assessment | assessmentType, completedCount |
| `portrait_generated` | AI portrait is created | archetypeName, topTrait |
| `pro_upgrade` | Stripe payment success | planId, amount |
| `pro_canceled` | Stripe subscription canceled | cancelReason (if available) |
| `journal_entry` | User writes reflection | - |
| `coach_session` | User starts AI coaching | - |

---

## Step 5: Automation Sequences to Build in Loops

### Sequence A: Free User Onboarding (replaces Resend drip)

**Trigger:** `signup` event
**Goal:** Drive assessment completion → portrait → Pro upgrade

| Delay | Email | Subject | Content angle |
|-------|-------|---------|---------------|
| Immediate | Welcome | "Welcome — your self-discovery starts here" | CTA: Start first assessment |
| Day 1 | Archetype reveal | "Your Jungian archetype result is in" | Share archetype, tease portrait |
| Day 3 | Insight teaser | "Here's what your Big Five reveals" | Share trait insight, partial portrait |
| Day 5 | Social proof | "Others who share your archetype say…" | Testimonials by archetype type |
| Day 7 | Pro offer | "One week in — unlock your full portrait" | Upgrade CTA at $19/mo |
| Day 14 | Re-engagement | "Your portrait is waiting" | If not upgraded: softer nudge |
| Day 21 | Breakup email | "Last email from us for a while…" | Final upgrade offer with discount |

> **Note:** Email templates already exist in `apps/api/src/emails/` (Day1, Day3, Day5, Day7). Render these via the existing Resend `sendEmail()` utility and mirror the send to Loops events for tracking. Eventually migrate sending to Loops directly.

### Sequence B: Portrait Completion Celebration

**Trigger:** `portrait_generated` event
**Goal:** Deepen engagement, drive Pro upgrade

| Delay | Email | Subject |
|-------|-------|---------|
| Immediate | Portrait ready | "Your full portrait is ready" |
| Day 2 | Deep dive invite | "One question that will change how you see yourself" |
| Day 7 | Pro upgrade offer | "Your portrait is complete — here's what's locked" |

### Sequence C: Pro Onboarding

**Trigger:** `pro_upgrade` event
**Goal:** Activate Pro features, reduce early churn

| Delay | Email | Subject |
|-------|-------|---------|
| Immediate | Welcome Pro | "You're in — here's everything unlocked" |
| Day 3 | Coach intro | "Have you tried your AI coach yet?" |
| Day 7 | Growth tracking | "Track how you've changed over time" |
| Day 30 | Value recap | "30 days of deeper self-knowledge" |

### Sequence D: Churn Prevention

**Trigger:** `pro_canceled` event OR segment "Churn Risk"
**Goal:** Retain or re-activate

| Delay | Email | Subject |
|-------|-------|---------|
| Immediate (on cancel) | Save offer | "Before you go — pause your subscription?" |
| Day 3 | Discount offer | "Come back: 3 months at 50% off" |
| Day 14 | Value reminder | "Your psychological portrait is still waiting" |

### Sequence E: Monthly Newsletter (Broadcast)

**Segment:** All active contacts
**Frequency:** Monthly
**Content:** Psychology insight + user archetype feature + product update + tip of the month

---

## Step 6: Growth Engineer Integration Spec

### API: Sync User to Loops on Signup

```typescript
// apps/api/src/lib/loops.ts

const LOOPS_API_KEY = process.env.LOOPS_API_KEY!
const LOOPS_BASE_URL = 'https://app.loops.so/api/v1'

interface LoopsContact {
  email: string
  firstName?: string
  userId: string
  userGroup: 'free' | 'pro'
  completedFrameworks: number
  subscriptionStatus?: string
}

export async function upsertLoopsContact(contact: LoopsContact) {
  const res = await fetch(`${LOOPS_BASE_URL}/contacts/update`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: contact.email,
      firstName: contact.firstName,
      userId: contact.userId,
      userGroup: contact.userGroup,
      completedFrameworks: contact.completedFrameworks,
      subscriptionStatus: contact.subscriptionStatus ?? 'free',
    }),
  })
  if (!res.ok) {
    console.error('[Loops] upsertContact failed', await res.text())
  }
}

export async function sendLoopsEvent(
  email: string,
  eventName: string,
  properties?: Record<string, string | number | boolean>
) {
  const res = await fetch(`${LOOPS_BASE_URL}/events/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, eventName, ...properties }),
  })
  if (!res.ok) {
    console.error('[Loops] sendEvent failed', eventName, await res.text())
  }
}
```

### Hooks to Add in Existing Routes

```typescript
// In apps/api/src/routes/auth.ts — after email verification success:
await upsertLoopsContact({
  email: user.email,
  firstName: user.name?.split(' ')[0],
  userId: user.id,
  userGroup: 'free',
  completedFrameworks: 0,
})
await sendLoopsEvent(user.email, 'signup', { userId: user.id })

// In apps/api/src/routes/assessments.ts — after assessment completion:
await sendLoopsEvent(user.email, 'assessment_completed', {
  assessmentType: session.framework,
  completedCount: updatedUser.completedFrameworks,
})
await upsertLoopsContact({ ...user, completedFrameworks: updatedUser.completedFrameworks })

// In apps/api/src/routes/billing.ts — after Stripe pro_upgrade webhook:
await sendLoopsEvent(user.email, 'pro_upgrade', { planId: subscription.planId })
await upsertLoopsContact({ ...user, userGroup: 'pro', subscriptionStatus: 'active' })
```

---

## Step 7: Transition from Resend 7-Day Drip

The existing Resend 7-day drip (`Day1ArchetypeEmail`, `Day3InsightTeaserEmail`, etc.) can stay in place short-term. Once Loops is live:

1. Disable the Resend scheduled sends for Day1–Day7
2. The Loops "Free User Onboarding" sequence handles the same cadence
3. Loops adds superior: segmentation, A/B testing, open/click tracking, unsubscribe management

**Migration order:** Set up Loops → test with 5 users → verify emails land → disable Resend drip → monitor open rates in Loops dashboard.

---

## Metrics to Track (Weekly)

| Metric | Target | Where |
|---|---|---|
| Signup → assessment rate | >60% | Loops funnel |
| Day 7 email open rate | >35% | Loops analytics |
| Day 7 → Pro conversion rate | >5% | Loops + Stripe |
| Pro churn rate (monthly) | <8% | Stripe + Loops |
| Newsletter open rate | >40% | Loops analytics |

---

## Environment Variables Needed

```bash
# .env.local (Vercel) and Railway
LOOPS_API_KEY=loops_xxxxxxxxxxxxxxxx
```

---

## Action Items

| Who | Task |
|-----|------|
| **Founder** | Create Loops account at loops.so |
| **Founder** | Add `innermindhealing.com` sending domain + DNS records |
| **Founder** | Create API key → share with Growth Engineer |
| **Founder** | Build the 5 sequences in Loops UI (templates in this doc) |
| **Growth Engineer** | Create `apps/api/src/lib/loops.ts` (spec above) |
| **Growth Engineer** | Add `upsertLoopsContact` + `sendLoopsEvent` calls to auth, assessment, billing routes |
| **Growth Engineer** | Add `LOOPS_API_KEY` to Railway + Vercel env |
| **Growth Engineer** | Test end-to-end: signup → Loops contact created → Day 1 email fires |
| **CMO** | Write monthly newsletter template (first issue: launch announcement) |
