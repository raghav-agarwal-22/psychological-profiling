# Journal Prompt Retention Campaign — 4-Week Pro Series

**Goal:** Reduce Pro churn by keeping users actively engaged with their psychological portrait through weekly journal prompts.

**Target:** All Pro subscribers, triggered 7 days after profile completion.

**Delivery:** Loops email sequence (or Resend if Loops not configured). Email templates: `JournalPromptWeek1Email.tsx` through `JournalPromptWeek4Email.tsx`.

---

## Sequence Overview

| Week | Theme | Email File | Trigger |
|------|-------|-----------|---------|
| 1 | Your Blind Spots | `JournalPromptWeek1Email.tsx` | Day 7 post-profile |
| 2 | Shadow Work | `JournalPromptWeek2Email.tsx` | Day 14 post-profile |
| 3 | Growth Edges | `JournalPromptWeek3Email.tsx` | Day 21 post-profile |
| 4 | Relationship Patterns | `JournalPromptWeek4Email.tsx` | Day 28 post-profile |

---

## Week 1: Your Blind Spots

**Subject lines (A/B test):**
- A: `The one thing your personality profile reveals about your blind spots`
- B: `What you can't see about yourself (your profile can)`

**Props to pass:**
- `blindSpotInsight`: Generate from Big Five. High Agreeableness → "You may minimize your own needs in conflict to keep others comfortable." High Openness + Low Conscientiousness → "Your ideation outpaces your execution, and you may not realize how this affects others' trust."
- `journalPrompt`: "Think of a recent situation where you felt misunderstood or where something went differently than you expected. Looking at your psychological profile now — what might you have been unable to see in that moment? Write without judgment for 10 minutes."

**Goal:** Get user back into their profile + open the journaling habit.

---

## Week 2: Shadow Work

**Subject lines:**
- A: `The part of yourself you've been avoiding (it's in your profile)`
- B: `Your shadow isn't your enemy. It's information.`

**Props to pass:**
- `shadowAspect`: Generate from low-scoring Big Five traits or Jungian archetype shadow. E.g., Low Agreeableness shadow → "the capacity for ruthlessness you keep beneath the surface." High Conscientiousness shadow → "the rebellion and chaos you've suppressed."
- `journalPrompt`: "What quality do you most dislike in other people? Describe a specific person or moment. Now: where does this quality exist, in some form, in you? Write about what it would look like to own this part of yourself rather than project it outward."

**Goal:** Deepen engagement with the Jungian archetype and shadow work features.

---

## Week 3: Growth Edges

**Subject lines:**
- A: `Your profile knows where you're about to grow`
- B: `The one area where small effort will have the biggest payoff`

**Props to pass:**
- `growthEdge`: Generate from Enneagram type or lowest Big Five scores. E.g., Type 5 → "Engaging before you feel fully prepared." High Openness + Low Conscientiousness → "Finishing what you start, especially when the excitement has faded."
- `journalPrompt`: "Identify one area of your life where you've been stuck in 'almost ready' or 'I'll do it when...' mode. What specifically would change in the next 30 days if you treated this as your single growth priority? Write a specific, concrete plan."

**Goal:** Drive engagement with the AI coach feature for growth planning.

---

## Week 4: Relationship Patterns

**Subject lines:**
- A: `How your attachment style is shaping every relationship you have`
- B: `The relationship pattern that follows you everywhere (and what to do about it)`

**Props to pass:**
- `attachmentPattern`: From attachment style results. Anxious → "You may pull people toward you when you feel insecure, which sometimes pushes them away." Avoidant → "You may create distance before others can, which protects you but also limits depth." Secure → "You bring stability to relationships, but may struggle to recognize when you're in a dynamic that isn't working."
- `journalPrompt`: "Think of the most important relationship in your life right now — romantic, family, or friendship. Where is this relationship not working the way you want it to? Based on your attachment style and values profile, what role are you playing in this dynamic? Write specifically, not abstractly."

**Goal:** Drive reflection on relationship insights → sharing feature → referral.

---

## Technical Implementation

### Loops Setup
If `LOOPS_API_KEY` is configured:
1. Create a "Pro Journal Series" mailing list in Loops
2. Trigger with tag: `pro_journal_week_1` on Day 7 post-profile completion
3. Loops automation advances to next week on completion

### Fallback (Resend)
If Loops not configured:
- Use existing Resend setup in `apps/api/src/lib/email.ts`
- Create scheduled job that runs nightly and sends based on `profile_completed_at` timestamp
- Track in `user_email_sent` table (or add field to users table)

### Personalization Logic
Each email should pull from the user's profile:
- `blindSpotInsight` / `shadowAspect` / `growthEdge` / `attachmentPattern`: derive from Big Five scores + attachment_style field
- `journalPrompt`: use a static prompt per week (variation can come from their type, but core prompt stays consistent)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Open rate | >45% (retention emails to engaged users) |
| Click-through rate | >12% |
| Pro retention at Day 30 vs control | +15% |
| Journal entries created during series | >30% of recipients |

---

## Content Calendar

Weeks 1-4 complete. After Week 4:
- Rest 2 weeks
- Restart with new themes: Enneagram growth paths, values conflicts, archetype integration, career alignment
- Long-term: monthly digest format replacing weekly prompts

---

*Created: 2026-03-22 | Owner: CMO | INN-222*
