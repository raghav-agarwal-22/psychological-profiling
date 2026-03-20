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

interface WeeklyGrowthChallengeEmailProps {
  userName: string | null
  archetypeName: string           // e.g. "The Sage"
  challengeTheme: string          // e.g. "Vulnerability"
  challengeText: string           // the full challenge copy
  profileUrl: string              // UTM-tagged link to their profile
  proFeatureTeaser: string        // e.g. "your shadow archetype integration" or "deeper values synthesis"
}

export function WeeklyGrowthChallengeEmail({
  userName,
  archetypeName,
  challengeTheme,
  challengeText,
  profileUrl,
  proFeatureTeaser,
}: WeeklyGrowthChallengeEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'

  return (
    <Html lang="en">
      <Head />
      <Preview>
        This week: one growth challenge built around how you think, connect, and move through the
        world.
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
            <Text style={weeklyLabelStyle}>Weekly Growth Challenge</Text>
            <Heading style={headingStyle}>Your {archetypeName} challenge</Heading>

            <Text style={greetingStyle}>{greeting}</Text>

            <Text style={bodyTextStyle}>
              {archetypeName}s are naturally strong at what you know. This week&apos;s challenge
              targets something different — a growth edge that tends to unlock new depth in{' '}
              {archetypeName.replace('The ', '').toLowerCase()}s who are ready for it.
            </Text>

            {/* Challenge card */}
            <Section style={challengeCardStyle}>
              <Text style={challengeThemeStyle}>{challengeTheme}</Text>
              <Text style={challengeTextStyle}>{challengeText}</Text>
            </Section>

            <Text style={bodyTextStyle}>
              Growth doesn&apos;t happen in the areas that already come naturally. It happens at the
              edges — the places that feel slightly uncomfortable, slightly unfamiliar.
            </Text>

            <Text style={bodyTextStyle}>
              If you try this, notice what comes up. Bring it back to your journal, your coach, or
              your next reflection session.
            </Text>

            <Hr style={hrStyle} />

            {/* Pro teaser */}
            <Section style={teaserCardStyle}>
              <Text style={teaserLabelStyle}>Unlock with Pro</Text>
              <Text style={teaserHeadingStyle}>Go deeper with {proFeatureTeaser}</Text>
              <Text style={teaserBodyStyle}>
                Your free portrait shows you the surface. Pro unlocks the layers underneath — shadow
                work, cross-framework tensions, and a complete picture of what drives you.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button href={profileUrl} style={buttonStyle}>
                See your full portrait →
              </Button>
            </Section>

            <Text style={footerNoteStyle}>
              Challenges are tailored to your archetype and rotate weekly. Take it at your own pace.
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

export default WeeklyGrowthChallengeEmail
