// ─── Big Five Scoring Utility ─────────────────────────────────────────────────
//
// Scoring algorithm:
//   1. For each response, apply reverse scoring if needed: adjusted = 6 - raw
//   2. Average the adjusted values per dimension
//   3. Normalize to 0-100: (avg - 1) / 4 * 100

export interface QuestionBankItem {
  id: string
  text: string
  dimension: string
  reverse_scored: boolean
}

export interface DimensionScoringConfig {
  questionIds: string[]
  reverseIds: string[]
  formula: 'average'
  normalize: boolean
}

export type ScoringConfig = Record<string, DimensionScoringConfig>

export interface DimensionScore {
  raw: number        // Average of adjusted Likert values (1-5)
  normalized: number // Normalized to 0-100
  responseCount: number
}

export type AssessmentScores = Record<string, DimensionScore>

/**
 * Compute Big Five (or any dimension-based) scores from raw question responses.
 *
 * @param responses - Map of questionId → raw Likert value (1-5)
 * @param scoringConfig - Per-dimension config with questionIds and reverseIds
 * @returns Scores per dimension with raw average and 0-100 normalized value
 */
export function computeScores(
  responses: Record<string, number>,
  scoringConfig: ScoringConfig,
): AssessmentScores {
  const scores: AssessmentScores = {}

  for (const [dimension, config] of Object.entries(scoringConfig)) {
    const reverseSet = new Set(config.reverseIds)
    const values: number[] = []

    for (const qId of config.questionIds) {
      const raw = responses[qId]
      if (raw === undefined) continue

      const adjusted = reverseSet.has(qId) ? 6 - raw : raw
      values.push(adjusted)
    }

    if (values.length === 0) {
      scores[dimension] = { raw: 0, normalized: 0, responseCount: 0 }
      continue
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const normalized = config.normalize ? Math.round(((avg - 1) / 4) * 100) : avg

    scores[dimension] = {
      raw: Math.round(avg * 100) / 100,
      normalized,
      responseCount: values.length,
    }
  }

  return scores
}
