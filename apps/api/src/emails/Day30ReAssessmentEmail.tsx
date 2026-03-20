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

interface Day30ReAssessmentEmailProps {
  userName: string | null
  archetypeName: string
  topTrait: string
  assessmentUrl: string
  profileUrl: string
}

export function Day30ReAssessmentEmail({
  userName,
  archetypeName,
  topTrait,
  assessmentUrl,
  profileUrl,
}: Day30ReAssessmentEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>A month in — see how your personality portrait has evolved</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>30 days. Have you changed?</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              A month ago, you came to Innermind and discovered you&apos;re{' '}
              <strong>
                {archetypeName}
              </strong>{' '}
              with a high degree of <strong>{topTrait}</strong>.
            </Text>
            <Text style={bodyTextStyle}>
              A lot can shift in 30 days — your environment, your relationships, your stressors.
              Personality isn&apos;t fixed. Retaking the Big Five only takes a few minutes, and
              comparing your two portraits side-by-side often reveals more than either portrait alone.
            </Text>

            {/* Callout box */}
            <Section style={calloutStyle}>
              <Text style={calloutTextStyle}>
                Your original archetype: <strong>{archetypeName}</strong>
                <br />
                Your original standout trait: <strong>{topTrait}</strong>
              </Text>
              <Text style={calloutSubtextStyle}>
                How do these hold up a month later?
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={assessmentUrl} style={buttonStyle}>
                Retake Big Five →
              </Button>
            </Section>

            <Text style={subTextStyle}>Takes 4 minutes. Free for all users.</Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Want to review your original portrait first?{' '}
              <a href={profileUrl} style={profileLinkStyle}>
                View your profile
              </a>
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
  margin: '0 0 20px',
}

const calloutStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '28px',
  padding: '20px 24px',
}

const calloutTextStyle: React.CSSProperties = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 8px',
}

const calloutSubtextStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  fontStyle: 'italic',
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

const subTextStyle: React.CSSProperties = {
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

const profileLinkStyle: React.CSSProperties = {
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

export default Day30ReAssessmentEmail
