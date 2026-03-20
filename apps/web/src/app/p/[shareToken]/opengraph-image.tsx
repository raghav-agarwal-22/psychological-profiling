import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Psychological Profile — Innermind'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface DimensionScore {
  normalized: number
  raw: number
  responseCount: number
}

interface Profile {
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
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

export default async function Image({ params }: { params: { shareToken: string } }) {
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
        .slice(0, 3)
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#1c1917',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Subtle background accent */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top branding row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            ◎
          </div>
          <span
            style={{
              fontSize: '18px',
              color: '#a8a29e',
              letterSpacing: '0.05em',
              fontFamily: 'sans-serif',
              fontWeight: 500,
            }}
          >
            innermind
          </span>
        </div>

        {/* Main content row */}
        <div style={{ display: 'flex', flex: 1, gap: '64px', alignItems: 'flex-start' }}>
          {/* Left: archetype + subtitle */}
          <div style={{ flex: '0 0 500px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'sans-serif',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                marginBottom: '16px',
              }}
            >
              Psychological Profile
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#f5f5f4',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              {archetype}
            </div>
            {profile?.summary && (
              <div
                style={{
                  fontSize: '17px',
                  fontFamily: 'sans-serif',
                  color: '#78716c',
                  lineHeight: 1.5,
                  maxWidth: '440px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {profile.summary.split(/[.!?]/)[0]?.trim() ?? profile.summary}
              </div>
            )}
          </div>

          {/* Right: dimension bars */}
          {topDimensions.length > 0 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingTop: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#57534e',
                  marginBottom: '4px',
                }}
              >
                Top dimensions
              </div>
              {topDimensions.map(({ key, label, value }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        fontFamily: 'sans-serif',
                        color: '#d6d3d1',
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontFamily: 'sans-serif',
                        color: '#f59e0b',
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                  {/* Track */}
                  <div
                    style={{
                      height: '8px',
                      width: '100%',
                      backgroundColor: '#292524',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Fill */}
                    <div
                      style={{
                        height: '8px',
                        width: `${value}%`,
                        backgroundColor: '#f59e0b',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom footer line */}
        <div
          style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #292524',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontFamily: 'sans-serif',
              color: '#44403c',
            }}
          >
            innermind.app
          </span>
          <span
            style={{
              fontSize: '13px',
              fontFamily: 'sans-serif',
              color: '#44403c',
            }}
          >
            Science-backed psychological assessments
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
