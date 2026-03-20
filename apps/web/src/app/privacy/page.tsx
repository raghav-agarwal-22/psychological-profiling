import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Innermind',
  description: 'How Innermind collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero */}
      <div className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">Legal</p>
        <h1 className="font-serif text-4xl text-stone-100">Privacy Policy</h1>
        <p className="mt-4 text-stone-400">
          Effective date: March 1, 2026. Last updated: March 1, 2026.
        </p>
      </div>

      <div className="space-y-10 text-stone-400">

        {/* Introduction */}
        <section>
          <p className="leading-relaxed">
            Innermind (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal information.
            This Privacy Policy explains what data we collect when you use Innermind, how we use it,
            who we share it with, and what rights you have over your data. We comply with the General
            Data Protection Regulation (GDPR) and applicable data protection laws.
          </p>
          <p className="mt-4 leading-relaxed">
            By creating an account or using our services, you acknowledge that you have read and
            understood this policy. If you do not agree with these practices, please do not use
            Innermind.
          </p>
        </section>

        {/* What data we collect */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">1. What data we collect</h2>

          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <h3 className="mb-2 font-semibold text-stone-200">Account information</h3>
              <p className="text-sm leading-relaxed">
                When you sign up, we collect your <strong className="text-stone-300">email address</strong>.
                We use magic-link authentication — we do not store passwords. You may optionally
                provide your name and timezone in your profile settings.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <h3 className="mb-2 font-semibold text-stone-200">Assessment responses</h3>
              <p className="text-sm leading-relaxed">
                Innermind collects your answers to psychological assessments (e.g., Big Five
                personality, values inventory, attachment style, Enneagram). These responses are
                the core data needed to generate your psychological profile and insights. This
                is sensitive personal data and is treated with the highest level of care.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <h3 className="mb-2 font-semibold text-stone-200">Profile and journal data</h3>
              <p className="text-sm leading-relaxed">
                We store your generated psychological profiles, AI-synthesised insights, journal
                entries, daily reflection responses, and any notes you write within the platform.
                This data is private to you unless you choose to share it.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <h3 className="mb-2 font-semibold text-stone-200">Usage analytics</h3>
              <p className="text-sm leading-relaxed">
                We collect anonymised usage data — pages visited, features used, session duration —
                to understand how people use Innermind and improve the product. This is collected
                via PostHog (see Section 3) and does not include your assessment content.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <h3 className="mb-2 font-semibold text-stone-200">Payment information</h3>
              <p className="text-sm leading-relaxed">
                If you subscribe to Innermind Pro or Teams, payment is processed by Stripe.
                We do not store your credit card number — only a Stripe customer ID and
                subscription status. Please refer to Stripe&apos;s privacy policy for how payment
                data is handled.
              </p>
            </div>
          </div>
        </section>

        {/* How we use it */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">2. How we use your data</h2>
          <ul className="space-y-3 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
              <span>
                <strong className="text-stone-300">Profile generation.</strong> Your assessment
                responses are sent to Anthropic&apos;s Claude AI to generate a personalised
                psychological profile, narrative synthesis, and growth recommendations.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
              <span>
                <strong className="text-stone-300">AI coaching.</strong> If you use the AI coach
                feature, your messages and profile context are sent to Anthropic to generate
                conversational responses.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
              <span>
                <strong className="text-stone-300">Email communications.</strong> We send
                transactional emails (magic links, receipts) and, if you opt in, periodic
                digest emails summarising your insights. Emails are delivered via Resend.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
              <span>
                <strong className="text-stone-300">Product improvement.</strong> Anonymised
                analytics help us understand usage patterns and improve features. Individual
                assessment data is never used for this purpose.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
              <span>
                <strong className="text-stone-300">Billing and subscriptions.</strong> We use
                your account data to manage your subscription, process payments, and send
                billing-related communications.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed">
            We do not sell your personal data. We do not use your psychological profile data
            for advertising. We do not share individual-level data with employers, insurers,
            or any third party for commercial purposes.
          </p>
        </section>

        {/* Third-party services */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">3. Third-party services</h2>
          <p className="mb-4 text-sm leading-relaxed">
            Innermind uses the following third-party sub-processors to deliver our service.
            Each is bound by data processing agreements consistent with GDPR requirements.
          </p>
          <div className="overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/60">
                  <th className="px-4 py-3 text-left font-medium text-stone-300">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-300">Purpose</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-300">Data shared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                <tr className="bg-stone-900/20">
                  <td className="px-4 py-3 text-stone-300">Anthropic (Claude AI)</td>
                  <td className="px-4 py-3 text-stone-400">Profile generation, AI coach</td>
                  <td className="px-4 py-3 text-stone-400">Assessment responses, profile data</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-stone-300">Resend</td>
                  <td className="px-4 py-3 text-stone-400">Transactional &amp; digest emails</td>
                  <td className="px-4 py-3 text-stone-400">Email address, name</td>
                </tr>
                <tr className="bg-stone-900/20">
                  <td className="px-4 py-3 text-stone-300">Stripe</td>
                  <td className="px-4 py-3 text-stone-400">Payment processing</td>
                  <td className="px-4 py-3 text-stone-400">Email address, billing info</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-stone-300">PostHog</td>
                  <td className="px-4 py-3 text-stone-400">Product analytics</td>
                  <td className="px-4 py-3 text-stone-400">Anonymised usage events</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Data retention */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">4. Data retention</h2>
          <p className="mb-3 text-sm leading-relaxed">
            We retain your account and assessment data for as long as your account is active.
            Psychological profiles, assessment responses, journal entries, and insights are
            stored indefinitely so that longitudinal tracking and historical comparisons remain
            available to you.
          </p>
          <p className="text-sm leading-relaxed">
            If you request deletion of your account (see Section 5), we will permanently
            delete all your personal data within 30 days, except where we are required by
            law to retain records (e.g., billing records, which are retained for 7 years
            for tax compliance purposes).
          </p>
        </section>

        {/* Your rights */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">5. Your rights</h2>
          <p className="mb-4 text-sm leading-relaxed">
            Under GDPR and applicable data protection law, you have the following rights:
          </p>
          <div className="space-y-4">
            {[
              {
                right: 'Right of access',
                description:
                  'You can request a full export of all personal data we hold about you, including assessment responses, profiles, and journal entries.',
              },
              {
                right: 'Right to deletion',
                description:
                  'You can request that we permanently delete your account and all associated data. Submit a deletion request to privacy@innermind.app.',
              },
              {
                right: 'Right to portability',
                description:
                  'You can request your data in a machine-readable format (JSON). This includes your profiles, assessment results, and journal entries.',
              },
              {
                right: 'Right to rectification',
                description:
                  'If any data we hold about you is inaccurate, you can update it in your account settings or contact us.',
              },
              {
                right: 'Right to object',
                description:
                  'You can opt out of email digests at any time from your account settings. You can withdraw consent for AI processing by contacting us.',
              },
              {
                right: 'Right to restrict processing',
                description:
                  'You can request that we limit how we process your data while a complaint is being resolved.',
              },
            ].map((item) => (
              <div key={item.right} className="flex gap-4 rounded-xl border border-stone-800 bg-stone-900/30 p-4">
                <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
                <div>
                  <p className="mb-1 font-medium text-stone-200">{item.right}</p>
                  <p className="text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:privacy@innermind.app" className="text-amber-400 underline hover:text-amber-300">
              privacy@innermind.app
            </a>
            . We will respond within 30 days. If you believe we have violated your rights,
            you have the right to lodge a complaint with your local data protection authority.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">6. Cookies and tracking</h2>
          <p className="text-sm leading-relaxed">
            Innermind uses essential cookies to maintain your session and authentication state.
            We use PostHog for product analytics, which may set cookies on your browser. You can
            disable non-essential cookies in your browser settings. We do not use advertising
            cookies or third-party tracking pixels.
          </p>
        </section>

        {/* Security */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">7. Data security</h2>
          <p className="text-sm leading-relaxed">
            We take the security of your psychological data seriously. All data is transmitted
            over TLS (HTTPS). Our database is encrypted at rest. We use short-lived authentication
            tokens and do not store passwords. Access to production data is restricted to
            authorised personnel only. In the event of a data breach, we will notify affected
            users within 72 hours as required by GDPR.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="mb-4 font-serif text-2xl text-stone-200">8. Changes to this policy</h2>
          <p className="text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by email or via an in-app notice at least 14 days before the changes take
            effect. The &ldquo;last updated&rdquo; date at the top of this page reflects the most recent
            revision.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="mb-3 font-serif text-xl text-stone-200">Contact us</h2>
          <p className="mb-2 text-sm leading-relaxed">
            For any privacy-related questions, data requests, or complaints, contact our
            privacy team:
          </p>
          <p className="text-sm">
            <strong className="text-stone-300">Email:</strong>{' '}
            <a href="mailto:privacy@innermind.app" className="text-amber-400 underline hover:text-amber-300">
              privacy@innermind.app
            </a>
          </p>
          <p className="mt-1 text-sm">
            <strong className="text-stone-300">Company:</strong> Innermind, Inc.
          </p>
        </section>

      </div>
    </div>
  )
}
