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

interface MilestoneShareEmailProps {
  userName: string | null
  archetypeName: string
  topTraits: string[]
  assessmentUrl: string
  profileUrl: string
}

export function MilestoneShareEmail({
  userName,
  archetypeName,
  topTraits,
  assessmentUrl,
  profileUrl,
}: MilestoneShareEmailProps) {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'
  const traitList = topTraits.slice(0, 3)

  return (
    <Html lang="en">
      <Head />
      <Preview>Your profile is live — here is what makes you unique</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Your profile is live.</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={bodyTextStyle}>
              You just shared your psychological portrait. As a <strong>{archetypeName}</strong>,
              here is what stands out most in your profile:
            </Text>

            {traitList.length > 0 && (
              <Section style={traitListStyle}>
                {traitList.map((trait, i) => (
                  <Section key={i} style={i < traitList.length - 1 ? traitRowStyle : traitRowLastStyle}>
                    <Text style={traitTextStyle}>
                      <span style={traitBulletStyle}>—</span> {trait}
                    </Text>
                  </Section>
                ))}
              </Section>
            )}

            <Text style={bodyTextStyle}>
              The people who understand you best will recognize these instantly. The ones who
              don&apos;t — this is how you introduce them to who you actually are.
            </Text>

            <Text style={bodyTextStyle}>
              Want to go deeper? Each additional assessment adds a new layer to your portrait.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={assessmentUrl} style={buttonStyle}>
                Explore more assessments →
              </Button>
            </Section>

            <Text style={secondaryLinkTextStyle}>
              Or{' '}
              <a href={profileUrl} style={inlineLinkStyle}>
                view your shared profile
              </a>{' '}
              to see what others see.
            </Text>

            <Hr style={hrStyle} />

            <Text style={footerNoteStyle}>
              You can make your profile private again any time from your account settings.
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

const traitListStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  marginBottom: '24px',
  padding: '20px 24px',
}

const traitRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #eeeeee',
  marginBottom: '12px',
  paddingBottom: '12px',
}

const traitRowLastStyle: React.CSSProperties = {}

const traitBulletStyle: React.CSSProperties = {
  color: '#aaaaaa',
  marginRight: '8px',
}

const traitTextStyle: React.CSSProperties = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '1.5',
  margin: '0',
}

const buttonSectionStyle: React.CSSProperties = {
  marginBottom: '16px',
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

const secondaryLinkTextStyle: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  margin: '0 0 28px',
}

const inlineLinkStyle: React.CSSProperties = {
  color: '#555555',
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

export default MilestoneShareEmail
