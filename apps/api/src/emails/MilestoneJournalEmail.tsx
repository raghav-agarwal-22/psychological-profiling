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

interface MilestoneJournalEmailProps {
  userName: string | null
  archetypeName: string
  insightsUrl: string
}

export function MilestoneJournalEmail({
  userName,
  archetypeName,
  insightsUrl,
}: MilestoneJournalEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>You have been reflecting — here is what we noticed</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>You have been reflecting.</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              You just wrote your third journal entry. That is not a small thing — most people
              never make it past one.
            </Text>
            <Text style={bodyTextStyle}>
              As a <strong>{archetypeName}</strong>, the act of reflection is how you integrate
              experience. Your profile is getting richer with every entry you write.
            </Text>

            <Section style={calloutStyle}>
              <Text style={calloutTextStyle}>
                Your growth chart tracks how your self-awareness has evolved across assessments.
                Three entries in, you now have enough signal to see a pattern.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={insightsUrl} style={buttonStyle}>
                See your growth chart →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Keep writing. The best insights come after the tenth entry.
            </Text>
          </Section>

          <Section style={footerSectionStyle}>
            <Text style={footerStyle}>
              &copy; 2025 Innermind. All rights reserved.{' '}
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
  borderLeft: '3px solid #0f0f0f',
  borderRadius: '4px',
  marginBottom: '28px',
  padding: '16px 20px',
}

const calloutTextStyle: React.CSSProperties = {
  color: '#444444',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.6',
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

export default MilestoneJournalEmail
