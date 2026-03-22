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

interface JournalPromptWeek2EmailProps {
  userName: string | null
  profileUrl: string
  shadowAspect: string   // e.g. "a strong need for control that you typically mask as helpfulness"
  journalPrompt: string  // e.g. "When was the last time someone called you controlling — or when did you feel that urge but suppress it? What was underneath it?"
}

export function JournalPromptWeek2Email({
  userName,
  profileUrl,
  shadowAspect,
  journalPrompt,
}: JournalPromptWeek2EmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Week 2 of your journal series: meeting the parts of yourself you&apos;ve pushed out of sight.
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
            <Text style={weeklyLabelStyle}>Journal Prompt — Week 2 of 4</Text>
            <Heading style={headingStyle}>Shadow Work</Heading>

            <Text style={greetingStyle}>{greeting}</Text>

            <Text style={bodyTextStyle}>
              Jung called it the shadow — not the dark side of your personality, but the
              disowned side. The qualities you learned weren&apos;t acceptable, so you buried
              them. They didn&apos;t disappear. They went underground.
            </Text>

            <Text style={bodyTextStyle}>
              Shadow work isn&apos;t about fixing yourself. It&apos;s about retrieving the parts of
              you that got left behind — because they hold energy, creativity, and honesty you
              can&apos;t fully access while they&apos;re hidden.
            </Text>

            <Text style={bodyTextStyle}>
              Your profile points to something specific worth exploring:
            </Text>

            {/* Shadow aspect card */}
            <Section style={challengeCardStyle}>
              <Text style={challengeThemeStyle}>Your shadow aspect</Text>
              <Text style={challengeTextStyle}>{shadowAspect}</Text>
            </Section>

            <Text style={bodyTextStyle}>
              Notice your first reaction to reading that. Defensiveness, recognition, discomfort —
              whatever it is, that reaction is data. This week&apos;s prompt asks you to go one
              layer deeper.
            </Text>

            {/* Journal prompt card */}
            <Section style={promptCardStyle}>
              <Text style={promptLabelStyle}>This week, write about</Text>
              <Text style={promptTextStyle}>{journalPrompt}</Text>
            </Section>

            <Text style={bodyTextStyle}>
              Write toward the discomfort, not away from it. The shadow doesn&apos;t need to be
              conquered — it needs to be met. Even ten minutes of honest writing can shift
              something that&apos;s been stuck for years.
            </Text>

            <Hr style={hrStyle} />

            {/* Pro teaser */}
            <Section style={teaserCardStyle}>
              <Text style={teaserLabelStyle}>Pro feature</Text>
              <Text style={teaserHeadingStyle}>Your full shadow map across every framework</Text>
              <Text style={teaserBodyStyle}>
                Pro unlocks your complete shadow integration analysis — how your disowned traits
                show up differently across your Big Five, Enneagram, and attachment patterns,
                and what integrating them actually looks like for your specific profile.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={profileUrl} style={buttonStyle}>
                Open your full portrait →
              </Button>
            </Section>

            <Text style={footerNoteStyle}>
              This is week 2 of a 4-week journal series. Week 3 arrives in 7 days.
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

const weeklyLabelStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  margin: '0 0 8px',
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

const bodyTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px',
}

const challengeCardStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '10px',
  marginBottom: '28px',
  padding: '28px',
}

const challengeThemeStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: '0 0 12px',
  textTransform: 'uppercase',
}

const challengeTextStyle: React.CSSProperties = {
  color: '#f0ece4',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: '0',
}

const promptCardStyle: React.CSSProperties = {
  backgroundColor: '#f8f6f2',
  borderRadius: '10px',
  marginBottom: '28px',
  padding: '28px',
}

const promptLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: '0 0 12px',
  textTransform: 'uppercase',
}

const promptTextStyle: React.CSSProperties = {
  color: '#222222',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '1.65',
  margin: '0',
}

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #eeeeee',
  margin: '0 0 28px',
}

const teaserCardStyle: React.CSSProperties = {
  backgroundColor: '#f8f6f2',
  borderRadius: '10px',
  marginBottom: '28px',
  padding: '24px 28px',
}

const teaserLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 6px',
  textTransform: 'uppercase',
}

const teaserHeadingStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '16px',
  fontWeight: '600',
  letterSpacing: '-0.2px',
  margin: '0 0 10px',
}

const teaserBodyStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '14px',
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

export default JournalPromptWeek2Email
