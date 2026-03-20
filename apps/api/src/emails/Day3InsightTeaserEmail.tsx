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

interface Day3InsightTeaserEmailProps {
  userName: string | null
  archetypeName: string
  topTrait: string
  upgradeUrl: string
}

export function Day3InsightTeaserEmail({
  userName,
  archetypeName,
  topTrait,
  upgradeUrl,
}: Day3InsightTeaserEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>There's a side of you Innermind found — but it's locked</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Did you know?</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              As a <strong>{archetypeName}</strong> with high <strong>{topTrait}</strong>, your
              psychological profile contains insights most people never see about themselves.
            </Text>

            <Text style={bodyTextStyle}>
              Pro members see three layers you currently can&apos;t:
            </Text>

            {/* Locked insights */}
            <Section style={insightListStyle}>
              <Section style={insightRowStyle}>
                <Text style={insightTextStyle}>
                  <span style={lockIconStyle}>🔒</span>{' '}
                  <strong>Shadow archetype</strong> — the unconscious pattern driving your blind
                  spots
                </Text>
              </Section>
              <Section style={insightRowStyle}>
                <Text style={insightTextStyle}>
                  <span style={lockIconStyle}>🔒</span>{' '}
                  <strong>Relationship compatibility</strong> — how your attachment style pairs with
                  each Enneagram type
                </Text>
              </Section>
              <Section style={insightRowLastStyle}>
                <Text style={insightTextStyle}>
                  <span style={lockIconStyle}>🔒</span>{' '}
                  <strong>Core values tension map</strong> — where your Schwartz values conflict
                  with your daily behavior
                </Text>
              </Section>
            </Section>

            <Text style={teaserTextStyle}>
              These aren&apos;t generic personality facts. They&apos;re synthesized specifically
              from your five frameworks — built for you, not a type bucket.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={upgradeUrl} style={buttonStyle}>
                Unlock your full portrait →
              </Button>
            </Section>

            <Text style={pricingTextStyle}>Starts at $12/month. Cancel anytime.</Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Free members keep access to all 5 assessments and their basic portrait forever.
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

const insightListStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const insightRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '12px',
  paddingBottom: '12px',
}

const insightRowLastStyle: React.CSSProperties = {
  marginBottom: '0',
}

const lockIconStyle: React.CSSProperties = {
  marginRight: '6px',
}

const insightTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

const teaserTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '0 0 32px',
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

export default Day3InsightTeaserEmail
