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

interface WaitlistFeatureHighlightEmailProps {
  startUrl: string
}

export function WaitlistFeatureHighlightEmail({
  startUrl,
}: WaitlistFeatureHighlightEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>What your psychological profile actually reveals</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>Innermind</Text>
            <Text style={taglineStyle}>Understand yourself deeply.</Text>
          </Section>

          <Section style={bodyContentStyle}>
            <Heading style={headingStyle}>Five frameworks. One coherent portrait.</Heading>

            <Text style={bodyTextStyle}>
              Most personality tools give you one lens. A type. A score. A category. Innermind
              synthesizes five distinct frameworks — each measuring something the others can't.
            </Text>

            <Section style={frameworkListStyle}>
              <Text style={frameworkItemStyle}>
                <Text style={frameworkLabelStyle}>Big Five</Text>
                {' '}
                <Text style={frameworkDescStyle}>The "what" of your personality — your observable traits and behavioral tendencies.</Text>
              </Text>
              <Text style={frameworkItemStyle}>
                <Text style={frameworkLabelStyle}>Enneagram</Text>
                {' '}
                <Text style={frameworkDescStyle}>Your core motivations and fears — the deeper "why" beneath the behavior.</Text>
              </Text>
              <Text style={frameworkItemStyle}>
                <Text style={frameworkLabelStyle}>Attachment Style</Text>
                {' '}
                <Text style={frameworkDescStyle}>How you pattern your relationships — security, anxiety, and connection.</Text>
              </Text>
              <Text style={frameworkItemStyle}>
                <Text style={frameworkLabelStyle}>Jungian Archetypes</Text>
                {' '}
                <Text style={frameworkDescStyle}>The roles you unconsciously inhabit — the stories your psyche tells about itself.</Text>
              </Text>
              <Text style={frameworkItemStyle}>
                <Text style={frameworkLabelStyle}>Schwartz Values</Text>
                {' '}
                <Text style={frameworkDescStyle}>What you're actually optimizing for in life — not what you say you value, but what your choices reveal.</Text>
              </Text>
            </Section>

            <Text style={bodyTextStyle}>
              The AI doesn't just report scores. It weaves them into a single narrative — your
              psychology as a coherent story, not a list of test results.
            </Text>

            <Hr style={hrStyle} />

            <Section style={featureBlockStyle}>
              <Text style={featureTitleStyle}>Growth tracking</Text>
              <Text style={bodyTextStyle}>
                Retake any assessment after 3 months. See what changed. Track your development
                over time with actual measurements, not guesses.
              </Text>
            </Section>

            <Hr style={hrStyle} />

            <Section style={featureBlockStyle}>
              <Text style={featureTitleStyle}>AI deep-dive</Text>
              <Text style={bodyTextStyle}>
                After your profile, Claude generates personalized follow-up questions based on
                your specific results — and has a real conversation with you about what they mean.
              </Text>
            </Section>

            <Hr style={hrStyle} />

            <Section style={buttonSectionStyle}>
              <Button style={buttonStyle} href={startUrl}>
                See what your profile reveals
              </Button>
            </Section>

            <Text style={psTextStyle}>
              PS — The synthesis takes about 15 minutes from first assessment to full portrait.
            </Text>

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

const frameworkListStyle: React.CSSProperties = {
  margin: '20px 0 24px',
  paddingLeft: '0',
}

const frameworkItemStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#a8a29e',
  lineHeight: '1.6',
  margin: '0 0 12px',
  paddingLeft: '16px',
  borderLeft: '2px solid #292524',
}

const frameworkLabelStyle: React.CSSProperties = {
  display: 'inline',
  fontSize: '15px',
  fontWeight: '600',
  color: '#e7e5e4',
  margin: 0,
}

const frameworkDescStyle: React.CSSProperties = {
  display: 'inline',
  fontSize: '15px',
  color: '#a8a29e',
  margin: 0,
}

const featureBlockStyle: React.CSSProperties = {
  margin: '4px 0',
}

const featureTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#e7e5e4',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  margin: '0 0 10px',
}

const buttonSectionStyle: React.CSSProperties = {
  margin: '28px 0 20px',
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

const psTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#78716c',
  lineHeight: '1.6',
  margin: '16px 0 0',
  fontStyle: 'italic',
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
