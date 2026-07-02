import type { Language, Speech } from './types.ts'

export interface SelectionFilter {
  categoryId: string
  language: Language
  /** Translation groups already used by the active playgroup. */
  usedGroupIds: ReadonlySet<string>
  /** Speeches skipped in this session (excluded until the pool runs dry). */
  skippedSpeechIds?: ReadonlySet<string>
}

/** All speeches matching category + language that are not yet used. */
export function availableSpeeches(
  all: readonly Speech[],
  filter: SelectionFilter,
): Speech[] {
  return all.filter(
    (s) =>
      s.categoryId === filter.categoryId &&
      s.language === filter.language &&
      !filter.usedGroupIds.has(s.groupId) &&
      !(filter.skippedSpeechIds?.has(s.id) ?? false),
  )
}

export function pickRandom<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): T | null {
  if (items.length === 0) return null
  return items[Math.floor(rng() * items.length)]
}

export interface DrawResult {
  speech: Speech | null
  /** True when only already-used speeches remain for this filter. */
  exhausted: boolean
}

/**
 * Draws a random unused speech. When everything unused has been skipped
 * this session, the skip list is ignored (better to repeat a skip than
 * to show nothing). `exhausted` signals that only used speeches remain.
 */
export function drawSpeech(
  all: readonly Speech[],
  filter: SelectionFilter,
  rng: () => number = Math.random,
): DrawResult {
  let pool = availableSpeeches(all, filter)
  if (pool.length === 0 && filter.skippedSpeechIds?.size) {
    pool = availableSpeeches(all, { ...filter, skippedSpeechIds: undefined })
  }
  if (pool.length > 0) {
    return { speech: pickRandom(pool, rng), exhausted: false }
  }
  return { speech: null, exhausted: true }
}

/** Draws among *used* speeches — the "allow repeats" fallback. */
export function drawUsedSpeech(
  all: readonly Speech[],
  filter: Pick<SelectionFilter, 'categoryId' | 'language'>,
  rng: () => number = Math.random,
): Speech | null {
  const pool = all.filter(
    (s) => s.categoryId === filter.categoryId && s.language === filter.language,
  )
  return pickRandom(pool, rng)
}
