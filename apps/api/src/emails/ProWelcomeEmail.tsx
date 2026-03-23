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

interface ProWelcomeEmailProps {
  userName: string | null
  dashboardUrl: string
  assessmentsUrl: string
}

export function ProWelcomeEmail({ userName, dashboardUrl, assessmentsUrl }: ProWelcomeEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Pro — here's how to get the most from Innermind</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>You're now Pro. Here's your roadmap.</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              AI-powered psychological profiling is now fully unlocked. Here's exactly what to do
              first — and why it matters.
            </Text>

            {/* Quick wins */}
            <Section style={stepsContainerStyle}>
              <Section style={stepRowStyle}>
                <Text style={stepNumberStyle}>1</Text>
                <Section style={stepContentStyle}>
                  <Text style={stepTitleStyle}>Complete all 5 frameworks</Text>
                  <Text style={stepDescStyle}>
                    Big Five, MBTI, Attachment, Values, and Shadow Work. Each one adds a layer to
                    your AI synthesis — the more you complete, the more accurate your portrait.
                  </Text>
                </Section>
              </Section>
              <Section style={stepRowStyle}>
                <Text style={stepNumberStyle}>2</Text>
                <Section style={stepContentStyle}>
                  <Text style={stepTitleStyle}>Read your AI synthesis</Text>
                  <Text style={stepDescStyle}>
                    Your synthesis isn't a personality label — it's a map of how you think, relate,
                    and grow. Look for the patterns that surprise you most.
                  </Text>
                </Section>
              </Section>
              <Section style={stepRowLastStyle}>
                <Text style={stepNumberStyle}>3</Text>
                <Section style={stepContentStyle}>
                  <Text style={stepTitleStyle}>Start a session with your AI coach</Text>
                  <Text style={stepDescStyle}>
                    Your coach has read every assessment you've taken. Ask it anything — about your
                    blind spots, your relationships, or what's been holding you back.
                  </Text>
                </Section>
              </Section>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={assessmentsUrl} style={buttonStyle}>
                Start your assessments →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Your profile is private by default. You control what gets shared.{' '}
              <a href={dashboardUrl} style={dashboardLinkStyle}>
                View your dashboard
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
  margin: '0 0 28px',
}

const stepsContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '32px',
  padding: '20px 24px',
}

const stepRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
  paddingBottom: '16px',
}

const stepRowLastStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
}

const stepNumberStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '50%',
  color: '#ffffff',
  flexShrink: 0,
  fontSize: '12px',
  fontWeight: '700',
  height: '24px',
  lineHeight: '24px',
  margin: '0',
  textAlign: 'center',
  width: '24px',
}

const stepContentStyle: React.CSSProperties = {
  flex: 1,
}

const stepTitleStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const stepDescStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.5',
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

export default ProWelcomeEmail
