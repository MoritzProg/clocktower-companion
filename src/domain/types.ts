export type Language = 'en' | 'de'
export type Gender = 'm' | 'f' | 'n'

export interface Category {
  id: string
  name: string
  /** Whether speeches in this category typically target a player,
   *  so the UI shows name/gender inputs (e.g. executions, deaths). */
  usesPlayerName: boolean
}

export interface Speech {
  id: string
  /**
   * Translation group. Speeches that are language versions of the same
   * story share a groupId; usage is tracked per group, so a playgroup
   * that heard the German version never gets the English one either.
   * Standalone speeches simply have a groupId of their own.
   */
  groupId: string
  categoryId: string
  language: Language
  /** May contain placeholders: $Name and {he|she|they}. */
  text: string
}

export interface Playgroup {
  id: string
  name: string
  usedGroupIds: string[]
}

export interface Settings {
  language: Language
  /** null = no playgroup selected, usage is not tracked. */
  activePlaygroupId: string | null
  playerName: string
  gender: Gender
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  activePlaygroupId: null,
  playerName: '',
  gender: 'm',
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
