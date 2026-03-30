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

interface WaitlistSocialProofEmailProps {
  startUrl: string
  foundingPriceDeadline?: string
}

export function WaitlistSocialProofEmail({
  startUrl,
  foundingPriceDeadline,
}: WaitlistSocialProofEmailProps) {
  const deadline = foundingPriceDeadline ?? 'the window closes soon'

  return (
    <Html lang="en">
      <Head />
      <Preview>Others are discovering surprising things about themselves</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>What people are finding out about themselves</Heading>

            <Text style={bodyTextStyle}>
              We've been reading the responses from early users. A few that stayed with us:
            </Text>

            <Section style={quoteBlockStyle}>
              <Text style={quoteTextStyle}>
                "I've taken the MBTI probably 20 times. Innermind gave me something I'd never
                seen before — the connection between my Enneagram 4 and my attachment anxieties
                finally made sense."
              </Text>
            </Section>

            <Section style={quoteBlockStyle}>
              <Text style={quoteTextStyle}>
                "The AI portrait was uncomfortably accurate. It named patterns I knew existed
                but had never articulated."
              </Text>
            </Section>

            <Section style={quoteBlockStyle}>
              <Text style={quoteTextStyle}>
                "I expected another personality test. I got something closer to a therapy session."
              </Text>
            </Section>

            <Text style={bodyTextStyle}>
              These aren't edge cases. The synthesis is accurate because it doesn't reduce you
              to a single type — it looks at five dimensions simultaneously.
            </Text>

            <Hr style={hrStyle} />

            <Section style={urgencyBlockStyle}>
              <Text style={urgencyTextStyle}>
                We're offering founding member pricing to our first 500 users — {deadline}. After
                that, it's standard pricing.
              </Text>
            </Section>

            <Section style={buttonSectionStyle}>
              <Button style={buttonStyle} href={startUrl}>
                Get founding member access
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerTextStyle}>
              You're receiving this because you joined the Innermind waitlist.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#0c0a09',
  fontFamily: "'Georgia', serif",
  margin: 0,
  padding: 0,
}

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#1c1917',
  borderRadius: '12px',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  backgroundColor: '#0c0a09',
  padding: '32px 40px 24px',
  borderBottom: '1px solid #292524',
}

const logoStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#e7e5e4',
  margin: 0,
  letterSpacing: '-0.3px',
}

const taglineStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#78716c',
  margin: '4px 0 0',
}

const bodyContentStyle: React.CSSProperties = {
  padding: '36px 40px 40px',
}

const headingStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '600',
  color: '#e7e5e4',
  margin: '0 0 20px',
  lineHeight: '1.3',
}

const bodyTextStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#a8a29e',
  lineHeight: '1.7',
  margin: '0 0 16px',
}

const quoteBlockStyle: React.CSSProperties = {
  borderLeft: '3px solid #78716c',
  paddingLeft: '20px',
  margin: '0 0 20px',
}

const quoteTextStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#a8a29e',
  lineHeight: '1.7',
  fontStyle: 'italic',
  margin: 0,
}

const urgencyBlockStyle: React.CSSProperties = {
  margin: '4px 0 0',
}

const urgencyTextStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#e7e5e4',
  lineHeight: '1.7',
  margin: '0 0 4px',
}

const buttonSectionStyle: React.CSSProperties = {
  margin: '28px 0',
  textAlign: 'center' as const,
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#e7e5e4',
  color: '#0c0a09',
  padding: '13px 28px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
}

const hrStyle: React.CSSProperties = {
  borderColor: '#292524',
  margin: '24px 0',
}

const footerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#57534e',
  lineHeight: '1.6',
  margin: 0,
}
