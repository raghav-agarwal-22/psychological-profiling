import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ReferralInviteEmailProps {
  referrerName: string | null
  referralUrl: string
}

export function ReferralInviteEmail({ referrerName, referralUrl }: ReferralInviteEmailProps) {
  const senderName = referrerName ?? 'A friend'

  return (
    <Html lang="en">
      <Head />
      <Preview>{senderName} thinks you&apos;ll love Innermind — get 1 month Pro free</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>{senderName} invited you to Innermind</Heading>

            <Text style={bodyTextStyle}>
              {senderName} is using Innermind to understand their psychology and wanted you to join
              them. Take 5 validated assessments — Big Five personality, Schwartz Values, Attachment
              Style, Enneagram, and Jungian Archetypes — and get an AI-synthesized portrait of who
              you are.
            </Text>

            {/* Reward callout */}
            <Section style={rewardBoxStyle}>
              <Text style={rewardTextStyle}>
                🎁 Use this link and you&apos;ll both get <strong>1 month Pro free</strong> when you complete your first assessment.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={referralUrl} style={buttonStyle}>
                Discover your archetype →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Innermind is used by thousands of people who want to understand themselves better —
              their patterns, values, and what drives them.
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
  color: '#111111',
  fontSize: '24px',
  fontWeight: '600',
  letterSpacing: '-0.3px',
  margin: '0 0 16px',
}

const bodyTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const rewardBoxStyle: React.CSSProperties = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fcd34d',
  borderRadius: '10px',
  marginBottom: '28px',
  padding: '16px 20px',
}

const rewardTextStyle: React.CSSProperties = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '28px',
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

export default ReferralInviteEmail
