import type { Category, Playgroup, Settings, Speech } from '../domain/types.ts'
import { DEFAULT_SETTINGS } from '../domain/types.ts'
import type { AppRepository } from './repository.ts'

const KEYS = {
  speeches: 'ctc.speeches',
  categories: 'ctc.categories',
  playgroups: 'ctc.playgroups',
  settings: 'ctc.settings',
  importedSeedIds: 'ctc.importedSeedIds',
} as const

function load<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export class LocalStorageRepository implements AppRepository {
  getSpeeches(): Speech[] {
    return load<Speech[]>(KEYS.speeches, [])
  }
  saveSpeeches(speeches: Speech[]): void {
    save(KEYS.speeches, speeches)
  }

  getCategories(): Category[] {
    return load<Category[]>(KEYS.categories, [])
  }
  saveCategories(categories: Category[]): void {
    save(KEYS.categories, categories)
  }

  getPlaygroups(): Playgroup[] {
    return load<Playgroup[]>(KEYS.playgroups, [])
  }
  savePlaygroups(playgroups: Playgroup[]): void {
    save(KEYS.playgroups, playgroups)
  }

  getSettings(): Settings {
    return { ...DEFAULT_SETTINGS, ...load<Partial<Settings>>(KEYS.settings, {}) }
  }
  saveSettings(settings: Settings): void {
    save(KEYS.settings, settings)
  }

  getImportedSeedIds(): string[] {
    return load<string[]>(KEYS.importedSeedIds, [])
  }
  saveImportedSeedIds(ids: string[]): void {
    save(KEYS.importedSeedIds, ids)
  }
}
