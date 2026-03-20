import type { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${WEB_URL}/dashboard?upgraded=1`,
      cancel_url: `${WEB_URL}/upgrade?cancelled=1`,
      metadata: { userId: req.user.userId },
    })

    return reply.send({ url: session.url })
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
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'pro',
            stripeSubscriptionId: sub.id,
            subscriptionExpiresAt: new Date(getSubPeriodEnd(sub) * 1000),
          },
        })
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
        },
      })
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription
      const active = sub.status === 'active' || sub.status === 'trialing'
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionTier: active ? 'pro' : 'free',
          subscriptionExpiresAt: active ? new Date(getSubPeriodEnd(sub) * 1000) : null,
        },
      })
    }

    return reply.send({ received: true })
  })

  // GET /api/billing/status — get current subscription status (auth required)
  server.get('/status', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { subscriptionTier: true, subscriptionExpiresAt: true },
    })
    return reply.send({
      tier: user?.subscriptionTier ?? 'free',
      isPro: user?.subscriptionTier === 'pro',
      expiresAt: user?.subscriptionExpiresAt ?? null,
    })
  })
}
