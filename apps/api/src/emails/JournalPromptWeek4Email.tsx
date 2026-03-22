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

interface JournalPromptWeek4EmailProps {
  userName: string | null
  attachmentPattern: string
  journalPrompt: string
  profileUrl: string
}

export function JournalPromptWeek4Email({
  userName,
  attachmentPattern: attachmentPattern,
  journalPrompt,
  profileUrl,
}: JournalPromptWeek4EmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Week 4: The way you connect with others is a mirror for the relationship you have with
        yourself.
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Text style={seriesLabelStyle}>4-Week Journal Series · Week 4 of 4</Text>
            <Heading style={headingStyle}>Your relationship patterns</Heading>

            <Text style={greetingStyle}>{greeting}</Text>

            <Text style={bodyTextStyle}>
              Your attachment style and core values don&apos;t just shape how you feel inside —
              they quietly script the roles you play in every relationship you have. Your profile
              reflects a <strong>{attachmentPattern}</strong> pattern, a blueprint formed early and
              carried forward, often without you noticing it at work.
            </Text>

            <Text style={bodyTextStyle}>
              Understanding this pattern isn&apos;t about assigning blame or diagnosing yourself.
              It&apos;s about seeing the invisible architecture of your connections — so you can
              choose, more consciously, how you show up for the people who matter most to you.
            </Text>

            {/* Prompt card */}
            <Section style={promptCardStyle}>
              <Text style={promptLabelStyle}>This week&apos;s prompt</Text>
              <Text style={promptTextStyle}>{journalPrompt}</Text>
            </Section>

            <Hr style={hrStyle} />

            <Section style={buttonSectionStyle}>
              <Button href={profileUrl} style={buttonStyle}>
                Open your profile →
              </Button>
            </Section>

            <Text style={footerNoteStyle}>
              This is the final prompt in your 4-week series. Your reflections have built something
              real. Keep going.
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

const headerStyle: React.CSSProperties = { backgroundColor: '#0f0f0f', padding: '32px 40px' }

const logoStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  margin: '0 0 6px',
}

const taglineStyle: React.CSSProperties = { color: '#888888', fontSize: '13px', margin: '0' }

const bodyContentStyle: React.CSSProperties = { padding: '40px' }

const seriesLabelStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: '0 0 12px',
  textTransform: 'uppercase',
}

const headingStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '24px',
  fontWeight: '600',
  letterSpacing: '-0.3px',
  margin: '0 0 20px',
}

const greetingStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 12px',
}

const promptCardStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '10px',
  marginBottom: '28px',
  padding: '28px',
}

const promptLabelStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: '0 0 12px',
  textTransform: 'uppercase',
}

const promptTextStyle: React.CSSProperties = {
  color: '#f0ece4',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: '0',
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

const bodyTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px',
}

const footerStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
}

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #eeeeee',
  margin: '0 0 28px',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '28px',
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

const footerLinkStyle: React.CSSProperties = {
  color: '#aaaaaa',
}

export default JournalPromptWeek4Email
