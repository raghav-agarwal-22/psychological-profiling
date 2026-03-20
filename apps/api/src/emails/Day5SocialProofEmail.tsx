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

interface Day5SocialProofEmailProps {
  userName: string | null
  archetypeName: string
  profileUrl: string
  upgradeUrl: string
}

export function Day5SocialProofEmail({
  userName,
  archetypeName,
  profileUrl,
  upgradeUrl,
}: Day5SocialProofEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>How people like you use Innermind</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>People like you use Innermind to...</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              You&apos;re five days in. Here&apos;s how others with similar profiles have used
              Innermind to actually change something:
            </Text>

            {/* Testimonial 1 */}
            <Section style={quoteBoxStyle}>
              <Text style={quoteTextStyle}>
                &ldquo;I finally understood why I keep attracting the same type of partner. The
                attachment style + Enneagram cross-analysis was like a slap in the face — in the
                best way.&rdquo;
              </Text>
              <Text style={quoteAttributionStyle}>— {archetypeName} / High Openness</Text>
            </Section>

            {/* Testimonial 2 */}
            <Section style={quoteBoxStyle}>
              <Text style={quoteTextStyle}>
                &ldquo;The AI coach doesn&apos;t give you generic advice. It actually references
                your specific profile. My therapist recommended I keep using it between
                sessions.&rdquo;
              </Text>
              <Text style={quoteAttributionStyle}>— Caregiver / High Agreeableness</Text>
            </Section>

            {/* Testimonial 3 */}
            <Section style={quoteBoxStyle}>
              <Text style={quoteTextStyle}>
                &ldquo;I retook all 5 frameworks 3 months later and could literally see myself
                shift. The growth tracking feature made the change feel real.&rdquo;
              </Text>
              <Text style={quoteAttributionStyle}>— Hero / High Conscientiousness</Text>
            </Section>

            <Text style={bodyTextStyle}>
              The pattern? Everyone who gets the most out of Innermind uses it as a mirror —
              returning to it when something feels off, or when they want to understand a
              relationship better.
            </Text>

            <Section style={ctaGroupStyle}>
              <Section style={buttonSectionStyle}>
                <Button href={profileUrl} style={buttonStyle}>
                  Return to your portrait →
                </Button>
              </Section>
              <Text style={secondaryCtaStyle}>
                Ready to go deeper?{' '}
                <a href={upgradeUrl} style={upgradeLinkStyle}>
                  Upgrade to Pro
                </a>
              </Text>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Pro members get the AI coach, shadow archetype analysis, and unlimited deep dives.
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

const quoteBoxStyle: React.CSSProperties = {
  borderLeft: '3px solid #dddddd',
  marginBottom: '20px',
  paddingLeft: '16px',
}

const quoteTextStyle: React.CSSProperties = {
  color: '#444444',
  fontStyle: 'italic',
  fontSize: '14px',
  lineHeight: '1.65',
  margin: '0 0 6px',
}

const quoteAttributionStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  margin: '0',
}

const ctaGroupStyle: React.CSSProperties = {
  marginTop: '12px',
  marginBottom: '8px',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '16px',
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

const secondaryCtaStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '14px',
  margin: '0 0 32px',
}

const upgradeLinkStyle: React.CSSProperties = {
  color: '#0f0f0f',
  fontWeight: '500',
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

const footerLinkStyle: React.CSSProperties = {
  color: '#aaaaaa',
}

export default Day5SocialProofEmail
