import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface GrowthRecommendation {
  title: string
  description: string
  category: string
  scoreBasis: string
  actionStep: string
}

interface WeeklyDigestEmailProps {
  userName?: string | null
  topRecommendation?: GrowthRecommendation | null
  daysSinceLastAssessment?: number | null
  synthesisSnippet?: string | null
  dashboardUrl: string
  date?: Date
  productName?: string
}

const CATEGORY_ICONS: Record<string, string> = {
  relationships: '◉',
  career: '◈',
  emotional: '◑',
  'self-awareness': '◎',
  wellbeing: '◆',
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function WeeklyDigestEmail({
  userName,
  topRecommendation,
  daysSinceLastAssessment,
  synthesisSnippet,
  dashboardUrl,
  date = new Date(),
  productName = 'Innermind',
}: WeeklyDigestEmailProps) {
  const greeting = userName ? `Hi ${userName}` : 'Hi there'
  const dateStr = formatDate(date)

  const assessmentMessage = (() => {
    if (daysSinceLastAssessment === null || daysSinceLastAssessment === undefined) return null
    if (daysSinceLastAssessment === 0) {
      return 'You completed an assessment today — great work staying engaged.'
    }
    if (daysSinceLastAssessment < 7) {
      return `You last completed an assessment ${daysSinceLastAssessment} day${daysSinceLastAssessment !== 1 ? 's' : ''} ago.`
    }
    if (daysSinceLastAssessment < 30) {
      return `It's been ${daysSinceLastAssessment} days since your last assessment. A fresh one might surface new patterns.`
    }
    return `It's been ${daysSinceLastAssessment} days since your last assessment. You may have grown in ways worth measuring.`
  })()

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Your {productName} week — {dateStr}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Row>
              <Column>
                <Text style={logoStyle}>{productName}</Text>
                <Text style={headerSubStyle}>Your weekly digest — {dateStr}</Text>
              </Column>
            </Row>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            {/* Greeting */}
            <Heading style={greetingStyle}>{greeting},</Heading>
            <Text style={introStyle}>
              Here&apos;s your personalized {productName} summary for the week.
            </Text>

            {/* This week's focus */}
            {topRecommendation && (
              <Section style={focusCardStyle}>
                <Text style={focusLabelStyle}>
                  {CATEGORY_ICONS[topRecommendation.category] ?? '◎'} This week&apos;s focus
                </Text>
                <Text style={focusTitleStyle}>{topRecommendation.title}</Text>
                <Text style={focusDescStyle}>{topRecommendation.description}</Text>
                <Section style={actionStepStyle}>
                  <Text style={actionStepTextStyle}>
                    <strong style={{ color: '#b45309' }}>Action step:</strong>{' '}
                    {topRecommendation.actionStep}
                  </Text>
                </Section>
              </Section>
            )}

            {/* Assessment nudge */}
            {assessmentMessage && (
              <Section style={sectionSpacingStyle}>
                <Text style={assessmentTextStyle}>{assessmentMessage}</Text>
              </Section>
            )}

            {/* Synthesis snippet */}
            {synthesisSnippet && (
              <Section style={sectionSpacingStyle}>
                <Text style={synthesisLabelStyle}>From your synthesis</Text>
                <Text style={synthesisTextStyle}>&ldquo;{synthesisSnippet}&rdquo;</Text>
              </Section>
            )}

            <Hr style={hrStyle} />

            {/* CTA */}
            <Section style={ctaSectionStyle}>
              <Button href={dashboardUrl} style={buttonStyle}>
                Open your dashboard →
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerTextStyle}>
              You&apos;re receiving this because you opted into the weekly digest.
              Visit your{' '}
              <a href={dashboardUrl} style={footerLinkStyle}>
                dashboard
              </a>{' '}
              to manage your email preferences.
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
  boxShadow: '0 1px 6px rgba(0, 0, 0, 0.06)',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  padding: '28px 36px',
}

const logoStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  margin: '0 0 5px',
}

const headerSubStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '12px',
  margin: '0',
}

const bodyContentStyle: React.CSSProperties = {
  padding: '36px 36px 12px',
}

const greetingStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '22px',
  fontWeight: '600',
  letterSpacing: '-0.3px',
  margin: '0 0 8px',
}

const introStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const focusCardStyle: React.CSSProperties = {
  backgroundColor: '#fefcf8',
  border: '1px solid #e8e4dc',
  borderRadius: '10px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const focusLabelStyle: React.CSSProperties = {
  color: '#b45309',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.8px',
  margin: '0 0 6px',
  textTransform: 'uppercase',
}

const focusTitleStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const focusDescStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const actionStepStyle: React.CSSProperties = {
  borderLeft: '3px solid #f59e0b',
  paddingLeft: '12px',
}

const actionStepTextStyle: React.CSSProperties = {
  color: '#444444',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
}

const sectionSpacingStyle: React.CSSProperties = {
  marginBottom: '24px',
}

const assessmentTextStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
}

const synthesisLabelStyle: React.CSSProperties = {
  color: '#78716c',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.8px',
  margin: '0 0 8px',
  textTransform: 'uppercase',
}

const synthesisTextStyle: React.CSSProperties = {
  color: '#555555',
  fontStyle: 'italic',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0',
}

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #f0ece4',
  margin: '8px 0 24px',
}

const ctaSectionStyle: React.CSSProperties = {
  marginBottom: '8px',
  textAlign: 'center',
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  borderRadius: '10px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '-0.1px',
  padding: '13px 28px',
  textDecoration: 'none',
}

const footerSectionStyle: React.CSSProperties = {
  borderTop: '1px solid #f0ece4',
  padding: '20px 36px 28px',
}

const footerTextStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center',
}

const footerLinkStyle: React.CSSProperties = {
  color: '#888888',
}

export default WeeklyDigestEmail
