import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface TrialEndingSoonEmailProps {
  userName: string | null
  daysRemaining: number
  billingUrl: string
  dashboardUrl: string
}

export function TrialEndingSoonEmail({
  userName,
  daysRemaining,
  billingUrl,
  dashboardUrl,
}: TrialEndingSoonEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>{`Your Innermind Pro trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>
              Your trial ends in {daysRemaining} day{daysRemaining === 1 ? '' : 's'}
            </Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              Your 7-day free trial of Innermind Pro is almost over. After{' '}
              {daysRemaining === 1 ? 'tomorrow' : `${daysRemaining} days`}, you'll be charged $9/month
              to continue enjoying Pro features.
            </Text>

            {/* Feature reminder */}
            <Section style={featureListStyle}>
              <Text style={featureLabelStyle}>You'll keep access to:</Text>
              <Section style={featureRowStyle}>
                <Text style={featureTextStyle}>
                  <span style={checkmarkStyle}>✓</span>{' '}
                  <strong>All 5 assessment frameworks</strong> — complete psychological portrait
                </Text>
              </Section>
              <Section style={featureRowStyle}>
                <Text style={featureTextStyle}>
                  <span style={checkmarkStyle}>✓</span>{' '}
                  <strong>AI coach</strong> — personalized guidance from your profile
                </Text>
              </Section>
              <Section style={featureRowLastStyle}>
                <Text style={featureTextStyle}>
                  <span style={checkmarkStyle}>✓</span>{' '}
                  <strong>Growth tracking &amp; recommendations</strong>
                </Text>
              </Section>
            </Section>

            <Text style={bodyTextStyle}>
              No action needed — your subscription continues automatically. You can cancel any time
              from the billing portal before your trial ends.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={billingUrl} style={buttonStyle}>
                Manage your plan →
              </Button>
            </Section>

            <Text style={pricingTextStyle}>$9/month after trial. Cancel any time.</Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Want to cancel before being charged?{' '}
              <Link href={billingUrl} style={dashboardLinkStyle}>
                Open the billing portal
              </Link>{' '}
              and cancel there — no questions asked.{' '}
              <Link href={dashboardUrl} style={dashboardLinkStyle}>
                Back to dashboard
              </Link>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerStyle}>
              &copy; 2025 Innermind. All rights reserved. |{' '}
              <a href="#" style={footerLinkStyle}>
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f5f4f0',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: '40px 0',
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  boxShadow: '0 1px 8px rgba(0, 0, 0, 0.08)',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  padding: '32px 40px',
}

const logoStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  margin: '0 0 6px',
}

const taglineStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  margin: '0',
}

const bodyContentStyle: React.CSSProperties = {
  padding: '40px',
}

const headingStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '24px',
  fontWeight: '600',
  letterSpacing: '-0.3px',
  margin: '0 0 8px',
}

const greetingStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 12px',
}

const bodyTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const featureLabelStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0 0 12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const featureListStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const featureRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '12px',
  paddingBottom: '12px',
}

const featureRowLastStyle: React.CSSProperties = {
  marginBottom: '0',
}

const checkmarkStyle: React.CSSProperties = {
  color: '#0f0f0f',
  fontWeight: '700',
  marginRight: '6px',
}

const featureTextStyle: React.CSSProperties = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '12px',
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '-0.1px',
  padding: '14px 32px',
  textDecoration: 'none',
}

const pricingTextStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  margin: '0 0 32px',
}

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #eeeeee',
  margin: '0 0 24px',
}

const footerNoteStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
}

const dashboardLinkStyle: React.CSSProperties = {
  color: '#555555',
}

const footerSectionStyle: React.CSSProperties = {
  borderTop: '1px solid #f0ece4',
  padding: '20px 40px 28px',
}

const footerStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center',
}

const footerLinkStyle: React.CSSProperties = {
  color: '#aaaaaa',
}

export default TrialEndingSoonEmail
