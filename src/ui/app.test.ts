// @vitest-environment happy-dom
// Smoke test: boots the whole app against seeded data and walks through
// the main flows, catching runtime errors in the views.
import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStorageRepository } from '../data/localStorageRepository.ts'
import { ensureSeedData } from '../data/seed.ts'
import { SessionService } from '../services/sessionService.ts'
import { SpeechService } from '../services/speechService.ts'
import { startApp } from './app.ts'
import { initSettingsView } from './settingsView.ts'

function boot(): HTMLElement {
  const root = document.createElement('div')
  document.body.innerHTML = ''
  document.body.append(root)
  const repo = new LocalStorageRepository()
  ensureSeedData(repo)
  initSettingsView(repo)
  startApp(root, new SpeechService(repo), new SessionService(repo))
  return root
}

function click(root: HTMLElement, selector: string): void {
  const node = root.querySelector<HTMLElement>(selector)
  if (node === null) throw new Error(`not found: ${selector}`)
  node.click()
}

beforeEach(() => {
  localStorage.clear()
})

describe('app smoke test', () => {
  it('renders the seeded categories on the draw screen', () => {
    const root = boot()
    const names = [...root.querySelectorAll('.category-name')].map((n) => n.textContent)
    expect(names).toContain('Execution')
    expect(names.length).toBeGreaterThanOrEqual(3)
  })

  it('draws a speech and returns to the pick screen', () => {
    const root = boot()
    click(root, '.category-button')
    expect(root.querySelector('.speech-text')!.textContent!.length).toBeGreaterThan(20)
    click(root, '.back-button')
    expect(root.querySelector('.category-list')).not.toBeNull()
  })

  it('tracks usage for a playgroup and excludes heard stories', () => {
    const root = boot()
    // Create a playgroup (becomes active) in the Groups tab.
    click(root, '.tab:nth-child(3)')
    root.querySelector<HTMLInputElement>('[data-role="new-group"]')!.value = 'Testers'
    click(root, '[data-role="add-group"]')
    expect(root.textContent).toContain('Testers')

    // Draw and mark as heard; the category counter must drop.
    click(root, '.tab:nth-child(1)')
    const before = root.querySelector('.category-count')!.textContent!
    click(root, '.category-button')
    click(root, '.reading-actions .primary')
    expect(root.textContent).toContain('Marked as heard')
    click(root, '.back-button')
    const after = root.querySelector('.category-count')!.textContent!
    expect(after).not.toBe(before)
  })

  it('renders every tab without errors', () => {
    const root = boot()
    for (const index of [2, 3, 4, 1]) {
      click(root, `.tab:nth-child(${index})`)
      expect(root.querySelector('.view')).not.toBeNull()
    }
  })

  it('adds a new speech through the library form', () => {
    const root = boot()
    click(root, '.tab:nth-child(2)')
    click(root, '[data-role="new"]')
    root.querySelector<HTMLTextAreaElement>('[data-role="text"]')!.value =
      'A brand new tale. $Name is dead.'
    click(root, '[data-role="save"]')
    expect(root.textContent).toContain('A brand new tale.')
  })
})
