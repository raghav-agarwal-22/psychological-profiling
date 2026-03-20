'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DimensionScore {
  normalized: number
  raw: number
  responseCount: number
}

interface HistoryProfile {
  id: string
  version: number
  summary: string
  dimensions: Record<string, DimensionScore>
  generatedAt: string
}

interface GrowthChartProps {
  profiles: HistoryProfile[]
  frameType?: string
}

// Color palette for dimensions — ordered by priority
const DIMENSION_COLORS: Record<string, string> = {
  // Big Five
  openness: '#8b5cf6',
  conscientiousness: '#3b82f6',
  extraversion: '#f59e0b',
  agreeableness: '#10b981',
  neuroticism: '#f43f5e',
  // Values
  achievement: '#f59e0b',
  benevolence: '#10b981',
  conformity: '#60a5fa',
  hedonism: '#ec4899',
  power: '#f43f5e',
  security: '#06b6d4',
  self_direction: '#8b5cf6',
  stimulation: '#f97316',
  universalism: '#14b8a6',
  // Attachment
  anxiety: '#f43f5e',
  avoidance: '#6366f1',
  // Light/Dark Triad
  kantianism: '#14b8a6',
  humanism: '#10b981',
  faith_in_humanity: '#06b6d4',
  narcissism: '#f43f5e',
  machiavellianism: '#f97316',
  psychopathy: '#dc2626',
}

const FALLBACK_COLORS = [
  '#8b5cf6', '#3b82f6', '#f59e0b', '#10b981', '#f43f5e',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#6366f1',
]

function getDimensionColor(key: string, index: number): string {
  return DIMENSION_COLORS[key] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]!
}

function formatDimensionLabel(key: string): string {
  return key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border border-stone-700 bg-stone-900 p-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-stone-400">{label}</p>
      {payload
        .slice()
        .sort((a, b) => b.value - a.value)
        .map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-stone-300">{entry.name}</span>
            <span className="ml-auto pl-4 text-xs font-semibold tabular-nums text-stone-100">
              {entry.value}
            </span>
          </div>
        ))}
    </div>
  )
}

export function GrowthChart({ profiles, frameType }: GrowthChartProps) {
  if (profiles.length < 2) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
        <p className="text-sm text-stone-500">
          Complete at least 2 assessments to see your growth chart.
        </p>
      </div>
    )
  }

  // Build sorted chronological list (oldest first)
  const sorted = [...profiles].sort(
    (a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime(),
  )

  // Collect all dimension keys from all profiles
  const allDimensions = Array.from(
    new Set(sorted.flatMap((p) => Object.keys(p.dimensions))),
  )

  // Build chart data — each point is one assessment take
  const chartData = sorted.map((p, idx) => {
    const point: Record<string, number | string> = {
      date: formatDate(p.generatedAt),
      take: `Take ${idx + 1}`,
    }
    for (const dim of allDimensions) {
      const score = p.dimensions[dim]
      point[dim] = score ? Math.round(score.normalized) : 0
    }
    return point
  })

  const title = frameType
    ? frameType
        .replace(/_/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : 'Growth'

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-serif text-xl text-stone-200">{title} — Growth Over Time</h2>
        <span className="rounded-full bg-stone-800 px-2.5 py-0.5 text-xs text-stone-400">
          {profiles.length} takes
        </span>
      </div>
      <p className="mb-6 text-xs text-stone-500">
        Dimension scores (0–100) across all retakes, oldest to newest.
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
          <XAxis
            dataKey="take"
            tick={{ fontSize: 11, fill: '#78716c' }}
            axisLine={{ stroke: '#292524' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: '#a8a29e', paddingTop: 12 }}
          />
          {allDimensions.map((dim, idx) => (
            <Line
              key={dim}
              type="monotone"
              dataKey={dim}
              name={formatDimensionLabel(dim)}
              stroke={getDimensionColor(dim, idx)}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 0, fill: getDimensionColor(dim, idx) }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 border-t border-stone-800 pt-4">
        <p className="text-xs text-stone-600">
          Each point represents a completed assessment take. Scores are normalized 0–100.
        </p>
      </div>
    </div>
  )
}
