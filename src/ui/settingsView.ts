import {
  exportBackup,
  importMerge,
  importReplace,
  parseBackup,
} from '../data/exportImport.ts'
import type { AppRepository } from '../data/repository.ts'
import type { AppContext } from './context.ts'
import { downloadFile, el, pickTextFile, toast } from './dom.ts'

/** The settings view needs raw repository access for backup/restore. */
let repository: AppRepository

export function initSettingsView(repo: AppRepository): void {
  repository = repo
}

export function renderSettingsView(container: HTMLElement, ctx: AppContext): void {
  const view = el(`
    <div class="settings">
      <header class="view-header"><h2>Settings</h2></header>

      <section>
        <h3>Backup</h3>
        <p class="hint">
          Your speeches and playgroups live only in this browser. Export a
          backup now and then — it's also how you copy your collection to
          another device or share it with a friend.
        </p>
        <div class="reading-actions">
          <button class="primary" data-role="export">⬇ Export backup</button>
          <button data-role="import-merge">Import (add missing)</button>
          <button data-role="import-replace">Import (replace all)</button>
        </div>
      </section>

      <section>
        <h3>Danger zone</h3>
        <div class="reading-actions">
          <button class="ghost danger" data-role="wipe">Delete all local data</button>
        </div>
      </section>

      <section>
        <h3>About</h3>
        <p class="hint">
          Clocktower Companion — atmospheric speeches for Blood on the
          Clocktower storytellers. Works offline once installed
          (browser menu → "Add to home screen").
        </p>
      </section>
    </div>
  `)

  view.querySelector('[data-role="export"]')!.addEventListener('click', () => {
    const date = new Date().toISOString().slice(0, 10)
    downloadFile(
      `clocktower-companion-backup-${date}.json`,
      exportBackup(repository),
      'application/json',
    )
  })

  const runImport = async (mode: 'merge' | 'replace') => {
    const json = await pickTextFile()
    if (json === null) return
    try {
      const backup = parseBackup(json)
      if (mode === 'replace') {
        if (!confirm('Replace ALL speeches, categories and playgroups with the backup?')) return
        importReplace(repository, backup)
      } else {
        importMerge(repository, backup)
      }
      toast('Backup imported')
      ctx.rerender()
    } catch (error) {
      toast(`Import failed: ${error instanceof Error ? error.message : 'invalid file'}`)
    }
  }
  view
    .querySelector('[data-role="import-merge"]')!
    .addEventListener('click', () => void runImport('merge'))
  view
    .querySelector('[data-role="import-replace"]')!
    .addEventListener('click', () => void runImport('replace'))

  view.querySelector('[data-role="wipe"]')!.addEventListener('click', () => {
    if (confirm('Delete ALL data (speeches, playgroups, settings)? The bundled starter content will be re-imported.')) {
      localStorage.clear()
      location.reload()
    }
  })

  container.append(view)
}
