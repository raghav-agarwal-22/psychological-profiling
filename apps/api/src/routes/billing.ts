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

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? 'price_placeholder'
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_placeholder'
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true, stripeCustomerId: true, subscriptionTier: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })
    if (user.subscriptionTier === 'pro') {
      return reply.status(400).send({ error: 'Already subscribed to Pro' })
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

    // Check if user is eligible for trial (never had a subscription or trial)
    // Check both stripeSubscriptionId (active) and trialEndsAt (had trial before, may have cancelled)
    const existingData = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { trialEndsAt: true, stripeSubscriptionId: true },
    })
    const hasHadTrial = !!(existingData?.stripeSubscriptionId || existingData?.trialEndsAt)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      subscription_data: hasHadTrial ? undefined : { trial_period_days: 7 },
      success_url: `${WEB_URL}/dashboard?upgraded=1`,
      cancel_url: `${WEB_URL}/upgrade?cancelled=1`,
      metadata: { userId: req.user.userId },
    })

    return reply.send({ url: session.url, hasTrial: !hasHadTrial })
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
      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        const isTrialing = sub.status === 'trialing'
        const trialEnd = (sub as unknown as Record<string, number | null>)['trial_end']
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'pro',
            stripeSubscriptionId: sub.id,
            subscriptionExpiresAt: new Date(getSubPeriodEnd(sub) * 1000),
            trialEndsAt: isTrialing && trialEnd ? new Date(trialEnd * 1000) : null,
          },
        })
        if (isTrialing) {
          await capturePosthogEvent(userId, 'trial_started', {
            trial_end_at: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
            subscription_id: sub.id,
          })
        } else {
          await capturePosthogEvent(userId, 'pro_subscription_started', {
            subscription_id: sub.id,
          })
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionTier: 'free',
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
      const updatedUsers = await prisma.user.findMany({
        where: { stripeSubscriptionId: sub.id },
        select: { id: true },
      })
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionTier: active ? 'pro' : 'free',
          subscriptionExpiresAt: active ? new Date(getSubPeriodEnd(sub) * 1000) : null,
          trialEndsAt: isTrialing && trialEnd ? new Date(trialEnd * 1000) : null,
        },
      })
      // Fire trial_converted when transitioning from trialing → active
      if (wasTrialing && sub.status === 'active') {
        for (const user of updatedUsers) {
          await capturePosthogEvent(user.id, 'trial_converted', {
            subscription_id: sub.id,
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
        subscriptionTier: 'pro',
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
      select: { subscriptionTier: true, subscriptionExpiresAt: true, trialEndsAt: true },
    })
    const now = new Date()
    const trialEndsAt = user?.trialEndsAt ?? null
    const isOnTrial = !!(trialEndsAt && trialEndsAt > now)
    const trialDaysRemaining = isOnTrial
      ? Math.ceil((trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null
    return reply.send({
      tier: user?.subscriptionTier ?? 'free',
      isPro: user?.subscriptionTier === 'pro',
      expiresAt: user?.subscriptionExpiresAt ?? null,
      isOnTrial,
      trialEndsAt,
      trialDaysRemaining,
    })
  })
}
