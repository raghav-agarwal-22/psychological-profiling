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

interface ProReEngagementEmailProps {
  userName: string | null
  archetypeName: string | null
  dashboardUrl: string
  assessmentsUrl: string
}

export function ProReEngagementEmail({
  userName,
  archetypeName,
  dashboardUrl,
  assessmentsUrl,
}: ProReEngagementEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'
  const archetype = archetypeName ?? 'your archetype'

  return (
    <Html lang="en">
      <Head />
      <Preview>Your profile evolves — here's why retaking your assessments matters</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Two weeks in — your profile should be evolving</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              Psychology isn't static. Your Big Five scores, attachment patterns, and archetype
              expression all shift in response to new experiences, relationships, and growth work.
            </Text>
            <Text style={bodyTextStyle}>
              Most people who retake their assessments after 2 weeks find at least one dimension
              that's moved. That movement tells you something.
            </Text>

            {/* Why it matters */}
            <Section style={reasonContainerStyle}>
              <Text style={sectionLabelStyle}>WHY RETAKING MATTERS</Text>

              <Section style={reasonRowStyle}>
                <Text style={reasonIconStyle}>→</Text>
                <Section style={reasonContentStyle}>
                  <Text style={reasonTitleStyle}>Your synthesis gets sharper</Text>
                  <Text style={reasonDescStyle}>
                    Each additional data point helps the AI identify patterns that weren't visible
                    from a single snapshot. The synthesis accuracy improves with every retake.
                  </Text>
                </Section>
              </Section>

              <Section style={reasonRowStyle}>
                <Text style={reasonIconStyle}>→</Text>
                <Section style={reasonContentStyle}>
                  <Text style={reasonTitleStyle}>You can track what's actually changing</Text>
                  <Text style={reasonDescStyle}>
                    Pro gives you a historical view of your scores. If you've been doing growth
                    work — therapy, journaling, intentional practice — the numbers will reflect it.
                  </Text>
                </Section>
              </Section>

              <Section style={reasonRowLastStyle}>
                <Text style={reasonIconStyle}>→</Text>
                <Section style={reasonContentStyle}>
                  <Text style={reasonTitleStyle}>Your coach gets more accurate</Text>
                  <Text style={reasonDescStyle}>
                    The AI coach references your most recent assessments. Fresher data means
                    more relevant coaching. Especially for <strong>{archetype}</strong> types,
                    who tend to evolve quickly once they start paying attention.
                  </Text>
                </Section>
              </Section>
            </Section>

            {/* Challenge */}
            <Section style={challengeBoxStyle}>
              <Text style={challengeLabelStyle}>THIS WEEK'S CHALLENGE</Text>
              <Text style={challengeTextStyle}>
                Retake the Big Five. Then open your AI coach and ask:{' '}
                <em>"What has changed about me in the last two weeks?"</em>
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={assessmentsUrl} style={buttonStyle}>
                Retake your assessment →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Your Pro subscription gives you unlimited retakes.{' '}
              <a href={dashboardUrl} style={dashboardLinkStyle}>
                Open your dashboard
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
  margin: '0 0 16px',
}

const sectionLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 16px',
  textTransform: 'uppercase',
}

const reasonContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '24px',
  marginTop: '12px',
  padding: '20px 24px',
}

const reasonRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  display: 'flex',
  gap: '12px',
  marginBottom: '16px',
  paddingBottom: '16px',
}

const reasonRowLastStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
}

const reasonIconStyle: React.CSSProperties = {
  color: '#0f0f0f',
  flexShrink: 0,
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
}

const reasonContentStyle: React.CSSProperties = {
  flex: 1,
}

const reasonTitleStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const reasonDescStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
}

const challengeBoxStyle: React.CSSProperties = {
  borderLeft: '3px solid #dddddd',
  marginBottom: '32px',
  paddingLeft: '16px',
}

const challengeLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 6px',
  textTransform: 'uppercase',
}

const challengeTextStyle: React.CSSProperties = {
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

export default ProReEngagementEmail
