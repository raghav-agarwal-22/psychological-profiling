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

interface BridgeEscapeFollowupEmailProps {
  opennessScore: number
  upgradeUrl: string
}

export function BridgeEscapeFollowupEmail({
  opennessScore,
  upgradeUrl,
}: BridgeEscapeFollowupEmailProps) {
  const level = opennessScore >= 60 ? 'High' : opennessScore <= 40 ? 'Low' : 'Moderate'
  const interp =
    opennessScore >= 60
      ? "You're drawn to new ideas, art, and unconventional thinking."
      : opennessScore <= 40
      ? 'You tend to be practical, grounded, and preferring the familiar.'
      : 'You balance curiosity with practicality — open but grounded.'

  return (
    <Html lang="en">
      <Head />
      <Preview>{`Your Big Five Openness score: ${opennessScore}/100`}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Your Openness Score: {opennessScore}/100</Heading>
            <Text style={bodyTextStyle}>
              <strong>{level} Openness</strong> — {interp}
            </Text>

            <Hr style={hrStyle} />

            <Text style={bodyTextStyle}>
              But Openness is just one piece. When our AI synthesizes it alongside your likely
              attachment patterns, Enneagram type, and core values, a different picture emerges —
              one most people say is the most accurate thing they&apos;ve ever read about
              themselves.
            </Text>

            <Section style={{ textAlign: 'center' as const, marginTop: '24px' }}>
              <Button style={ctaStyle} href={upgradeUrl}>
                See My Full Portrait — $0 Today
              </Button>
            </Section>

            <Text style={disclaimerStyle}>
              7-day free trial. Card required. Cancel anytime before day 7.
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              You took the Big Five quiz on Innermind. If you didn&apos;t take this quiz, you can
              safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle = {
  backgroundColor: '#0a0a0f',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: '0',
  padding: '0',
}

const containerStyle = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 20px',
}

const headerStyle = {
  textAlign: 'center' as const,
  paddingBottom: '24px',
}

const logoStyle = {
  fontSize: '20px',
  fontWeight: '700' as const,
  color: '#f5f5f4',
  margin: '0',
}

const taglineStyle = {
  fontSize: '12px',
  color: '#78716c',
  margin: '4px 0 0',
}

const bodyContentStyle = {
  padding: '24px',
  backgroundColor: '#1c1917',
  borderRadius: '12px',
  border: '1px solid #292524',
}

const headingStyle = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: '#f5f5f4',
  margin: '0 0 16px',
}

const bodyTextStyle = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#d6d3d1',
  margin: '0 0 12px',
}

const hrStyle = {
  borderColor: '#292524',
  margin: '20px 0',
}

const ctaStyle = {
  backgroundColor: '#f59e0b',
  color: '#0c0a09',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '12px 32px',
  borderRadius: '10px',
  textDecoration: 'none',
}

const disclaimerStyle = {
  fontSize: '12px',
  color: '#78716c',
  textAlign: 'center' as const,
  marginTop: '12px',
}

const footerStyle = {
  textAlign: 'center' as const,
  paddingTop: '24px',
}

const footerTextStyle = {
  fontSize: '11px',
  color: '#57534e',
  margin: '0',
}
