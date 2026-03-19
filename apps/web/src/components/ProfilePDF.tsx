import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DimensionScore {
  normalized: number
  raw?: number
  responseCount?: number
}

interface RawOutput {
  templateType?: string
  reflectionPrompts?: string[]
  narrative?: {
    archetype?: string
    values?: string[]
    blind_spots?: string[]
    strengths?: string[]
    narrative?: string
    valueRankings?: string[]
    coreValues?: string[]
    tensions?: Array<{ value1: string; value2: string; description: string }>
    attachmentStyle?: string
    relationshipStrengths?: string[]
    growthEdges?: string[]
    anxietyLevel?: string
    avoidanceLevel?: string
  }
}

interface Profile {
  id: string
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
  values: string[]
  blindSpots: string[]
  strengths: string[]
  version: number
  generatedAt: string
  rawOutput: RawOutput
}

interface JournalEntry {
  id: string
  body: string
  prompt: string | null
  createdAt: string
}

interface ProfileDocumentProps {
  profile: Profile
  synthesis: string | null
  journalEntries: JournalEntry[]
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const BIG_FIVE_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
}

const VALUES_LABELS: Record<string, string> = {
  achievement: 'Achievement',
  benevolence: 'Benevolence',
  conformity: 'Conformity',
  hedonism: 'Hedonism',
  power: 'Power',
  security: 'Security',
  self_direction: 'Self-Direction',
  stimulation: 'Stimulation',
  universalism: 'Universalism',
}

const ATTACHMENT_LABELS: Record<string, string> = {
  anxiety: 'Attachment Anxiety',
  avoidance: 'Attachment Avoidance',
}

const ATTACHMENT_STYLE_LABELS: Record<string, string> = {
  secure: 'Secure',
  anxious: 'Anxious / Preoccupied',
  avoidant: 'Dismissive-Avoidant',
  fearful: 'Fearful-Avoidant',
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    backgroundColor: '#FAFAF9',
    color: '#1C1917',
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Header
  headerBand: {
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
    paddingBottom: 20,
  },
  productName: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    color: '#A8A29E',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  reportTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 24,
    color: '#1C1917',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 11,
    color: '#78716C',
  },
  reportDate: {
    fontSize: 9,
    color: '#A8A29E',
    marginTop: 6,
  },
  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    color: '#1C1917',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E7E5E4',
    paddingBottom: 4,
  },
  // Body text
  bodyText: {
    fontSize: 10,
    color: '#44403C',
    lineHeight: 1.6,
    marginBottom: 4,
  },
  mutedText: {
    fontSize: 9,
    color: '#78716C',
    lineHeight: 1.5,
  },
  // Score bar
  scoreRow: {
    marginBottom: 8,
  },
  scoreLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#44403C',
  },
  scoreValue: {
    fontSize: 9,
    color: '#78716C',
    fontFamily: 'Times-Bold',
  },
  barTrack: {
    height: 5,
    backgroundColor: '#E7E5E4',
    borderRadius: 3,
  },
  barFill: {
    height: 5,
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  barFillAccent: {
    height: 5,
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  // Tags / chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  chip: {
    backgroundColor: '#F5F5F4',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    color: '#44403C',
    borderWidth: 0.5,
    borderColor: '#D6D3D1',
  },
  chipHighlight: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    color: '#92400E',
    borderWidth: 0.5,
    borderColor: '#FDE68A',
  },
  // Strength/blind-spot list
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  bullet: {
    fontSize: 9,
    color: '#F59E0B',
    marginTop: 1,
  },
  bulletGrowth: {
    fontSize: 9,
    color: '#6366F1',
    marginTop: 1,
  },
  bulletText: {
    fontSize: 9,
    color: '#44403C',
    flex: 1,
    lineHeight: 1.5,
  },
  // Two-column layout
  twoCol: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
  colTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    color: '#1C1917',
    marginBottom: 6,
  },
  // Synthesis
  synthesisBox: {
    backgroundColor: '#FFFDF7',
    borderWidth: 0.5,
    borderColor: '#FDE68A',
    borderRadius: 4,
    padding: 12,
    marginBottom: 4,
  },
  synthesisText: {
    fontSize: 9.5,
    color: '#292524',
    lineHeight: 1.65,
    marginBottom: 5,
  },
  // Journal
  journalEntry: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E7E5E4',
  },
  journalPrompt: {
    fontSize: 8.5,
    color: '#B45309',
    fontFamily: 'Times-Italic',
    marginBottom: 3,
  },
  journalBody: {
    fontSize: 9.5,
    color: '#292524',
    lineHeight: 1.6,
  },
  journalDate: {
    fontSize: 8,
    color: '#A8A29E',
    marginTop: 3,
  },
  // Tension box
  tensionBox: {
    backgroundColor: '#F5F5F4',
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  tensionHeader: {
    fontSize: 9,
    fontFamily: 'Times-Bold',
    color: '#1C1917',
    marginBottom: 3,
  },
  tensionBody: {
    fontSize: 8.5,
    color: '#57534E',
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#E7E5E4',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: '#A8A29E',
  },
})

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <View style={S.scoreRow}>
      <View style={S.scoreLabelRow}>
        <Text style={S.scoreLabel}>{label}</Text>
        <Text style={S.scoreValue}>{pct}</Text>
      </View>
      <View style={S.barTrack}>
        <View style={[accent ? S.barFillAccent : S.barFill, { width: `${pct}%` }]} />
      </View>
    </View>
  )
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={S.sectionTitle}>{children}</Text>
}

// ─── Main Document ────────────────────────────────────────────────────────────

export function ProfileDocument({ profile, synthesis, journalEntries }: ProfileDocumentProps) {
  const isValues = profile.rawOutput?.templateType === 'VALUES_INVENTORY'
  const isAttachment = profile.rawOutput?.templateType === 'ATTACHMENT_STYLE'
  const narrative = profile.rawOutput?.narrative
  const attachmentStyle = isAttachment ? (profile.archetypes[0] ?? null) : null
  const reportDate = new Date(profile.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const dimensionEntries = Object.entries(profile.dimensions)
  const sortedValueEntries = isValues
    ? [...dimensionEntries].sort(([, a], [, b]) => {
        const aScore = typeof a === 'object' ? a.normalized : Number(a)
        const bScore = typeof b === 'object' ? b.normalized : Number(b)
        return bScore - aScore
      })
    : dimensionEntries

  // Report title
  let reportTitle = 'Psychological Profile'
  let reportSubtitle = 'Big Five Personality Assessment'
  if (isValues) {
    reportTitle = 'Values Profile'
    reportSubtitle = 'Schwartz Basic Human Values'
  } else if (isAttachment) {
    reportTitle = attachmentStyle ? (ATTACHMENT_STYLE_LABELS[attachmentStyle] ?? 'Attachment Style') : 'Attachment Style'
    reportSubtitle = 'Attachment Style Inventory'
  } else if (profile.archetypes[0]) {
    reportTitle = profile.archetypes[0]
  }

  return (
    <Document title={`Innermind — ${reportTitle}`} author="Innermind">
      <Page size="A4" style={S.page}>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={S.headerBand}>
          <Text style={S.productName}>Innermind · Personal Report</Text>
          <Text style={S.reportTitle}>{reportTitle}</Text>
          <Text style={S.reportSubtitle}>{reportSubtitle}</Text>
          <Text style={S.reportDate}>{reportDate}</Text>
        </View>

        {/* ── Summary ────────────────────────────────────── */}
        <View style={S.section}>
          <SectionTitle>
            {isAttachment ? 'Your relational narrative' : isValues ? 'Your value landscape' : 'Your narrative'}
          </SectionTitle>
          <Text style={S.bodyText}>{profile.summary}</Text>
          {isValues && narrative?.narrative && (
            <Text style={[S.bodyText, { marginTop: 4 }]}>{narrative.narrative}</Text>
          )}
          {isAttachment && narrative?.narrative && (
            <Text style={[S.bodyText, { marginTop: 4 }]}>{narrative.narrative}</Text>
          )}
        </View>

        {/* ── Dimension scores ───────────────────────────── */}
        {!isValues && !isAttachment && dimensionEntries.length > 0 && (
          <View style={S.section}>
            <SectionTitle>Personality dimensions</SectionTitle>
            {dimensionEntries.map(([key, score]) => {
              const label = BIG_FIVE_LABELS[key.toLowerCase()] ?? key
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              return <ScoreBar key={key} label={label} value={pct} />
            })}
          </View>
        )}

        {/* ── Values ranking ─────────────────────────────── */}
        {isValues && sortedValueEntries.length > 0 && (
          <View style={S.section}>
            <SectionTitle>Value rankings</SectionTitle>
            {sortedValueEntries.map(([key, score], index) => {
              const label = VALUES_LABELS[key.toLowerCase()] ?? key
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              const isCore = index < 3
              return (
                <View key={key} style={S.scoreRow}>
                  <View style={S.scoreLabelRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={[S.scoreLabel, { color: '#A8A29E', width: 14 }]}>{index + 1}.</Text>
                      <Text style={[S.scoreLabel, isCore ? { fontFamily: 'Times-Bold', color: '#1C1917' } : {}]}>
                        {label}
                      </Text>
                      {isCore && (
                        <Text style={{ fontSize: 7, color: '#0D9488', backgroundColor: '#F0FDFA', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 8, borderWidth: 0.5, borderColor: '#99F6E4' }}>
                          core
                        </Text>
                      )}
                    </View>
                    <Text style={S.scoreValue}>{pct}</Text>
                  </View>
                  <View style={S.barTrack}>
                    <View style={[{ height: 5, borderRadius: 3, backgroundColor: '#F59E0B', opacity: isCore ? 1 : 0.45 }, { width: `${pct}%` }]} />
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* ── Attachment dimensions ──────────────────────── */}
        {isAttachment && dimensionEntries.length > 0 && (
          <View style={S.section}>
            <SectionTitle>Attachment dimensions</SectionTitle>
            {dimensionEntries.map(([key, score]) => {
              const label = ATTACHMENT_LABELS[key.toLowerCase()] ?? key
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              const isAvoidance = key.toLowerCase() === 'avoidance'
              return <ScoreBar key={key} label={label} value={pct} accent={isAvoidance} />
            })}
          </View>
        )}

        {/* ── Values tensions ────────────────────────────── */}
        {isValues && narrative?.tensions && narrative.tensions.length > 0 && (
          <View style={S.section}>
            <SectionTitle>Value tensions</SectionTitle>
            {narrative.tensions.map((tension, i) => (
              <View key={i} style={S.tensionBox}>
                <Text style={S.tensionHeader}>
                  {VALUES_LABELS[tension.value1] ?? tension.value1} ↔ {VALUES_LABELS[tension.value2] ?? tension.value2}
                </Text>
                <Text style={S.tensionBody}>{tension.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Strengths + Growth areas ───────────────────── */}
        {!isValues && (profile.strengths.length > 0 || profile.blindSpots.length > 0) && (
          <View style={[S.section, S.twoCol]}>
            {profile.strengths.length > 0 && (
              <View style={S.col}>
                <Text style={S.colTitle}>{isAttachment ? 'Relationship strengths' : 'Strengths'}</Text>
                {profile.strengths.map((s, i) => (
                  <View key={i} style={S.bulletRow}>
                    <Text style={S.bullet}>✦</Text>
                    <Text style={S.bulletText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
            {profile.blindSpots.length > 0 && (
              <View style={S.col}>
                <Text style={S.colTitle}>{isAttachment ? 'Growth edges' : 'Growth areas'}</Text>
                {profile.blindSpots.map((s, i) => (
                  <View key={i} style={S.bulletRow}>
                    <Text style={S.bulletGrowth}>→</Text>
                    <Text style={S.bulletText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Core values (Big Five only) ─────────────────── */}
        {!isValues && !isAttachment && profile.values.length > 0 && (
          <View style={S.section}>
            <SectionTitle>Core values</SectionTitle>
            <View style={S.chipRow}>
              {profile.values.map((v) => (
                <Text key={v} style={S.chip}>{v}</Text>
              ))}
            </View>
          </View>
        )}

        {/* ── AI Synthesis ───────────────────────────────── */}
        {synthesis && (
          <View style={S.section}>
            <SectionTitle>Your synthesis</SectionTitle>
            <View style={S.synthesisBox}>
              {synthesis
                .split('\n\n')
                .filter(Boolean)
                .map((para, i) => (
                  <Text key={i} style={S.synthesisText}>{para}</Text>
                ))}
            </View>
            <Text style={S.mutedText}>AI-generated cross-framework narrative · Innermind</Text>
          </View>
        )}

        {/* ── Journal reflections ────────────────────────── */}
        {journalEntries.length > 0 && (
          <View style={S.section}>
            <SectionTitle>Journal reflections</SectionTitle>
            {journalEntries.map((entry) => (
              <View key={entry.id} style={S.journalEntry}>
                {entry.prompt && <Text style={S.journalPrompt}>&ldquo;{entry.prompt}&rdquo;</Text>}
                <Text style={S.journalBody}>{entry.body}</Text>
                <Text style={S.journalDate}>
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Footer ─────────────────────────────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Generated by Innermind · innermind.app</Text>
          <Text style={S.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
