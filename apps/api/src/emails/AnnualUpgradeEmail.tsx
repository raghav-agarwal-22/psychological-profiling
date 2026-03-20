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

interface AnnualUpgradeEmailProps {
  userName: string | null
  upgradeUrl: string
  daysSinceSubscribed: number
  monthlySavings: string
  annualPrice: string
  monthlyPrice: string
}

export function AnnualUpgradeEmail({
  userName,
  upgradeUrl,
  daysSinceSubscribed,
  monthlySavings,
  annualPrice,
  monthlyPrice,
}: AnnualUpgradeEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  const headlineByDay =
    daysSinceSubscribed <= 14
      ? 'Lock in your rate for a year — save 2 months'
      : daysSinceSubscribed <= 21
        ? 'You\'re 3 weeks in. Ready to lock in and save?'
        : 'Last reminder: switch to annual and save 2 months free'

  const subheadByDay =
    daysSinceSubscribed <= 14
      ? `You've been on Innermind for ${daysSinceSubscribed} days. Most people who switch to annual do it now — before they forget.`
      : daysSinceSubscribed <= 21
        ? `Three weeks of self-discovery down. Switching to annual saves you ${monthlySavings}/year — and locks in your current rate.`
        : `This is the last time we'll mention it. Switch to annual now and get 2 months free. After this, the offer stays but the reminder stops.`

  return (
    <Html lang="en">
      <Head />
      <Preview>{headlineByDay}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          {/* Savings badge */}
          <Section style={badgeSectionStyle}>
            <Text style={badgeTextStyle}>Save 2 months — ${monthlySavings}/year</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>{headlineByDay}</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>{subheadByDay}</Text>

            {/* Pricing comparison */}
            <Section style={comparisonStyle}>
              <Section style={planRowStyle}>
                <Text style={planLabelStyle}>Monthly</Text>
                <Text style={planPriceStyle}>{monthlyPrice}/mo</Text>
              </Section>
              <Section style={planDividerStyle} />
              <Section style={planRowBestStyle}>
                <Text style={planLabelBestStyle}>Annual <span style={bestValueBadgeStyle}>Best value</span></Text>
                <Text style={planPriceBestStyle}>{annualPrice}/mo <Text style={planSavingStyle}>2 months free</Text></Text>
              </Section>
            </Section>

            {/* What you keep */}
            <Text style={bodyTextStyle}>Switching to annual means:</Text>
            <Section style={featureListStyle}>
              <Text style={featureTextStyle}><span style={checkStyle}>✓</span> Everything you have now, same experience</Text>
              <Text style={featureTextStyle}><span style={checkStyle}>✓</span> Lock in your current rate — no price increases</Text>
              <Text style={featureTextStyle}><span style={checkStyle}>✓</span> 2 months free — equivalent to {monthlySavings} back in your pocket</Text>
              <Text style={featureTextStyle}><span style={checkStyle}>✓</span> Better cash flow for us means more features for you</Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={upgradeUrl} style={buttonStyle}>
                Switch to annual →
              </Button>
            </Section>

            <Text style={subNoteStyle}>
              Billed as one payment of {annualPrice} × 12. Cancel anytime — we'll prorate the remainder.
            </Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              Prefer to stay monthly?{' '}
              <Link href="#" style={stayLinkStyle}>
                No problem — nothing changes.
              </Link>
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

const badgeSectionStyle: React.CSSProperties = {
  backgroundColor: '#f0faf0',
  padding: '10px 40px',
  borderBottom: '1px solid #e0f0e0',
}

const badgeTextStyle: React.CSSProperties = {
  color: '#1a7a3a',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'center',
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

const comparisonStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '10px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const planRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
  paddingBottom: '12px',
}

const planDividerStyle: React.CSSProperties = {
  borderTop: '1px solid #eeeeee',
  margin: '0 0 12px',
}

const planRowBestStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
}

const planLabelStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '14px',
  margin: '0',
}

const planPriceStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '14px',
  margin: '0',
  textDecoration: 'line-through',
}

const planLabelBestStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0',
}

const bestValueBadgeStyle: React.CSSProperties = {
  backgroundColor: '#111111',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '10px',
  fontWeight: '600',
  marginLeft: '8px',
  padding: '2px 6px',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
}

const planPriceBestStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0',
}

const planSavingStyle: React.CSSProperties = {
  color: '#1a7a3a',
  fontSize: '12px',
  fontWeight: '400',
  display: 'block',
  marginTop: '2px',
}

const featureListStyle: React.CSSProperties = {
  marginBottom: '28px',
}

const checkStyle: React.CSSProperties = {
  color: '#0f0f0f',
  fontWeight: '700',
  marginRight: '8px',
}

const featureTextStyle: React.CSSProperties = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 8px',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '12px',
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

const subNoteStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 32px',
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

const stayLinkStyle: React.CSSProperties = {
  color: '#888888',
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

export default AnnualUpgradeEmail
