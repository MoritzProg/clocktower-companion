import type { SessionService } from '../services/sessionService.ts'
import type { SpeechService } from '../services/speechService.ts'
import type { AppContext } from './context.ts'
import { el } from './dom.ts'
import { renderDrawView } from './drawView.ts'
import { renderManageView } from './manageView.ts'
import { renderPlaygroupsView } from './playgroupsView.ts'
import { renderSettingsView } from './settingsView.ts'

type TabId = 'draw' | 'library' | 'groups' | 'settings'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'draw', label: 'Draw', icon: '🎲' },
  { id: 'library', label: 'Library', icon: '📜' },
  { id: 'groups', label: 'Groups', icon: '👥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const VIEWS: Record<TabId, (container: HTMLElement, ctx: AppContext) => void> = {
  draw: renderDrawView,
  library: renderManageView,
  groups: renderPlaygroupsView,
  settings: renderSettingsView,
}

export function startApp(
  root: HTMLElement,
  content: SpeechService,
  session: SessionService,
): void {
  let currentTab: TabId = 'draw'
  const ctx: AppContext = { content, session, rerender: render }

  function render(): void {
    root.innerHTML = ''
    const main = el('<main class="view"></main>')
    VIEWS[currentTab](main, ctx)
    root.append(main)

    const nav = el('<nav class="tab-bar"></nav>')
    for (const tab of TABS) {
      const button = el<HTMLButtonElement>(`
        <button class="tab ${tab.id === currentTab ? 'active' : ''}">
          <span class="tab-icon">${tab.icon}</span>
          <span class="tab-label">${tab.label}</span>
        </button>
      `)
      button.addEventListener('click', () => {
        currentTab = tab.id
        render()
      })
      nav.append(button)
    }
    root.append(nav)
  }

  render()
}
