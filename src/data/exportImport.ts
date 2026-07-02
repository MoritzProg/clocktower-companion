import type { Category, Playgroup, Speech } from '../domain/types.ts'
import type { AppRepository } from './repository.ts'

export interface BackupFile {
  app: 'clocktower-companion'
  version: 1
  exportedAt: string
  categories: Category[]
  speeches: Speech[]
  playgroups: Playgroup[]
  importedSeedIds: string[]
}

export function exportBackup(repo: AppRepository): string {
  const backup: BackupFile = {
    app: 'clocktower-companion',
    version: 1,
    exportedAt: new Date().toISOString(),
    categories: repo.getCategories(),
    speeches: repo.getSpeeches(),
    playgroups: repo.getPlaygroups(),
    importedSeedIds: repo.getImportedSeedIds(),
  }
  return JSON.stringify(backup, null, 2)
}

export function parseBackup(json: string): BackupFile {
  const data = JSON.parse(json) as BackupFile
  if (data.app !== 'clocktower-companion') {
    throw new Error('Not a Clocktower Companion backup file.')
  }
  return data
}

/** Replaces all content and playgroups with the backup (settings stay). */
export function importReplace(repo: AppRepository, backup: BackupFile): void {
  repo.saveCategories(backup.categories)
  repo.saveSpeeches(backup.speeches)
  repo.savePlaygroups(backup.playgroups)
  repo.saveImportedSeedIds(backup.importedSeedIds)
}

/** Adds categories/speeches/playgroups that don't exist yet (matched by id). */
export function importMerge(repo: AppRepository, backup: BackupFile): void {
  const mergeById = <T extends { id: string }>(current: T[], incoming: T[]) => {
    const existing = new Set(current.map((item) => item.id))
    return [...current, ...incoming.filter((item) => !existing.has(item.id))]
  }
  repo.saveCategories(mergeById(repo.getCategories(), backup.categories))
  repo.saveSpeeches(mergeById(repo.getSpeeches(), backup.speeches))
  repo.savePlaygroups(mergeById(repo.getPlaygroups(), backup.playgroups))
  // Remember seed ids from the backup too, so deleted seeds stay deleted.
  repo.saveImportedSeedIds([
    ...new Set([...repo.getImportedSeedIds(), ...backup.importedSeedIds]),
  ])
}
