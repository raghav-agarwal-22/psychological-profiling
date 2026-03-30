# Meta Pixel Setup

**Status**: ⏳ Waiting on founder
**Blocking**: Facebook/Instagram ad tracking and retargeting
**Priority**: P2
**Date requested**: 2026-03-21

## What the founder needs to do
1. Go to https://business.facebook.com/
2. Create a **Meta Business Manager** account (or use existing)
3. Go to **Events Manager** → **Connect Data Sources**
4. Select **Web** → **Meta Pixel**
5. Name it `Innermind Pixel`
6. Copy the **Pixel ID** (numeric string)

## Where to put the result
- Open `apps/web/.env.local` (create if needed) and add:
  ```
  NEXT_PUBLIC_META_PIXEL_ID=your-pixel-id-here
  ```

## Why this matters
Without the Meta Pixel, Facebook and Instagram ads can't track conversions or build retargeting audiences. If you plan to run social ads, this is required for any ROI measurement.
