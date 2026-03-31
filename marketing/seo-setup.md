# Innermind SEO Setup & Monitoring

## Current SEO State

| Asset | Status |
|-------|--------|
| Sitemap | ✅ `/sitemap.xml` — dynamic, includes all 50 blog posts + 12 archetype pages |
| Robots.txt | ✅ `/robots.txt` — public pages allowed, dashboard/auth disallowed |
| Blog content | ✅ 50 SEO posts (personality, enneagram, attachment, archetypes) |
| Structured data | ✅ WebApplication schema on root layout |
| Meta tags | ✅ Next.js Metadata API on all key pages |
| Google Search Console | ❌ **Not yet verified** |
| Analytics indexing view | ❌ Pending GSC setup |

---

## Step 1 — Verify Site in Google Search Console

**URL:** [search.google.com/search-console](https://search.google.com/search-console)

### Verification method (recommended: DNS TXT record)

1. Click "Add property" → Domain → enter `innermindhealing.com`
2. Google gives you a TXT record like:
   ```
   google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Add this to DNS (wherever your domain is registered — likely Vercel DNS or a registrar):
   - Type: `TXT`
   - Name: `@` (root)
   - Value: paste the verification string
4. Click "Verify" in GSC — may take a few minutes for DNS to propagate

### Alternative: HTML file verification
1. Download the provided `googleXXXXXX.html` file
2. Place in `apps/web/public/googleXXXXXX.html`
3. Verify at `https://innermindhealing.com/googleXXXXXX.html`

---

## Step 2 — Submit Sitemap

After site is verified:
1. In GSC left nav → Sitemaps
2. Enter: `https://innermindhealing.com/sitemap.xml`
3. Click Submit
4. Wait 24–48 hours for Google to crawl and index

**Current sitemap includes:**
- Homepage, About, Assessment, Archetypes (12 pages), For Professionals, For Coaches, Blog index
- 50 blog posts
- Upgrade, Privacy, Terms

---

## Step 3 — Keyword Monitoring

### Primary keywords to track in GSC (Performance → Queries)

| Intent | Keyword | Monthly Searches (est) | Competition |
|--------|---------|----------------------|-------------|
| Navigational | `innermind personality` | Low | Low |
| Transactional | `free personality test` | 110k | High |
| Transactional | `mbti test free` | 90k | High |
| Transactional | `personality assessment` | 40k | Medium |
| Informational | `big five personality test` | 27k | Medium |
| Informational | `what is attachment style` | 18k | Low |
| Informational | `enneagram test free` | 33k | Medium |
| Informational | `jungian archetypes test` | 8k | Low |
| Informational | `schwartz values` | 5k | Low |
| Transactional | `free psychology test` | 22k | Medium |
| Informational | `anxious attachment style` | 15k | Low |
| Informational | `avoidant attachment style` | 12k | Low |
| Transactional | `attachment style quiz` | 9k | Low |
| Informational | `enneagram type 4` | 18k | Low |
| Informational | `personality change` | 12k | Low |

### Quick wins (long-tail, low competition)
- `jungian shadow work test` — ~2k/mo, low competition (we have `/blog/jungian-shadow-work`)
- `schwartz values inventory` — ~1k/mo, very low competition (we have `/blog/schwartz-values-inventory`)
- `disorganized attachment style` — ~5k/mo, low competition (we have `/blog/disorganized-attachment-style`)
- `enneagram wings explained` — ~3k/mo, low competition (we have `/blog/enneagram-wings-explained`)
- `ambivert personality` — ~7k/mo, medium competition (we have `/blog/ambivert-personality`)

---

## Step 4 — GSC Weekly Monitoring Checklist

Check weekly (Fridays):
1. **Performance** → Clicks, Impressions, CTR, Position
   - Any keywords entering top 10? Good sign.
   - Any keywords with high impressions but low CTR? Fix title/meta description.
2. **Coverage** → Indexed pages count
   - Goal: 100% of `/blog/` posts indexed within 2 weeks of publish
3. **Core Web Vitals** → Monitor LCP, FID, CLS
   - Target: Green for all metrics (currently unknown without real user data)
4. **Links** → Track backlinks as content gets shared

---

## Step 5 — SEO Improvements (Actionable)

### Priority 1: Fix missing compare page in sitemap

The `/compare` page exists but is not in the sitemap. Add it.

**File:** `apps/web/src/app/sitemap.ts`
```ts
{ url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
```

### Priority 2: Add FAQ structured data to key blog posts

High-value blog posts like `big-five-vs-mbti` and `what-is-big-five-personality-test` should have FAQ schema to capture rich results.

### Priority 3: Internal linking

Add "Related articles" section to each blog post linking to 2–3 related posts. This improves crawlability and session depth.

### Priority 4: Improve page titles for CTR

Current title format: `"Article Title | Innermind"`
Better format: Include search intent keyword + benefit:
- Before: `"Big Five vs MBTI | Innermind"`
- After: `"Big Five vs MBTI: Which Personality Test Is More Accurate? | Innermind"`

### Priority 5: Image alt text and OG images

Blog posts are missing OG social images (og:image). Adding these improves CTR when shared on social and may affect GSC social appearance.

---

## Tracking Dashboard

Monitor these metrics weekly once GSC is set up:

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-----------------|-----------------|
| Indexed pages | >60 | >70 |
| Organic clicks/week | >50 | >300 |
| Keywords ranking (any position) | >100 | >500 |
| Keywords in top 10 | 0 | >10 |
| Keywords in top 3 | 0 | >2 |
| Avg. position | <50 | <30 |

---

## Competitor SEO Benchmarks

From competitive analysis (`marketing/competitive-analysis.md`):
- 16Personalities: ~40M organic monthly visits, DR 87
- Truity: ~1.5M organic monthly visits, DR 72
- TraitLab: ~50k organic monthly visits, DR 45
- **Innermind target (Year 1):** 50k–200k organic monthly visits

Initial foothold: Own long-tail keywords for multi-framework content (e.g., "enneagram AND attachment style", "jungian archetypes AND big five"), which competitors don't specifically target.
