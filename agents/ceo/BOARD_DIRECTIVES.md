# Board Directives — 2026-03-20

## Founder Memo to the C-Team

I did a full product audit today. I need every one of you to read this carefully.

We have been building for weeks. The codebase is ~90% there. And yet: a user cannot sign in. A user cannot pay. A user cannot get their AI profile generated. The CMO has no tools to run a single ad or send a single campaign email. The CFO has never validated whether our pricing even makes sense against competitors. Nobody has researched what 16Personalities, Truity, or Crystal charge — or whether they're even the right comp set.

This is not acceptable. We are not a research lab writing strategy memos. We are a company trying to hit $100k ARR in 60 days and the clock is running.

**CEO:** Your job is to turn every directive below into a Paperclip issue, assign it, and hold people accountable. No more "waiting for API keys" as a blanket excuse. Break the blockers down and get them unblocked one by one.

**CMO:** You have written impressive strategy documents. Twitter plans, Reddit posts, PR pitches, email sequences — all sitting in markdown files. None of it is live. You have no ad accounts, no email marketing platform, no social scheduling tools, no Google Search Console, and — critically — no competitive analysis. You don't know what our competitors charge, how they position, or where they acquire users. Fix that first. Everything else you do is guesswork until you understand the landscape. Directive #15 is your top priority.

**CFO:** You set a $100k ARR target with monthly milestones. Great. But the pricing on our own pages contradicts itself ($12/mo vs $9/mo vs $19/mo), there are no real Stripe products, and you haven't researched what the market will actually bear. You can't set a price without knowing what alternatives cost. Wait for CMO's competitive analysis (directive #15), then deliver a real pricing recommendation. No more placeholder numbers.

**CPO:** Users who manage to get into the product have no onboarding, no account page, and an assessment UX that takes too many clicks. The sign-up wall hits before the user has seen any value. These are basic product problems and they will kill retention before we even get to talk about features. Own directives #5-9.

**Engineer:** You've built a lot. Respect. But the last mile is what matters. API keys, magic link flow, pricing consistency, Stripe integration — these are the things that turn code into a product people can actually use and pay for. Directives #1-4 and #8 are yours. Ship them.

I need urgency from everyone. Not more plans. Execution. When the CEO creates your issues, pick them up immediately. Report blockers same-day — don't sit on them. If something is outside your capability, say so and we'll figure it out.

The product is 90% built. That last 10% is the difference between a side project and a business. Let's close it.

— Founder

---

Action every directive below by creating Paperclip issues and assigning to the specified agent(s). Include the founder memo context when creating issues so agents understand the urgency.

---

## Critical — Product is non-functional without these

### 1. Configure production API keys
**Assign to:** Engineer
- Set up real Resend API key (email sending is broken without it)
- Set up Anthropic API key (AI synthesis is blocked without it)
- Set up Stripe API keys and create Stripe products/prices matching decided pricing tiers
- All keys must be configured in the production environment

### 2. Fix sign-in flow — magic link not working in production
**Assign to:** Engineer
- Magic link emails are not being sent/received in production
- Likely blocked by missing Resend API key (see directive #1) but verify end-to-end after key is configured
- Test full flow: enter email → receive magic link → click → authenticated

### 3. Remove Teams $49/mo tier from all pages
**Assign to:** Engineer
- Remove Teams tier from landing page (`apps/web/src/app/page.tsx` ~line 394-399)
- Remove Teams tier from `/for-professionals` page
- Per SOUL.md: no teams/enterprise/B2B. This is an individual self-discovery product.

### 4. Fix pricing inconsistency across pages
**Assign to:** CFO (decide price), Engineer (implement)
- Landing page shows $12/mo
- Upgrade page shows $9/mo and $19/mo
- These must be consistent. CFO to decide the correct pricing, Engineer to update all references.
- Check all locations: landing page, upgrade page, pricing components, Stripe products

---

## Product Gaps — Users can't orient themselves

### 5. Build account/settings page (`/account`)
**Assign to:** CPO (spec), Engineer (build)
- Users have no way to see who they are, their email, subscription status, or preferences
- Minimum: display email, current plan, subscription management link, logout
- Nice-to-have: notification preferences, data export

### 6. Build onboarding flow for first-time users
**Assign to:** CPO
- Currently cold-start: new users land on dashboard with no guidance
- Need a guided flow that walks them through their first assessment
- Should explain what the product does and set expectations before the first question

### 7. Fix Jungian assessment UX — too many clicks per question
**Assign to:** CPO
- Current UX requires too many clicks per question (select + confirm pattern)
- Explore auto-advance on selection (click/tap an option → immediately move to next question)
- This is the core product interaction — it needs to feel fast and effortless

### 8. Verify synthesis "Generate" works after API key setup
**Assign to:** Engineer
- The "Generate Synthesis" button is currently broken
- Likely blocked by missing Anthropic API key (directive #1)
- After key is configured, verify the full flow: complete assessment → generate synthesis → view profile
- If still broken after key setup, debug and fix

### 9. Fix sign-up placement strategy — move after assessment
**Assign to:** CMO + CPO (recommend), Engineer (implement)
- Currently sign-up is prompted upfront before users see any value
- Should come AFTER the first assessment when the user is invested and wants their results
- Research best practice for freemium conversion flows
- Recommend the optimal point in the user journey to gate sign-up

---

## Marketing Infrastructure — CMO can't do their job without these

### 10. Set up paid ads infrastructure
**Assign to:** CMO
- Create Google Ads account
- Create Meta Ads account
- Install conversion pixels on signup and purchase pages
- Set up conversion tracking for key events (signup, assessment_complete, purchase)

### 11. Set up email marketing platform
**Assign to:** CMO
- Resend is transactional only — not suitable for campaigns, newsletters, or list segmentation
- Evaluate and set up ConvertKit, Loops, or similar platform for:
  - Drip campaigns
  - Newsletter broadcasts
  - List segmentation (free vs paid, archetype-based)
  - Automation triggers

### 12. Set up social media tools
**Assign to:** CMO
- Current strategy docs are just markdown files with no tooling
- Set up scheduling and posting automation (Buffer, Typefully, or similar)
- Connect Twitter/X, Reddit, and any other target channels
- Enable analytics tracking for social posts

### 13. Set up Google Search Console + SEO monitoring
**Assign to:** CMO
- Verify site ownership in Google Search Console
- Submit sitemap (already exists at `/sitemap.xml`)
- Set up SEO monitoring and keyword tracking
- Monitor indexing status and fix any crawl errors

### 14. Create ad-specific landing pages with UTM tracking
**Assign to:** CMO + Engineer
- Current landing page is generic — need targeted pages for different ad campaigns
- Each landing page needs UTM parameter tracking
- Set up A/B testing framework for landing page variants
- Track conversion rates per landing page/campaign

---

## Competitive Intelligence — Flying blind without this

### 15. Full competitive landscape analysis
**Assign to:** CMO
- Research all direct competitors: 16Personalities, Truity, Crystal, TraitLab, Personality Perfect, HIGH5 Test, and any others
- For each competitor document: positioning, target audience, features (free vs paid), pricing model, acquisition channels, messaging/copy tone
- Identify what they do well and where they fall short — where is the gap Innermind fills?
- Analyze their SEO strategy: what keywords do they rank for? What content do they publish?
- Analyze their social presence: which platforms, posting frequency, engagement levels
- Deliver a structured competitive landscape report (save to `marketing/competitive-analysis.md`)
- **This blocks directive #16** — CFO needs this to make informed pricing decisions

### 16. Research and validate pricing based on competitive landscape
**Assign to:** CFO (depends on CMO's directive #15)
- Use CMO's competitive analysis to understand the pricing landscape
- Map competitor pricing: who charges what, for what features, monthly vs annual vs one-time
- Assess price sensitivity for individual self-discovery products specifically
- Determine the right pricing model: flat monthly, tiered, usage-based, one-time purchase?
- Consider: 16Personalities is free with paid "premium profiles" — can we compete on price or do we differentiate on depth?
- Deliver a pricing recommendation with rationale and competitive positioning

### 17. Create real Stripe products and prices
**Assign to:** CFO + Engineer
- After pricing is decided (directive #16), create matching Stripe products and prices
- Ensure webhook handling works end-to-end
- Test full purchase flow: select plan → Stripe checkout → subscription active → features unlocked

### 18. Set up revenue tracking with real data
**Assign to:** CFO
- Currently no real revenue data flowing
- Set up Stripe dashboard monitoring
- Set up MRR/ARR tracking
- Define and track key financial metrics: MRR, churn, LTV, CAC

---

## Strategic Constraint — Reiterate

### 19. Remove all teams/enterprise/B2B references
**Assign to:** CPO + Engineer
- Per SOUL.md: Innermind is an individual self-discovery product. No teams, no enterprise, no B2B.
- Audit all pages for teams/enterprise references and remove or hide them
- This includes: Teams pricing tier (directive #3), any "Teams" nav links, `/teams` page, B2B marketing copy
- CFO AGENTS.md already states this — ensure consistency across the entire product

---

## Notes for CEO

- Directives #1-4 are **launch blockers** — nothing else matters if users can't sign in, pay, or get their profile generated.
- Directives #5-9 are **retention blockers** — users who do get in will churn without these.
- Directives #10-14 are **growth blockers** — CMO is writing strategy docs with no tools to execute.
- Directive #15 is an **intelligence blocker** — CMO must deliver competitive landscape FIRST so CFO can make informed pricing decisions.
- Directives #16-18 are **revenue blockers** — we can't make money without validated pricing and working payments.
- Directive #19 is a **strategic guardrail** — keep enforcing it.

Create Paperclip issues for each directive, assign to the specified agent(s), and track completion. Delete this file after all directives are actioned.
