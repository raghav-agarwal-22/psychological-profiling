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

interface MonthlyInsightEmailProps {
  userName: string | null
  monthLabel: string // e.g. "March"
  archetypeName: string
  aiInsight: string // 2-3 sentence AI-generated insight
  growthTip: string // one actionable growth recommendation
  insightsUrl: string
}

export function MonthlyInsightEmail({
  userName,
  monthLabel,
  archetypeName,
  aiInsight,
  growthTip,
  insightsUrl,
}: MonthlyInsightEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>{monthLabel} growth insight — {archetypeName}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Text style={monthBadgeStyle}>{monthLabel.toUpperCase()}</Text>
            <Heading style={headingStyle}>Your growth insight</Heading>
            <Text style={greetingStyle}>{greeting}</Text>

            {/* AI insight */}
            <Section style={insightBoxStyle}>
              <Text style={insightLabelStyle}>This month's insight</Text>
              <Text style={insightTextStyle}>{aiInsight}</Text>
            </Section>

            {/* Growth tip */}
            <Text style={sectionLabelStyle}>One thing to try</Text>
            <Section style={tipBoxStyle}>
              <Text style={tipTextStyle}>{growthTip}</Text>
            </Section>

            <Text style={bodyTextStyle}>
              Your portrait evolves as you do. Retake any assessment to see how your scores have
              shifted — and whether your archetype has changed.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={insightsUrl} style={buttonStyle}>
                Continue your journey →
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Generated from your {archetypeName} archetype and assessment scores.
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

const monthBadgeStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '2px',
  margin: '0 0 8px',
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
  margin: '0 0 24px',
}

const bodyTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const insightBoxStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '10px',
  marginBottom: '24px',
  padding: '24px',
}

const insightLabelStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '1.5px',
  margin: '0 0 10px',
  textTransform: 'uppercase' as const,
}

const insightTextStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0',
}

const sectionLabelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '1.5px',
  margin: '0 0 10px',
  textTransform: 'uppercase' as const,
}

const tipBoxStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderLeft: '3px solid #555555',
  borderRadius: '4px',
  marginBottom: '24px',
  padding: '16px 20px',
}

const tipTextStyle: React.CSSProperties = {
  color: '#333333',
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

export default MonthlyInsightEmail
