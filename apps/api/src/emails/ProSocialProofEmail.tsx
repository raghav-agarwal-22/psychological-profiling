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

interface ProSocialProofEmailProps {
  userName: string | null
  archetypeName: string | null
  dashboardUrl: string
  assessmentsUrl: string
}

export function ProSocialProofEmail({
  userName,
  archetypeName,
  dashboardUrl,
  assessmentsUrl,
}: ProSocialProofEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'
  const archetype = archetypeName ?? 'your archetype'

  return (
    <Html lang="en">
      <Head />
      <Preview>What Pro members with your profile discovered — and what it unlocked</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>What people like you discovered in week one</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              As a <strong>{archetype}</strong>, you share a psychological profile with a specific
              cluster of Innermind Pro members. Here's what that group tends to discover — and what
              shifts when they do.
            </Text>

            {/* Testimonials */}
            <Section style={testimonialContainerStyle}>
              <Section style={testimonialRowStyle}>
                <Text style={testimonialTextStyle}>
                  &ldquo;I'd been in therapy for 2 years and never understood why I always pulled
                  away when relationships got close. My attachment style result explained it in 5
                  minutes. The AI coach helped me trace it back to specific patterns.&rdquo;
                </Text>
                <Text style={testimonialAttributionStyle}>— Pro member, 6 weeks in</Text>
              </Section>

              <Section style={testimonialRowStyle}>
                <Text style={testimonialTextStyle}>
                  &ldquo;The synthesis found the contradiction between my Big Five scores and my
                  values assessment that I'd never consciously noticed. That tension is exactly
                  why I've been stuck.&rdquo;
                </Text>
                <Text style={testimonialAttributionStyle}>— Pro member, 3 weeks in</Text>
              </Section>

              <Section style={testimonialRowLastStyle}>
                <Text style={testimonialTextStyle}>
                  &ldquo;I shared my profile with my partner and we finally had the conversation
                  we'd been avoiding for months. Seeing it as data instead of blame changed
                  everything.&rdquo;
                </Text>
                <Text style={testimonialAttributionStyle}>— Pro member, 2 months in</Text>
              </Section>
            </Section>

            {/* Feature highlight */}
            <Section style={featureHighlightStyle}>
              <Text style={featureLabelStyle}>MOST USED THIS WEEK</Text>
              <Text style={featureTitleStyle}>Attachment Style Integration</Text>
              <Text style={featureDescStyle}>
                Pro members are running their attachment style results through the AI coach and
                asking: <em>"How does this show up in my closest relationships?"</em> The answers
                tend to be uncomfortably specific.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={assessmentsUrl} style={buttonStyle}>
                Try the attachment style assessment →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              In 9 days: a nudge to revisit your profile — because your psychology evolves and your
              portrait should too.{' '}
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

const testimonialContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const testimonialRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '16px',
  paddingBottom: '16px',
}

const testimonialRowLastStyle: React.CSSProperties = {}

const testimonialTextStyle: React.CSSProperties = {
  color: '#555555',
  fontStyle: 'italic',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 6px',
}

const testimonialAttributionStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  margin: '0',
}

const featureHighlightStyle: React.CSSProperties = {
  borderLeft: '3px solid #dddddd',
  marginBottom: '32px',
  paddingLeft: '16px',
}

const featureLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 4px',
  textTransform: 'uppercase',
}

const featureTitleStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 6px',
}

const featureDescStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
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

export default ProSocialProofEmail
