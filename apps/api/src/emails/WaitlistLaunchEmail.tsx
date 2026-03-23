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

interface WaitlistLaunchEmailProps {
  startUrl: string
}

export function WaitlistLaunchEmail({ startUrl }: WaitlistLaunchEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your AI personality profile is ready — complete your assessment now</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Your AI profile is ready ✦</Heading>
            <Text style={bodyTextStyle}>
              You joined the waitlist for your AI-powered psychological profile. It's here.
            </Text>
            <Text style={bodyTextStyle}>
              Our AI synthesis engine is now live — it weaves together your assessment results into
              a deep, personalized narrative: your archetypes, patterns, blind spots, and growth edges.
            </Text>
            <Text style={bodyTextStyle}>
              Complete your assessment and see who you are at a deeper level.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button style={buttonStyle} href={startUrl}>
                Complete my assessment
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerTextStyle}>
              You're receiving this because you joined the Innermind AI profile waitlist.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#0c0a09',
  fontFamily: "'Georgia', serif",
  margin: 0,
  padding: 0,
}

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#1c1917',
  borderRadius: '12px',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  backgroundColor: '#0c0a09',
  padding: '32px 40px 24px',
  borderBottom: '1px solid #292524',
}

const logoStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#e7e5e4',
  margin: 0,
  letterSpacing: '-0.3px',
}

const taglineStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#78716c',
  margin: '4px 0 0',
}

const bodyContentStyle: React.CSSProperties = {
  padding: '36px 40px 40px',
}

const headingStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '600',
  color: '#e7e5e4',
  margin: '0 0 20px',
  lineHeight: '1.3',
}

const bodyTextStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#a8a29e',
  lineHeight: '1.7',
  margin: '0 0 16px',
}

const buttonSectionStyle: React.CSSProperties = {
  margin: '28px 0',
  textAlign: 'center' as const,
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#e7e5e4',
  color: '#0c0a09',
  padding: '13px 28px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
}

const hrStyle: React.CSSProperties = {
  borderColor: '#292524',
  margin: '24px 0',
}

const footerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#57534e',
  lineHeight: '1.6',
  margin: 0,
}
