import type { AppRepository } from '../data/repository.ts'
import type { Playgroup, Settings } from '../domain/types.ts'
import { newId } from '../domain/types.ts'

/** Session use-cases: settings, playgroups and their used-speech tracking. */
export class SessionService {
  private readonly repo: AppRepository

  constructor(repo: AppRepository) {
    this.repo = repo
  }

  // --- Settings ---

  getSettings(): Settings {
    return this.repo.getSettings()
  }

  updateSettings(patch: Partial<Settings>): Settings {
    const settings = { ...this.repo.getSettings(), ...patch }
    this.repo.saveSettings(settings)
    return settings
  }

  // --- Playgroups ---

  getPlaygroups(): Playgroup[] {
    return this.repo.getPlaygroups()
  }

  getActivePlaygroup(): Playgroup | null {
    const id = this.getSettings().activePlaygroupId
    if (id === null) return null
    return this.repo.getPlaygroups().find((p) => p.id === id) ?? null
  }

  addPlaygroup(name: string): Playgroup {
    const playgroup: Playgroup = {
      id: newId('group'),
      name: name.trim(),
      usedGroupIds: [],
    }
    this.repo.savePlaygroups([...this.repo.getPlaygroups(), playgroup])
    return playgroup
  }

  deletePlaygroup(id: string): void {
    this.repo.savePlaygroups(this.repo.getPlaygroups().filter((p) => p.id !== id))
    if (this.getSettings().activePlaygroupId === id) {
      this.updateSettings({ activePlaygroupId: null })
    }
  }

  /** Forgets which speeches the playgroup has heard. */
  resetUsage(id: string): void {
    this.repo.savePlaygroups(
      this.repo
        .getPlaygroups()
        .map((p) => (p.id === id ? { ...p, usedGroupIds: [] } : p)),
    )
  }

  // --- Usage tracking (for the active playgroup) ---

  /** Story groups the active playgroup has already heard. Empty when no playgroup is active. */
  usedGroupIds(): Set<string> {
    return new Set(this.getActivePlaygroup()?.usedGroupIds ?? [])
  }

  /** Marks a story group as heard. Returns false when no playgroup is active. */
  markUsed(groupId: string): boolean {
    const active = this.getActivePlaygroup()
    if (active === null) return false
    if (!active.usedGroupIds.includes(groupId)) {
      this.repo.savePlaygroups(
        this.repo
          .getPlaygroups()
          .map((p) =>
            p.id === active.id
              ? { ...p, usedGroupIds: [...p.usedGroupIds, groupId] }
              : p,
          ),
      )
    }
    return true
  }
}
