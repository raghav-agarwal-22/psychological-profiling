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

interface MagicLinkEmailProps {
  magicLinkUrl: string
  productName?: string
  tagline?: string
}

export function MagicLinkEmail({
  magicLinkUrl,
  productName = 'Innermind',
  tagline = 'Understand yourself deeply.',
}: MagicLinkEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your {productName} sign-in link — expires in 15 minutes</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>{productName}</Text>
            <Text style={taglineStyle}>{tagline}</Text>
          </Section>

          {/* Body */}
          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Sign in to {productName}</Heading>
            <Text style={bodyTextStyle}>
              Click the button below to sign in. This link expires in{' '}
              <strong>15 minutes</strong> and can only be used once.
            </Text>

            <Section style={buttonSectionStyle}>
              <Button href={magicLinkUrl} style={buttonStyle}>
                Sign in to {productName} →
              </Button>
            </Section>

            <Text style={fallbackLabelStyle}>
              Or copy and paste this URL into your browser:
            </Text>
            <Link href={magicLinkUrl} style={fallbackLinkStyle}>
              {magicLinkUrl}
            </Link>

            <Hr style={hrStyle} />

            <Text style={footerTextStyle}>
              If you didn&apos;t request this email, you can safely ignore it. Someone may
              have typed your email address by mistake.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerStyle}>
              &copy; {new Date().getFullYear()} {productName}. All rights reserved.
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
  fontSize: '24px',
  fontWeight: '600',
  letterSpacing: '-0.3px',
  margin: '0 0 12px',
}

const bodyTextStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 32px',
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

const fallbackLabelStyle: React.CSSProperties = {
  color: '#999999',
  fontSize: '13px',
  margin: '0 0 6px',
}

const fallbackLinkStyle: React.CSSProperties = {
  color: '#555555',
  fontSize: '13px',
  wordBreak: 'break-all',
}

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #eeeeee',
  margin: '32px 0',
}

const footerTextStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
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

export default MagicLinkEmail
