import type { AppRepository } from './repository.ts'
import { SEED_CATEGORIES, SEED_SPEECHES } from './seedContent.ts'

/**
 * Imports bundled seed content into the repository on first launch.
 * Runs on every start but only adds items whose IDs were never imported
 * before — so user deletions stick, while app updates can ship new content.
 */
export function ensureSeedData(repo: AppRepository): void {
  const imported = new Set(repo.getImportedSeedIds())
  const newCategories = SEED_CATEGORIES.filter((c) => !imported.has(c.id))
  const newSpeeches = SEED_SPEECHES.filter((s) => !imported.has(s.id))
  if (newCategories.length === 0 && newSpeeches.length === 0) return

  if (newCategories.length > 0) {
    const categories = repo.getCategories()
    const existing = new Set(categories.map((c) => c.id))
    repo.saveCategories([
      ...categories,
      ...newCategories.filter((c) => !existing.has(c.id)),
    ])
  }
  if (newSpeeches.length > 0) {
    const speeches = repo.getSpeeches()
    const existing = new Set(speeches.map((s) => s.id))
    repo.saveSpeeches([
      ...speeches,
      ...newSpeeches.filter((s) => !existing.has(s.id)),
    ])
  }
  repo.saveImportedSeedIds([
    ...imported,
    ...newCategories.map((c) => c.id),
    ...newSpeeches.map((s) => s.id),
  ])
}
