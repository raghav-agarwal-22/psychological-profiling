# Innermind Affiliate Program — Marketing Playbook

## Program Overview

**Commission:** 20% recurring on every Pro subscription payment
**Plans:** $12/mo or $99/yr
**Earnings:** $2.40/mo or $19.80/yr per active referred subscriber
**Cookie window:** 90 days
**Payment:** Monthly, via Stripe, minimum $25 payout
**Target affiliates:** Coaches, therapists, psychology educators, content creators in self-development

---

## Affiliate Program Terms (Summary)

Full legal terms to be drafted with counsel. Key provisions:

1. **Eligibility**: Open to individuals 18+ with an established audience relevant to psychology, self-development, coaching, or personal growth.
2. **Commission rate**: 20% of net subscription revenue (after Stripe fees) for each referred subscriber, recurring as long as the subscriber remains active.
3. **Attribution**: Cookie-based (90-day window) plus account-level tracking. First-touch attribution. If a user was already a registered Innermind user before clicking your link, the referral is not credited.
4. **Prohibited activities**: Paid ads bidding on "Innermind" brand keywords; spam; misleading claims about Innermind's capabilities; self-referrals.
5. **Payment**: Commissions calculated on the 1st of each month for the prior month's confirmed payments. Paid within 5 business days via Stripe. Minimum threshold: $25.
6. **Termination**: Either party may terminate with 30 days written notice. Commissions for active subscribers at termination continue for 90 days.
7. **Chargebacks**: Reversed payments result in reversed commissions.

---

## Outreach Email — Existing Coach/Therapist Contacts

*Use for contacts from the INN-94 B2B outreach campaign (coaches and therapists who were sent the for-professionals pitch)*

**Subject:** A way to earn from every client you send to Innermind

Hi [Name],

I wanted to reach out with something that might be genuinely useful for you — especially if you've been sharing Innermind with clients or followers.

We just launched an affiliate program for coaches, therapists, and educators in the psychology space.

Here's how it works:
- You get a unique referral link
- Every person who subscribes to Innermind Pro through your link earns you **20% recurring commission** — every month, for as long as they're subscribed
- Pro is $12/month, so that's $2.40/mo per subscriber — with no cap and no expiry

If you have a newsletter, a course, or even just regularly recommend tools to clients in your intake process, this could add up quickly without any extra work.

**Apply here:** https://innermind.app/affiliates

It takes about 2 minutes. We review applications within 24 hours and send your link immediately after approval.

Happy to answer any questions — just reply here.

Best,
[Name]
Innermind

---

## Cold Outreach Email — New Contacts (Psychology Creators)

**Subject:** Earn 20% recurring commission recommending a psychology tool

Hi [Name],

I came across your [content/newsletter/podcast] on [Big Five / Enneagram / attachment theory] and thought this might be a fit.

I'm building Innermind — a psychological profiling platform that synthesizes Big Five, Schwartz Values, Attachment Style, Enneagram, and Jungian Archetypes into a single AI portrait. It's used by coaches, therapists, and people serious about self-knowledge.

We just launched an affiliate program, and your audience seems like a natural fit:

- **20% recurring commission** on every Pro subscription you refer
- 90-day cookie window — no pressure to convert fast
- Marketing assets included (graphics, copy, demo walkthrough)
- Real-time dashboard to track clicks, signups, and earnings

If this sounds interesting, you can apply at **innermind.app/affiliates** — takes 2 minutes, reviewed within 24 hours.

Would also be happy to do a quick walkthrough of the product with you first if you'd prefer to try it before promoting it.

Best,
[Your name]

---

## Social Copy — Affiliate Program Announcement

### Twitter/X (280 chars)

We just launched an affiliate program for coaches, therapists, and psychology creators.

20% recurring commission. 90-day cookie. No cap.

If your audience cares about self-knowledge and inner work → innermind.app/affiliates

### LinkedIn Post

**We're opening the Innermind affiliate program to coaches, therapists, and psychology educators.**

If you already recommend self-discovery tools to your clients or audience — this might be worth 2 minutes of your time.

Here's what we built:
→ 20% recurring commission on every Pro subscription you refer
→ Real-time dashboard to track clicks, conversions, and earnings
→ 90-day cookie window — attribution isn't a race
→ Marketing assets, demo walkthrough, and co-created landing pages for high-volume affiliates

Innermind synthesizes five validated frameworks (Big Five, Schwartz Values, Attachment Style, Enneagram, Jungian Archetypes) into a single psychological portrait — with growth tracking and AI coaching built in.

If your audience is in the psychology, coaching, or inner work space, they're already a natural fit.

Apply at innermind.app/affiliates — reviewed within 24 hours.

---

## Newsletter Inclusion Template (For Affiliates to Use)

*Send this to approved affiliates as a ready-to-use blurb for their newsletter:*

---

**This week's recommendation:** [Innermind](https://innermind.app/?ref=YOURCODE)

I've been recommending Innermind to [clients / my audience / my students] and wanted to share it here too.

It's a psychological profiling platform that takes you through five validated frameworks — Big Five, Schwartz Values, Attachment Style, Enneagram, and Jungian Archetypes — and synthesizes everything into a single portrait. The AI coach at the end is genuinely useful for unpacking what your results mean.

There's a free tier. No credit card required. Worth an afternoon.

→ [Try Innermind](https://innermind.app/?ref=YOURCODE)

---

## Engineering Requirements (for INN-106 subtask)

The following must be built for the affiliate program to function:

### Referral link infrastructure
- **Unique referral codes**: Generate a short alphanumeric code per affiliate (e.g., `?ref=ABC123`)
- **UTM fallback**: Support `?utm_source=affiliate&utm_medium=referral&utm_campaign=<code>` for affiliates who want to use UTM params
- **Cookie persistence**: Set a 90-day cookie on first referral link visit, storing affiliate code
- **Attribution at signup**: Read the affiliate cookie during account creation and log the referral relationship

### Affiliate signup flow
- **Application form** at `/affiliates/apply`: name, email, website/profile URL, audience description, monthly audience size
- **Application review queue** in admin dashboard
- **Approval email** with unique referral link and dashboard link

### Affiliate dashboard (`/affiliates/dashboard`)
- Total clicks, signups, conversions, active subscribers
- Pending and paid commission amounts
- Payment history
- Referral link copy widget

### Commission tracking
- Log commissions on Stripe `invoice.payment_succeeded` webhook when `metadata.affiliateCode` is present
- Monthly commission calculation job (1st of month)
- Stripe payout integration or manual payout queue for review

### Admin view
- Applications queue (approve/deny)
- Affiliate roster with total earnings
- Commission payout management
