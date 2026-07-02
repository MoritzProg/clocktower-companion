import type { Gender } from './types.ts'

export interface PlaceholderContext {
  name: string
  gender: Gender
}

const GENDER_INDEX: Record<Gender, number> = { m: 0, f: 1, n: 2 }

/** Matches {he|she|they} style variants: 2–3 options separated by pipes. */
const GENDER_VARIANT = /\{([^{}|\n]*\|[^{}\n]*)\}/g

/** Matches $Name (case-insensitive, so $name works too). */
const NAME_TOKEN = /\$name/gi

/**
 * Resolves placeholders in a speech text.
 * - `$Name` becomes the player name (left untouched when the name is empty,
 *   so the UI can highlight it as unresolved).
 * - `{m-form|f-form|n-form}` picks the variant for the given gender.
 *   With only two options the neutral gender falls back to the first form.
 */
export function resolvePlaceholders(
  text: string,
  ctx: PlaceholderContext,
): string {
  let result = text.replace(GENDER_VARIANT, (_match, inner: string) => {
    const variants = inner.split('|')
    return variants[GENDER_INDEX[ctx.gender]] ?? variants[0] ?? ''
  })
  if (ctx.name.trim() !== '') {
    result = result.replace(NAME_TOKEN, ctx.name.trim())
  }
  return result
}

/** True if the text still contains an unfilled $Name token. */
export function hasUnresolvedName(text: string): boolean {
  return /\$name/i.test(text)
}

/** True if the raw speech text asks for a player name. */
export function usesNamePlaceholder(text: string): boolean {
  return hasUnresolvedName(text)
}
