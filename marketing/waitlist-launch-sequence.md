# Innermind Waitlist Launch Sequence

Three-email sequence for waitlist subscribers. Set up as an automated flow in Loops triggered on the "Waitlist Confirmed" event.

---

## Sequence Overview

| Email | Template | Send Timing | Trigger Condition |
|-------|----------|-------------|-------------------|
| Email 1 | WaitlistLaunchEmail | Immediately on waitlist confirmation | All subscribers |
| Email 2 | WaitlistFeatureHighlightEmail | 24h after Email 1 | Non-openers OR non-clickers of Email 1 |
| Email 3 | WaitlistSocialProofEmail | 72h after Email 1 | All non-converters (have not clicked through to start assessment) |

---

## Email 1 — Launch Announcement

**Template file:** `WaitlistLaunchEmail.tsx`

**Subject line:** Your Innermind profile is ready

**Preview text:** Your AI personality profile is ready — complete your assessment now

**Send timing:** Immediately on waitlist confirmation event

**Body copy:**

> You joined the waitlist for your AI-powered psychological profile. It's here.
>
> Our AI synthesis engine is now live — it weaves together your assessment results into a deep, personalized narrative: your archetypes, patterns, blind spots, and growth edges.
>
> Complete your assessment and see who you are at a deeper level.

**CTA:** Complete my assessment → `{{ startUrl }}`

**Footer:** You're receiving this because you joined the Innermind AI profile waitlist.

---

## Email 2 — Feature Highlight

**Template file:** `WaitlistFeatureHighlightEmail.tsx`

**Subject line:** What your psychological profile actually reveals

**Preview text:** What your psychological profile actually reveals

**Send timing:** 24 hours after Email 1

**Trigger condition:** Subscriber has NOT clicked the CTA in Email 1 (or has not opened Email 1)

**Body copy:**

> **Five frameworks. One coherent portrait.**
>
> Most personality tools give you one lens. A type. A score. A category. Innermind synthesizes five distinct frameworks — each measuring something the others can't.
>
> **Big Five** — The "what" of your personality — your observable traits and behavioral tendencies.
>
> **Enneagram** — Your core motivations and fears — the deeper "why" beneath the behavior.
>
> **Attachment Style** — How you pattern your relationships — security, anxiety, and connection.
>
> **Jungian Archetypes** — The roles you unconsciously inhabit — the stories your psyche tells about itself.
>
> **Schwartz Values** — What you're actually optimizing for in life — not what you say you value, but what your choices reveal.
>
> The AI doesn't just report scores. It weaves them into a single narrative — your psychology as a coherent story, not a list of test results.
>
> ---
>
> **Growth tracking**
>
> Retake any assessment after 3 months. See what changed. Track your development over time with actual measurements, not guesses.
>
> ---
>
> **AI deep-dive**
>
> After your profile, Claude generates personalized follow-up questions based on your specific results — and has a real conversation with you about what they mean.

**CTA:** See what your profile reveals → `{{ startUrl }}`

**PS line:** The synthesis takes about 15 minutes from first assessment to full portrait.

**Footer:** You're receiving this because you joined the Innermind waitlist.

---

## Email 3 — Social Proof + Urgency

**Template file:** `WaitlistSocialProofEmail.tsx`

**Subject line:** Others are discovering surprising things about themselves

**Preview text:** Others are discovering surprising things about themselves

**Send timing:** 72 hours after Email 1

**Trigger condition:** Subscriber has NOT completed an assessment (has not converted)

**Body copy:**

> **What people are finding out about themselves**
>
> We've been reading the responses from early users. A few that stayed with us:
>
> > "I've taken the MBTI probably 20 times. Innermind gave me something I'd never seen before — the connection between my Enneagram 4 and my attachment anxieties finally made sense."
>
> > "The AI portrait was uncomfortably accurate. It named patterns I knew existed but had never articulated."
>
> > "I expected another personality test. I got something closer to a therapy session."
>
> These aren't edge cases. The synthesis is accurate because it doesn't reduce you to a single type — it looks at five dimensions simultaneously.
>
> ---
>
> We're offering founding member pricing to our first 500 users — **{{ foundingPriceDeadline }}**. After that, it's standard pricing.

**CTA:** Get founding member access → `{{ startUrl }}`

**Footer:** You're receiving this because you joined the Innermind waitlist.

---

## Loops Setup Notes

### Contact properties required

- `startUrl` — personalized assessment entry URL (should be set on waitlist signup, e.g. `https://innermind.app/start`)
- `foundingPriceDeadline` — optional string, e.g. `"April 5th"`. Falls back to `"the window closes soon"` if blank.

### Flow logic in Loops

```
Trigger: Event "waitlist_confirmed"
  |
  +-- Send Email 1 immediately
  |
  Wait 24h
  |
  Branch: Has clicked Email 1 CTA?
    YES --> Skip Email 2
    NO  --> Send Email 2
  |
  Wait 48h (72h total from Email 1)
  |
  Branch: Has completed assessment? (check contact property "assessment_completed = true")
    YES --> Exit flow
    NO  --> Send Email 3
```

### Unsubscribe

All three emails should use the same unsubscribe group (e.g. "Waitlist & Launch announcements") so a single unsub removes the contact from the entire sequence.

### A/B test candidates

- Email 1 subject: "Your Innermind profile is ready" vs. "The waitlist is open — your profile is ready"
- Email 2 subject: "What your psychological profile actually reveals" vs. "Five frameworks, one portrait"
- Email 3 subject: "Others are discovering surprising things about themselves" vs. "500 founding spots. Here's what early users are saying."
