import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface DimensionScore {
  normalized: number
  raw: number
  responseCount: number
}

interface Profile {
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
  strengths?: string[]
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
  achievement: 'Achievement',
  benevolence: 'Benevolence',
  self_direction: 'Self-Direction',
  stimulation: 'Stimulation',
  universalism: 'Universalism',
}

async function fetchProfile(shareToken: string): Promise<Profile | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(`${apiUrl}/api/share/${shareToken}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data.profile as Profile) ?? null
  } catch {
    return null
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { shareToken: string } },
) {
  const profile = await fetchProfile(params.shareToken)

  const archetype = profile?.archetypes?.[0] ?? 'Psychological Profile'

  const topDimensions = profile
    ? Object.entries(profile.dimensions)
        .map(([key, score]) => ({
          key,
          label: DIMENSION_LABELS[key.toLowerCase()] ?? key,
          value: typeof score === 'object' ? score.normalized : Number(score),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    : []

  const strengths = profile?.strengths?.slice(0, 3) ?? []

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1920px',
          backgroundColor: '#1c1917',
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Background glow top */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Background glow bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '100px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            ◎
          </div>
          <span style={{ fontSize: '24px', color: '#a8a29e', letterSpacing: '0.05em', fontFamily: 'sans-serif', fontWeight: 500 }}>
            innermind
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: '13px',
            fontFamily: 'sans-serif',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#f59e0b',
            marginBottom: '24px',
          }}
        >
          I am
        </div>

        {/* Archetype name */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 700,
            color: '#f5f5f4',
            lineHeight: 1.05,
            marginBottom: '40px',
          }}
        >
          {archetype}
        </div>

        {/* Divider */}
        <div style={{ width: '80px', height: '3px', backgroundColor: '#f59e0b', marginBottom: '40px', borderRadius: '2px' }} />

        {/* Summary */}
        {profile?.summary && (
          <div
            style={{
              fontSize: '22px',
              fontFamily: 'sans-serif',
              color: '#a8a29e',
              lineHeight: 1.6,
              marginBottom: '80px',
              maxWidth: '900px',
            }}
          >
            {profile.summary.split(/[.!?]/)[0]?.trim() ?? profile.summary}.
          </div>
        )}

        {/* Top traits */}
        {topDimensions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '80px' }}>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'sans-serif',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#57534e',
                marginBottom: '8px',
              }}
            >
              Top Traits
            </div>
            {topDimensions.map(({ key, label, value }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontFamily: 'sans-serif', color: '#d6d3d1', fontWeight: 500 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: '20px', fontFamily: 'sans-serif', color: '#f59e0b', fontWeight: 700 }}>
                    {value}%
                  </span>
                </div>
                <div
                  style={{
                    height: '10px',
                    width: '100%',
                    backgroundColor: '#292524',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '10px',
                      width: `${value}%`,
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Strengths */}
        {strengths.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'sans-serif',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#57534e',
                marginBottom: '8px',
              }}
            >
              Strengths
            </div>
            {strengths.map((strength, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 24px',
                  backgroundColor: 'rgba(245,158,11,0.05)',
                  border: '1px solid rgba(245,158,11,0.12)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', flexShrink: 0 }} />
                <span style={{ fontSize: '18px', fontFamily: 'sans-serif', color: '#a8a29e' }}>{strength}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '40px',
            borderTop: '1px solid #292524',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '18px', fontFamily: 'sans-serif', color: '#44403c' }}>innermindhealing.com</span>
          <span style={{ fontSize: '16px', fontFamily: 'sans-serif', color: '#44403c' }}>
            Discover your archetype
          </span>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 },
  )
}
