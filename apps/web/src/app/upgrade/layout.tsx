import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upgrade to Pro',
  description:
    'Unlock all 6 psychological assessment frameworks, unlimited AI coaching, compatibility mapping, and daily reflection prompts. Start your full psychological journey for $9/month.',
  openGraph: {
    title: 'Upgrade to Pro | Innermind',
    description:
      'All 6 assessments, AI coach, growth recommendations, and personalised prompts — $9/month. Cancel anytime.',
  },
}

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
