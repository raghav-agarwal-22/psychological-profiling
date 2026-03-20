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

interface DeepDiveNudgeEmailProps {
  userName: string | null
  deepDiveUrl: string
  profileUrl: string
}

export function DeepDiveNudgeEmail({ userName, deepDiveUrl, profileUrl }: DeepDiveNudgeEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>Go deeper — Innermind's AI has questions for you</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Ready to go deeper?</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              You've completed your first assessment. Now the real work begins. Innermind's adaptive
              AI generates personalized follow-up questions based on your unique profile — questions
              that cut to the heart of your patterns.
            </Text>

            {/* Feature highlight box */}
            <Section style={featureBoxStyle}>
              <Section style={featureItemStyle}>
                <Text style={featureLabelStyle}>Adaptive deep dive</Text>
                <Text style={featureDescStyle}>AI questions tailored to YOUR profile</Text>
              </Section>
              <Section style={featureItemStyle}>
                <Text style={featureLabelStyle}>Growth tracking</Text>
                <Text style={featureDescStyle}>Retake assessments and see how you change</Text>
              </Section>
              <Section style={featureItemLastStyle}>
                <Text style={featureLabelStyle}>Reflection journal</Text>
                <Text style={featureDescStyle}>Connect insights to real life moments</Text>
              </Section>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={deepDiveUrl} style={buttonStyle}>
                Start your deep dive →
              </Button>
            </Section>

            <Text style={secondaryLinkTextStyle}>
              Want to revisit your portrait first?{' '}
              <Link href={profileUrl} style={secondaryLinkStyle}>
                View your profile
              </Link>
            </Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Deep dive sessions typically take 10–20 minutes and unlock the most personal
              dimensions of your Innermind portrait.
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

const featureBoxStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '32px',
  padding: '20px 24px',
}

const featureItemStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '14px',
  paddingBottom: '14px',
}

const featureItemLastStyle: React.CSSProperties = {
  marginBottom: '0',
}

const featureLabelStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 2px',
}

const featureDescStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '13px',
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

export default DeepDiveNudgeEmail
