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

interface ProDeepDiveEmailProps {
  userName: string | null
  dashboardUrl: string
  profileUrl: string
}

export function ProDeepDiveEmail({ userName, dashboardUrl, profileUrl }: ProDeepDiveEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>How to read your psychological profile — a guide for Pro members</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>How to read your profile (and what it actually means)</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              Most people glance at their scores and move on. Here's how to get 10× more from your
              psychological portrait.
            </Text>

            {/* Dimensions guide */}
            <Section style={dimensionContainerStyle}>
              <Text style={sectionLabelStyle}>THE FOUR LAYERS OF YOUR PROFILE</Text>

              <Section style={dimensionRowStyle}>
                <Text style={dimensionTitleStyle}>Big Five dimensions</Text>
                <Text style={dimensionDescStyle}>
                  These aren't labels — they're spectrums. High Openness doesn't mean you're
                  creative; it means you generate novel connections rapidly. Low Agreeableness
                  doesn't mean you're difficult; it means you prioritize truth over harmony. Look at
                  which scores surprise you — those gaps are where growth happens.
                </Text>
              </Section>

              <Section style={dimensionRowStyle}>
                <Text style={dimensionTitleStyle}>Your archetype</Text>
                <Text style={dimensionDescStyle}>
                  Your dominant Jungian archetype describes your unconscious motivational pattern —
                  how you instinctively approach challenges, relationships, and meaning. It's not
                  who you are; it's the role you default to under pressure.
                </Text>
              </Section>

              <Section style={dimensionRowStyle}>
                <Text style={dimensionTitleStyle}>Attachment style</Text>
                <Text style={dimensionDescStyle}>
                  This is your relational operating system. It predicts how you behave when
                  connections feel threatened — do you pull closer, withdraw, or oscillate? This
                  dimension often explains patterns you've repeated across multiple relationships.
                </Text>
              </Section>

              <Section style={dimensionRowLastStyle}>
                <Text style={dimensionTitleStyle}>The AI synthesis</Text>
                <Text style={dimensionDescStyle}>
                  This is where the frameworks intersect. The synthesis identifies non-obvious
                  patterns — like how your Big Five scores interact with your attachment style to
                  create specific blind spots. Read slowly. Highlight what resonates and what
                  challenges you.
                </Text>
              </Section>
            </Section>

            <Section style={tipBoxStyle}>
              <Text style={tipLabelStyle}>PRO TIP</Text>
              <Text style={tipTextStyle}>
                The most valuable part of your profile isn't what confirms what you already know —
                it's the 1-2 insights that make you uncomfortable. Sit with those.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={profileUrl} style={buttonStyle}>
                Read your full synthesis →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Coming up in 3 days: how people with your profile are using Innermind to unlock
              their blind spots.{' '}
              <a href={dashboardUrl} style={dashboardLinkStyle}>
                Open dashboard
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
  fontSize: '22px',
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

const sectionLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 16px',
  textTransform: 'uppercase',
}

const dimensionContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const dimensionRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '16px',
  paddingBottom: '16px',
}

const dimensionRowLastStyle: React.CSSProperties = {}

const dimensionTitleStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 6px',
}

const dimensionDescStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
}

const tipBoxStyle: React.CSSProperties = {
  borderLeft: '3px solid #0f0f0f',
  marginBottom: '32px',
  paddingLeft: '16px',
}

const tipLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 6px',
  textTransform: 'uppercase',
}

const tipTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '0',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '32px',
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

export default ProDeepDiveEmail
