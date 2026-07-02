import type { Category, Playgroup, Settings, Speech } from '../domain/types.ts'

/**
 * All persistence goes through this interface, so the storage backend
 * (currently localStorage) can be swapped without touching services or UI.
 */
export interface AppRepository {
  getSpeeches(): Speech[]
  saveSpeeches(speeches: Speech[]): void

  getCategories(): Category[]
  saveCategories(categories: Category[]): void

  getPlaygroups(): Playgroup[]
  savePlaygroups(playgroups: Playgroup[]): void

  getSettings(): Settings
  saveSettings(settings: Settings): void

  /**
   * IDs of seed items (speeches and categories) that were imported at some
   * point. Lets app updates add new seed content without resurrecting
   * items the user deleted.
   */
  getImportedSeedIds(): string[]
  saveImportedSeedIds(ids: string[]): void
}
