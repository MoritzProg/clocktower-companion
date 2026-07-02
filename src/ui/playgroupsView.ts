import type { AppContext } from './context.ts'
import { el, escapeHtml } from './dom.ts'

export function renderPlaygroupsView(container: HTMLElement, ctx: AppContext): void {
  const settings = ctx.session.getSettings()
  const view = el(`
    <div class="groups">
      <header class="view-header"><h2>Playgroups</h2></header>
      <p class="hint">
        The active playgroup remembers which stories it has heard — in any
        language — and never gets them again until you reset it.
      </p>
      <div class="group-list"></div>
      <div class="control-row">
        <input type="text" data-role="new-group" placeholder="New playgroup name">
        <button data-role="add-group">Add</button>
      </div>
    </div>
  `)

  const list = view.querySelector('.group-list')!

  const noneRow = el(`
    <label class="group-row">
      <input type="radio" name="active-group" value="" ${settings.activePlaygroupId === null ? 'checked' : ''}>
      <span class="group-name">No playgroup <span class="hint">(don't track usage)</span></span>
    </label>
  `)
  list.append(noneRow)

  for (const group of ctx.session.getPlaygroups()) {
    const row = el(`
      <label class="group-row">
        <input type="radio" name="active-group" value="${group.id}"
               ${group.id === settings.activePlaygroupId ? 'checked' : ''}>
        <span class="group-name">${escapeHtml(group.name)}
          <span class="hint">${group.usedGroupIds.length} stories heard</span>
        </span>
        <button class="ghost" data-role="reset" title="Forget heard stories">⟲</button>
        <button class="ghost danger" data-role="delete" title="Delete playgroup">✕</button>
      </label>
    `)
    row.querySelector('[data-role="reset"]')!.addEventListener('click', (event) => {
      event.preventDefault()
      if (confirm(`Forget the ${group.usedGroupIds.length} stories "${group.name}" has heard?`)) {
        ctx.session.resetUsage(group.id)
        ctx.rerender()
      }
    })
    row.querySelector('[data-role="delete"]')!.addEventListener('click', (event) => {
      event.preventDefault()
      if (confirm(`Delete playgroup "${group.name}"?`)) {
        ctx.session.deletePlaygroup(group.id)
        ctx.rerender()
      }
    })
    list.append(row)
  }

  list.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      ctx.session.updateSettings({ activePlaygroupId: radio.value || null })
      ctx.rerender()
    })
  })

  const nameInput = view.querySelector<HTMLInputElement>('[data-role="new-group"]')!
  view.querySelector('[data-role="add-group"]')!.addEventListener('click', () => {
    const name = nameInput.value.trim()
    if (name === '') return
    const group = ctx.session.addPlaygroup(name)
    ctx.session.updateSettings({ activePlaygroupId: group.id })
    ctx.rerender()
  })

  container.append(view)
}
