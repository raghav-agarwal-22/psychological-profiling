# Innermind Launch Support FAQ
**Version:** 1.0 — First 24 hours
**Status:** Ready to use
**Related:** [INN-257](/INN/issues/INN-257)

---

## Part 1: FAQ (User-Facing)

### Assessment & Product

**Q: What is Innermind?**
A: Innermind is a psychological profiling platform that synthesizes five personality frameworks — Big Five, MBTI, Enneagram, attachment style, and cognitive patterns — into one unified portrait. Instead of siloed test results, you get an integrated view of how your traits interact.

**Q: Is the free tier actually free?**
A: Yes, completely. No credit card required. The free tier gives you the Big Five assessment and a partial profile. You can upgrade to Pro anytime if you want the full experience.

**Q: What does Pro ($19/mo) include?**
A: All 5 frameworks fully assessed and synthesized, a personalized AI portrait, adaptive deep-dive questions, an AI coach that knows your full profile, growth tracking over time, and a reflective journal with personalized prompts.

**Q: How accurate are the results?**
A: Big Five is the most empirically validated personality framework — the science is solid. MBTI and Enneagram are less rigorous scientifically but have strong self-insight value for many people. We're transparent about this tradeoff. The synthesis across frameworks tends to surface patterns that single tests miss.

**Q: Do I need to create an account to take the assessment?**
A: No — you can take the Big Five assessment anonymously. You'll need an account to save your results and access the full profile.

**Q: What happens to my data?**
A: Your assessment data is stored securely and used only to generate your profile. We don't sell it, share it with third parties, or use it for advertising. See our privacy policy for details.

---

### Billing & Payments

**Q: What payment methods do you accept?**
A: All major credit and debit cards via Stripe (Visa, Mastercard, Amex, Discover). No PayPal at this time.

**Q: Can I cancel anytime?**
A: Yes. You can cancel your Pro subscription at any time from your account settings. You keep Pro access until the end of your current billing period.

**Q: Do you offer refunds?**
A: Yes — if you're not satisfied within 7 days of your first charge, email us for a full refund. After 7 days, we don't offer prorated refunds but you can always cancel to stop future charges.

**Q: Is there an annual plan?**
A: Yes — annual Pro is available at a discounted rate (equivalent to ~2 months free). You can select it on the upgrade page.

**Q: I was charged but my account still shows Free tier.**
A: This is usually a webhook delay. Wait 2-3 minutes and refresh. If it's still not updated after 5 minutes, email us at support@innermind.app with your email address and we'll fix it immediately.

**Q: Can I get a student or hardship discount?**
A: We don't have a formal program yet, but email us. We'll work something out for students or people in financial hardship.

---

### Account & Login

**Q: I didn't receive a login email.**
A: Check your spam folder first. If it's not there, try requesting a new magic link. If email delivery is having issues, our app also displays a one-time code directly on screen — check the login page for an "OTP" option.

**Q: I lost access to my email. Can I recover my account?**
A: Email us at support@innermind.app with your original email address and any info about your account. We'll help you recover it.

**Q: Can I change my email address?**
A: Not yet — contact support and we'll do it manually.

**Q: Can I delete my account?**
A: Yes. Email support@innermind.app and we'll delete your account and all associated data within 48 hours.

---

## Part 2: Canned Responses (Internal — Copy-Paste Ready)

### Billing: User charged but still on Free tier

> Hi [Name],
>
> Thanks for reaching out! This sometimes happens when our billing webhook is delayed. I've manually verified your payment and upgraded your account to Pro — you should see the full profile now. Please refresh and let me know if you're still seeing the Free tier.
>
> Sorry for the friction, and welcome to Pro!

*(Internal action: In Stripe Dashboard, confirm `checkout.session.completed` was received. Then in the database, set `subscriptionTier = 'pro'` for the user's email.)*

---

### Billing: Refund request (within 7 days)

> Hi [Name],
>
> Of course — I've issued a full refund of $19.00 to your card. It typically appears within 3-5 business days depending on your bank.
>
> If there's anything that didn't work for you, I'd genuinely love to know — I read every piece of feedback personally.

*(Internal action: Stripe Dashboard → Customers → find customer → Payments → Refund.)*

---

### Billing: Refund request (after 7 days)

> Hi [Name],
>
> I can see you've been subscribed for [X days/weeks]. While our policy is 7-day refunds, I want to be fair — tell me what wasn't working and I'll see what I can do. At minimum, I can make sure your remaining access is worthwhile or cancel so you're not charged again.

*(Internal action: Use judgment. If reasonable, issue partial or full refund. Always cancel their subscription to stop future charges.)*

---

### Login: Magic link not received

> Hi [Name],
>
> Sorry about that! A few things to try:
> 1. Check your spam/promotions folder for an email from noreply@innermind.app
> 2. Try requesting a new link — they expire after 15 minutes
> 3. On the login page, look for a "Use code instead" option — we show a one-time code directly on screen as a backup
>
> If none of those work, reply here with the email address you used and I'll look into it.

---

### Account: User wants to delete their account

> Hi [Name],
>
> I've deleted your account and all associated data. This is complete and irreversible — if you ever want to come back, you'd start fresh.
>
> Thanks for trying Innermind, and I'm sorry it wasn't the right fit.

*(Internal action: Remove user from database. Cancel Stripe subscription if Pro. Confirm deletion in reply.)*

---

### General: Bug report

> Hi [Name],
>
> Thanks for reporting this — super helpful. I've logged it and will investigate. Can you tell me:
> - What browser/device you were using?
> - What you were doing when it happened?
> - Does it happen consistently or was it a one-off?
>
> I'll update you when it's fixed.

*(Internal action: Create a bug issue in Paperclip with the user's repro steps.)*

---

### General: Feature request

> Hi [Name],
>
> Love the idea — I've added it to the roadmap. No promises on timeline, but user requests genuinely drive what we build next.
>
> Is there anything about the current experience we can do to make it better for you in the meantime?

---

## Part 3: Support Escalation Path

1. **Self-serve:** User reads FAQ on /help page (to be built)
2. **Email support:** support@innermind.app — founder handles for now
3. **Billing issues (urgent):** Check Stripe Dashboard directly, fix manually if needed
4. **Bug reports:** Log in Paperclip, assign to CTO agent
5. **Refund disputes:** Always issue refund immediately to avoid chargebacks

**Response time targets (day 1):**
- Billing issues: <2 hours
- Login/auth issues: <4 hours
- General questions: <24 hours
- Feature requests: Acknowledge within 48 hours
