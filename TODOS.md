# TODOS

## Email capture error handling
QuizEmailCapture shows "success" even when the API call fails (catch block sets submitted=true). Add a retry message on error instead.
**Why**: On the revenue funnel path, silent failures lose leads.
**Files**: `apps/web/src/components/QuizEmailCapture.tsx`

## Quiz page DRY refactor
All 8+ quiz pages duplicate state management, scoring, three-screen flow logic (~200 lines each). Extract a shared `useQuiz` hook that handles the common pattern.
**Why**: 8 files to maintain; any pattern change requires touching all of them.
**Files**: `apps/web/src/app/quiz/*/page.tsx`

## Bridge escape drip email integration
The `BridgeEscapeFollowupEmail` template exists but isn't hooked into the drip system yet. Requires tracking anonymous quiz takers (email + score + bridge_escaped timestamp) and a cron job to send 24h later.
**Why**: Re-engages users who saw the bridge but chose basic results.
**Files**: `apps/api/src/emails/BridgeEscapeFollowupEmail.tsx`, `apps/api/src/lib/drip-sequence.ts`
