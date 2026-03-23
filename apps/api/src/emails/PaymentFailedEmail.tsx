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

interface PaymentFailedEmailProps {
  userName: string | null
  billingUrl: string
  attemptCount: number
}

export function PaymentFailedEmail({ userName, billingUrl, attemptCount }: PaymentFailedEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'
  const isFirstAttempt = attemptCount <= 1

  return (
    <Html lang="en">
      <Head />
      <Preview>Action required: update your payment method to keep Innermind Pro</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Payment failed</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              {isFirstAttempt
                ? 'We weren\'t able to process your Innermind Pro payment. Please update your payment method to avoid losing access to your profile, AI coach, and growth tracking.'
                : `We've tried processing your payment ${attemptCount} times without success. Please update your payment method now — if this continues, your Pro access may be paused.`}
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={billingUrl} style={buttonStyle}>
                Update payment method →
              </Button>
            </Section>

            <Text style={helpTextStyle}>
              If you need help or want to cancel, open the{' '}
              <Link href={billingUrl} style={linkStyle}>
                billing portal
              </Link>{' '}
              — no questions asked.
            </Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Questions? Reply to this email or visit your{' '}
              <Link href={billingUrl} style={linkStyle}>
                billing settings
              </Link>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerStyle}>
              &copy; 2025 Innermind. All rights reserved.
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
  color: '#c0392b',
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
  margin: '0 0 28px',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '20px',
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#c0392b',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '-0.1px',
  padding: '14px 32px',
  textDecoration: 'none',
}

const helpTextStyle: React.CSSProperties = {
  color: '#777777',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const linkStyle: React.CSSProperties = {
  color: '#555555',
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

export default PaymentFailedEmail
