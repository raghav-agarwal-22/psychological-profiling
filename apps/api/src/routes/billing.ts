import type { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { sendTrialEndingSoonEmail } from '../services/email.js'
import { logAffiliateCommission } from './affiliates.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
})

// Helper: Stripe v20 removed current_period_end from the Subscription type,
// but the field is still present in API responses. Access it via cast.
function getSubPeriodEnd(sub: Stripe.Subscription): number {
  return (sub as unknown as Record<string, number>)['current_period_end'] ?? 0
}

const PRICE_IDS = {
  essential_monthly: process.env.STRIPE_ESSENTIAL_MONTHLY_PRICE_ID ?? 'price_essential_monthly_placeholder',
  essential_annual: process.env.STRIPE_ESSENTIAL_ANNUAL_PRICE_ID ?? 'price_essential_annual_placeholder',
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? (process.env.STRIPE_PRO_PRICE_ID ?? 'price_pro_monthly_placeholder'),
  pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? 'price_pro_annual_placeholder',
} as const

// Reverse-lookup: price ID → { tier, interval }
function tierFromPriceId(priceId: string): { tier: 'essential' | 'pro'; interval: 'monthly' | 'annual' } | null {
  for (const [key, id] of Object.entries(PRICE_IDS)) {
    if (id === priceId) {
      const [tier, interval] = key.split('_') as ['essential' | 'pro', 'monthly' | 'annual']
      return { tier, interval }
    }
  }
  return null
}

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_placeholder'
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

async function notifyFirstCustomer(email: string, tier: string, interval: string, utmSource?: string | null) {
  const msg = `FIRST PAYING CUSTOMER: ${email}, ${tier}, ${interval}, utm_source=${utmSource ?? 'unknown'}`
  console.log(`[billing] 🎉 ${msg}`)

  // Slack webhook (optional)
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL
  if (slackWebhookUrl) {
    try {
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `🎉 ${msg}` }),
      })
    } catch {
      // non-critical
    }
  }

  // Founder email via PostHog identify (we don't have a direct email helper for internal alerts)
  // Log to stdout as well so Railway captures it
}

async function capturePosthogEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  if (!POSTHOG_API_KEY || POSTHOG_API_KEY.includes('phc_placeholder')) return
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: POSTHOG_API_KEY, distinct_id: distinctId, event, properties }),
    })
  } catch {
    // non-critical: don't block billing logic
  }
}

export async function billingRoutes(server: FastifyInstance) {
  // POST /api/billing/checkout — create Stripe Checkout session (auth required)
  server.post('/checkout', { preHandler: requireAuth }, async (req, reply) => {
    const body = req.body as { tier?: string; interval?: string }
    const tier = (body.tier === 'essential' || body.tier === 'pro') ? body.tier : 'pro'
    const interval = (body.interval === 'annual') ? 'annual' : 'monthly'
    const priceKey = `${tier}_${interval}` as keyof typeof PRICE_IDS
    const priceId = PRICE_IDS[priceKey]

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true, stripeCustomerId: true, subscriptionTier: true, trialEndsAt: true, stripeSubscriptionId: true, utmSource: true, utmMedium: true, utmCampaign: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })
    if (user.subscriptionTier === tier) {
      return reply.status(400).send({ error: `Already subscribed to ${tier}` })
    }

    // Create or reuse Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email })
      customerId = customer.id
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { stripeCustomerId: customerId },
      })
    }

    // Trial eligibility: trial only applies to Pro; never had a subscription or trial before
    const hasHadTrial = !!(user.stripeSubscriptionId || user.trialEndsAt)
    const trialEligible = tier === 'pro' && !hasHadTrial

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: trialEligible ? { trial_period_days: 7 } : undefined,
      success_url: `${WEB_URL}/dashboard?upgraded=1`,
      cancel_url: `${WEB_URL}/upgrade?cancelled=1`,
      metadata: {
        userId: req.user.userId,
        ...(user.utmSource ? { utm_source: user.utmSource } : {}),
        ...(user.utmMedium ? { utm_medium: user.utmMedium } : {}),
        ...(user.utmCampaign ? { utm_campaign: user.utmCampaign } : {}),
      },
    })

    return reply.send({ url: session.url, hasTrial: trialEligible })
  })

  // POST /api/billing/portal — create Stripe Customer Portal session
  server.post('/portal', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { stripeCustomerId: true },
    })
    if (!user?.stripeCustomerId) {
      return reply.status(400).send({ error: 'No billing account found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${WEB_URL}/dashboard`,
    })

    return reply.send({ url: session.url })
  })

  // POST /api/billing/webhook — Stripe webhook handler (no auth)
  server.post('/webhook', {
    config: { rawBody: true },
  }, async (req, reply) => {
    const sig = req.headers['stripe-signature'] as string
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        (req as unknown as { rawBody: Buffer }).rawBody,
        sig,
        WEBHOOK_SECRET,
      )
    } catch {
      return reply.status(400).send({ error: 'Invalid webhook signature' })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const utmSource = session.metadata?.utm_source ?? null
      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        const isTrialing = sub.status === 'trialing'
        const trialEnd = (sub as unknown as Record<string, number | null>)['trial_end']
        // Derive tier and interval from the price ID on the subscription
        const subPriceId = sub.items.data[0]?.price.id ?? ''
        const tierInfo = tierFromPriceId(subPriceId)
        const resolvedTier = tierInfo?.tier ?? 'pro'
        const resolvedInterval = tierInfo?.interval ?? 'monthly'

        // Detect if this is the very first paid subscription ever
        const existingPaidCount = await prisma.user.count({
          where: { firstPaidAt: { not: null } },
        })
        const isFirstEver = existingPaidCount === 0 && !isTrialing

        const userRecord = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, firstPaidAt: true, utmSource: true },
        })

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: resolvedTier,
            subscriptionInterval: resolvedInterval,
            stripeSubscriptionId: sub.id,
            subscriptionExpiresAt: new Date(getSubPeriodEnd(sub) * 1000),
            trialEndsAt: isTrialing && trialEnd ? new Date(trialEnd * 1000) : null,
            // Set firstPaidAt only once, only for non-trial starts
            ...(!isTrialing && !userRecord?.firstPaidAt ? { firstPaidAt: new Date() } : {}),
          },
        })

        if (isTrialing) {
          await capturePosthogEvent(userId, 'trial_started', {
            trial_end_at: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
            subscription_id: sub.id,
            tier: resolvedTier,
          })
        } else {
          const effectiveUtmSource = utmSource ?? userRecord?.utmSource ?? null
          await capturePosthogEvent(userId, 'subscription_started', {
            subscription_id: sub.id,
            tier: resolvedTier,
            interval: resolvedInterval,
            utm_source: effectiveUtmSource,
            is_first_ever: isFirstEver,
          })

          // First customer milestone alert
          if (isFirstEver && userRecord?.email) {
            await notifyFirstCustomer(userRecord.email, resolvedTier, resolvedInterval, effectiveUtmSource)
            await capturePosthogEvent(userId, 'first_paying_customer', {
              email: userRecord.email,
              tier: resolvedTier,
              interval: resolvedInterval,
              utm_source: effectiveUtmSource,
            })
          }
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionTier: 'free',
          subscriptionInterval: null,
          stripeSubscriptionId: null,
          subscriptionExpiresAt: null,
          trialEndsAt: null,
        },
      })
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription
      const active = sub.status === 'active' || sub.status === 'trialing'
      const isTrialing = sub.status === 'trialing'
      const trialEnd = (sub as unknown as Record<string, number | null>)['trial_end']
      const previousAttributes = (event.data as unknown as Record<string, unknown>)['previous_attributes'] as Record<string, unknown> | undefined
      const wasTrialing = (previousAttributes as Record<string, unknown> | undefined)?.['status'] === 'trialing'
      const subPriceId = sub.items.data[0]?.price.id ?? ''
      const tierInfo = tierFromPriceId(subPriceId)
      const resolvedTier = tierInfo?.tier ?? 'pro'
      const resolvedInterval = tierInfo?.interval ?? 'monthly'
      const updatedUsers = await prisma.user.findMany({
        where: { stripeSubscriptionId: sub.id },
        select: { id: true },
      })
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionTier: active ? resolvedTier : 'free',
          subscriptionInterval: active ? resolvedInterval : null,
          subscriptionExpiresAt: active ? new Date(getSubPeriodEnd(sub) * 1000) : null,
          trialEndsAt: isTrialing && trialEnd ? new Date(trialEnd * 1000) : null,
        },
      })
      // Fire trial_converted when transitioning from trialing → active
      if (wasTrialing && sub.status === 'active') {
        // Set firstPaidAt for users who didn't pay directly (trial converters)
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: sub.id, firstPaidAt: null },
          data: { firstPaidAt: new Date() },
        })
        for (const user of updatedUsers) {
          await capturePosthogEvent(user.id, 'trial_converted', {
            subscription_id: sub.id,
            tier: resolvedTier,
          })
        }
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const invoiceAmountCents = invoice.amount_paid
      // Find user by Stripe customer ID and log affiliate commission if applicable
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      })
      if (user && invoiceAmountCents > 0 && invoice.id) {
        await logAffiliateCommission(user.id, invoice.id, invoiceAmountCents)
      }
    }

    return reply.send({ received: true })
  })

  // POST /api/billing/trial-reminders — send day-5 trial ending soon emails (protected by DIGEST_SECRET)
  server.post('/trial-reminders', async (req, reply) => {
    const authHeader = req.headers['authorization'] ?? ''
    const digestSecret = process.env.DIGEST_SECRET ?? 'digest-dev-secret'
    if (authHeader !== `Bearer ${digestSecret}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const now = new Date()
    // Find users whose trial ends in ~2 days (48h window to catch day-5 of a 7-day trial)
    const windowStart = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
    const windowEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    const users = await prisma.user.findMany({
      where: {
        subscriptionTier: { in: ['pro', 'essential'] },
        trialEndsAt: { gte: windowStart, lte: windowEnd },
      },
      select: { id: true, email: true, name: true, trialEndsAt: true },
    })

    // Fetch which users already received the trial_reminder email
    const alreadySent = new Set(
      (
        await prisma.onboardingEmail.findMany({
          where: { userId: { in: users.map((u) => u.id) }, emailType: 'trial_reminder' },
          select: { userId: true },
        })
      ).map((r) => r.userId),
    )

    let sent = 0
    for (const user of users) {
      if (alreadySent.has(user.id)) continue
      const daysRemaining = Math.ceil(
        (user.trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )
      try {
        await sendTrialEndingSoonEmail(user.email, user.name, daysRemaining)
        await prisma.onboardingEmail.create({
          data: { userId: user.id, emailType: 'trial_reminder' },
        })
        await capturePosthogEvent(user.id, 'trial_reminder_sent', { days_remaining: daysRemaining })
        sent++
      } catch (err) {
        console.error(`[billing] Failed to send trial reminder to ${user.email}:`, err)
      }
    }

    return reply.send({ sent, total: users.length })
  })

  // GET /api/billing/status — get current subscription status (auth required)
  server.get('/status', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { subscriptionTier: true, subscriptionInterval: true, subscriptionExpiresAt: true, trialEndsAt: true },
    })
    const now = new Date()
    const trialEndsAt = user?.trialEndsAt ?? null
    const isOnTrial = !!(trialEndsAt && trialEndsAt > now)
    const trialDaysRemaining = isOnTrial
      ? Math.ceil((trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null
    const tier = user?.subscriptionTier ?? 'free'
    return reply.send({
      tier,
      interval: user?.subscriptionInterval ?? null,
      isPro: tier === 'pro',
      isEssential: tier === 'essential',
      isPaid: tier === 'pro' || tier === 'essential',
      expiresAt: user?.subscriptionExpiresAt ?? null,
      isOnTrial,
      trialEndsAt,
      trialDaysRemaining,
    })
  })
}
