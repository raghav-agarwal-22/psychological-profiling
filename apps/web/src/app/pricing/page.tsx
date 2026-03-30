import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Pricing — Innermind',
  description: 'Free and Pro ($19/mo or $12/mo annual) plans. Six psychology assessments, AI-synthesised portrait, coaching, and growth tracking.',
}

export default function PricingPage() {
  redirect('/upgrade')
}
