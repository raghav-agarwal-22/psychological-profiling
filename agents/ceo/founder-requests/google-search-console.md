# Google Search Console Verification

**Status**: ⏳ Waiting on founder
**Blocking**: INN-174 — SEO monitoring for 100+ blog posts being published
**Priority**: P1
**Date requested**: 2026-03-22

## What the founder needs to do

### Step 1: Go to Google Search Console
https://search.google.com/search-console/

### Step 2: Add your property
1. Click "Add property"
2. Choose **URL prefix** method
3. Enter: `https://innermind.app` (or your actual production domain)

### Step 3: Verify ownership (easiest method — HTML tag)
1. Choose "HTML tag" verification method
2. Google will give you a meta tag like:
   ```html
   <meta name="google-site-verification" content="XXXXX..." />
   ```
3. Copy the **content value** (just the `XXXXX...` part)
4. Add this to `apps/web/.env` as:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-content-value-here
   ```
5. Paste the content value as a comment on [INN-174](/INN/issues/INN-174) — the Founding Engineer will add it to the `<Head>` component

### Step 4: After verification
- Submit your sitemap: `https://innermind.app/sitemap.xml`
- Come back in 24–48 hours to see index coverage and search queries

## Why this matters
We have 100 blog posts publishing now (INN-195). Without Search Console, we're flying blind on:
- Which posts Google is indexing
- What queries are driving traffic
- Any crawl errors blocking our SEO
This takes 10 minutes and has direct revenue impact through organic traffic.
