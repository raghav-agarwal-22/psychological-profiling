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

interface Day1ArchetypeEmailProps {
  userName: string | null
  archetypeName: string
  archetypeTagline: string
  archetypeDescription: string
  topTrait: string
  profileUrl: string
}

export function Day1ArchetypeEmail({
  userName,
  archetypeName,
  archetypeTagline,
  archetypeDescription,
  topTrait,
  profileUrl,
}: Day1ArchetypeEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>Your archetype is {archetypeName} — here's what that really means</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>You are the {archetypeName}</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              Yesterday you completed your first assessment. Your dominant Jungian archetype is{' '}
              <strong>{archetypeName}</strong> — {archetypeTagline}.
            </Text>

            {/* Archetype highlight card */}
            <Section style={archetypeCardStyle}>
              <Text style={archetypeNameStyle}>{archetypeName}</Text>
              <Text style={archetypeTaglineStyle}>{archetypeTagline}</Text>
              <Text style={archetypeDescStyle}>{archetypeDescription}</Text>
            </Section>

            <Text style={bodyTextStyle}>
              Your top Big Five trait — <strong>{topTrait}</strong> — shapes how this archetype
              expresses itself in your life. It&apos;s not just a type. It&apos;s a lens for
              understanding the choices you make, the relationships you form, and the tensions you
              feel.
            </Text>

            <Text style={bodyTextStyle}>
              Over the next few days, we&apos;ll show you what the other 4 frameworks reveal when
              layered on top of this.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={profileUrl} style={buttonStyle}>
                Explore your full portrait →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Complete all 5 frameworks to unlock your AI-synthesized psychological portrait.
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

const archetypeCardStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '10px',
  marginBottom: '28px',
  padding: '24px 28px',
}

const archetypeNameStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  margin: '0 0 4px',
}

const archetypeTaglineStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  margin: '0 0 16px',
}

const archetypeDescStyle: React.CSSProperties = {
  color: '#cccccc',
  fontSize: '14px',
  lineHeight: '1.65',
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

const footerLinkStyle: React.CSSProperties = {
  color: '#aaaaaa',
}

export default Day1ArchetypeEmail
