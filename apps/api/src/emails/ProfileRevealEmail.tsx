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

interface ProfileRevealEmailProps {
  userName: string | null
  profileUrl: string
  assessmentUrl: string
  completedFramework: string
}

export function ProfileRevealEmail({
  userName,
  profileUrl,
  assessmentUrl,
  completedFramework,
}: ProfileRevealEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>Your psychological portrait is ready</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Your portrait is ready</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              Based on your {completedFramework} assessment, your AI portrait has been generated.
              This is just the beginning — each additional framework adds a new dimension to your
              self-understanding.
            </Text>

            <Section style={nextStepsContainerStyle}>
              <Text style={nextStepsLabelStyle}>Next steps</Text>
              <Section style={nextStepItemStyle}>
                <Text style={nextStepTextStyle}>
                  <span style={checkmarkStyle}>→</span> Share your profile with someone who knows
                  you well — ask them if it rings true
                </Text>
              </Section>
              <Section style={nextStepItemStyle}>
                <Text style={nextStepTextStyle}>
                  <span style={checkmarkStyle}>→</span> Take another assessment to deepen your
                  portrait
                </Text>
              </Section>
              <Section style={nextStepItemLastStyle}>
                <Text style={nextStepTextStyle}>
                  <span style={checkmarkStyle}>→</span> Start a journal entry connecting your
                  insights to your life
                </Text>
              </Section>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={profileUrl} style={buttonStyle}>
                View your portrait →
              </Button>
            </Section>

            <Text style={secondaryLinkTextStyle}>
              Or{' '}
              <Link href={assessmentUrl} style={secondaryLinkStyle}>
                take another assessment
              </Link>{' '}
              to add a new dimension to your portrait.
            </Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Your portrait is private and belongs to you. You can export or delete it at any time
              from your settings.
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

const nextStepsContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '32px',
  padding: '20px 24px',
}

const nextStepsLabelStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  margin: '0 0 16px',
  textTransform: 'uppercase',
}

const nextStepItemStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '12px',
  paddingBottom: '12px',
}

const nextStepItemLastStyle: React.CSSProperties = {
  marginBottom: '0',
}

const checkmarkStyle: React.CSSProperties = {
  color: '#0f0f0f',
  fontWeight: '700',
  marginRight: '8px',
}

const nextStepTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '20px',
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

const secondaryLinkTextStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '14px',
  margin: '0 0 32px',
}

const secondaryLinkStyle: React.CSSProperties = {
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

export default ProfileRevealEmail
