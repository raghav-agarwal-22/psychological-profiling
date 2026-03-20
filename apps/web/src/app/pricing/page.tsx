import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Pricing — Innermind',
  description: 'Free, Essential ($9/mo), and Pro ($19/mo) plans. Unlock your full psychological profile.',
}

export default function PricingPage() {
  redirect('/upgrade')
}
