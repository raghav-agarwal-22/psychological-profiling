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
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
  // Values
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
        .slice(0, 4)
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          backgroundColor: '#1c1917',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Radial glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          }}
        />
        {/* Radial glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,162,158,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Top branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '80px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ◎
          </div>
          <span
            style={{
              fontSize: '20px',
              color: '#a8a29e',
              letterSpacing: '0.05em',
              fontFamily: 'sans-serif',
              fontWeight: 500,
            }}
          >
            innermind
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'sans-serif',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#f59e0b',
            marginBottom: '20px',
          }}
        >
          My Psychological Archetype
        </div>

        {/* Archetype name */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 700,
            color: '#f5f5f4',
            lineHeight: 1.05,
            marginBottom: '32px',
          }}
        >
          {archetype}
        </div>

        {/* Summary snippet */}
        {profile?.summary && (
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'sans-serif',
              color: '#78716c',
              lineHeight: 1.5,
              maxWidth: '800px',
              marginBottom: '64px',
            }}
          >
            {profile.summary.split(/[.!?]/)[0]?.trim() ?? profile.summary}.
          </div>
        )}

        {/* Dimension bars */}
        {topDimensions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'sans-serif',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#57534e',
                marginBottom: '4px',
              }}
            >
              Top Traits
            </div>
            {topDimensions.map(({ key, label, value }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '17px', fontFamily: 'sans-serif', color: '#d6d3d1', fontWeight: 500 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: '16px', fontFamily: 'sans-serif', color: '#f59e0b', fontWeight: 700 }}>
                    {value}%
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: '#292524',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '8px',
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

        {/* Footer */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid #292524',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: 'sans-serif', color: '#44403c' }}>
            innermindhealing.com
          </span>
          <span style={{ fontSize: '14px', fontFamily: 'sans-serif', color: '#44403c' }}>
            Science-backed psychological assessments
          </span>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  )
}
