# Google Tag Manager + Google Ads Setup

**Status**: ⏳ Waiting on founder
**Blocking**: Paid search acquisition, ad conversion tracking
**Priority**: P1
**Date requested**: 2026-03-21

## What the founder needs to do

### Step 1: Google Tag Manager
1. Go to https://tagmanager.google.com/
2. Create an account → name it `Innermind`
3. Create a **Web** container → name it `innermindhealing.com`
4. Copy the **Container ID** (format: `GTM-XXXXXXX`)

### Step 2: Google Ads
1. Go to https://ads.google.com/
2. Create an account (or use existing Google account)
3. Complete the billing setup
4. Go to **Tools & Settings** → **Conversions**
5. Create two conversion actions:
   - `Signup` — when a user creates an account
   - `Purchase` — when a user upgrades to Pro
6. For each conversion, copy the **Conversion ID** and **Conversion Label**
7. The Conversion ID looks like `AW-XXXXXXXXXX`

### Step 3: Link them
1. In GTM, add a Google Ads tag using the Conversion ID
2. Publish the GTM container

## Where to put the result
- Open `apps/web/.env.local` (create if needed) and add:
  ```
  NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
  NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
  NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL=your-signup-label
  NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=your-purchase-label
  ```

## Why this matters
Without GTM and Google Ads conversion tracking, any money spent on Google Ads is flying blind — no way to know which keywords or campaigns drive signups and purchases.
