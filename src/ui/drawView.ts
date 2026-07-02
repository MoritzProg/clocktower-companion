import { resolvePlaceholders } from '../domain/placeholders.ts'
import type { Gender, Language } from '../domain/types.ts'
import type { AppContext } from './context.ts'
import { el, escapeHtml, speechToHtml } from './dom.ts'

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'm', label: 'he' },
  { value: 'f', label: 'she' },
  { value: 'n', label: 'they' },
]

interface DrawState {
  mode: 'pick' | 'reading'
  categoryId: string | null
  speechId: string | null
  exhausted: boolean
  marked: boolean
  isRepeat: boolean
  /** Speeches skipped this session, per `${categoryId}:${language}`. */
  skipped: Map<string, Set<string>>
}

const state: DrawState = {
  mode: 'pick',
  categoryId: null,
  speechId: null,
  exhausted: false,
  marked: false,
  isRepeat: false,
  skipped: new Map(),
}

function skippedSet(categoryId: string, language: Language): Set<string> {
  const key = `${categoryId}:${language}`
  let set = state.skipped.get(key)
  if (set === undefined) {
    set = new Set()
    state.skipped.set(key, set)
  }
  return set
}

function draw(ctx: AppContext, categoryId: string): void {
  const { language } = ctx.session.getSettings()
  const result = ctx.content.draw(
    categoryId,
    language,
    ctx.session.usedGroupIds(),
    skippedSet(categoryId, language),
  )
  state.mode = 'reading'
  state.categoryId = categoryId
  state.speechId = result.speech?.id ?? null
  state.exhausted = result.exhausted
  state.marked = false
  state.isRepeat = false
  ctx.rerender()
}

export function renderDrawView(container: HTMLElement, ctx: AppContext): void {
  if (state.mode === 'reading' && state.categoryId !== null) {
    renderReading(container, ctx)
  } else {
    renderPick(container, ctx)
  }
}

// --- Pick screen: settings row + one big button per category ---

function renderPick(container: HTMLElement, ctx: AppContext): void {
  const settings = ctx.session.getSettings()
  const playgroups = ctx.session.getPlaygroups()
  const usedGroupIds = ctx.session.usedGroupIds()

  const view = el(`
    <div class="draw-pick">
      <header class="app-header">
        <h1>Clocktower Companion</h1>
        <p class="subtitle">Tales for Ravenswood Bluff</p>
      </header>
      <div class="control-row">
        <div class="segmented" data-role="language"></div>
        <select class="playgroup-select" title="Active playgroup"></select>
      </div>
      <div class="control-row">
        <input class="name-input" type="text" placeholder="Player name ($Name)"
               value="${escapeHtml(settings.playerName)}">
        <div class="segmented" data-role="gender"></div>
      </div>
      <div class="category-list"></div>
    </div>
  `)

  // Language toggle
  const languageBox = view.querySelector('[data-role="language"]')!
  for (const lang of ['en', 'de'] as Language[]) {
    const button = el<HTMLButtonElement>(
      `<button class="${lang === settings.language ? 'active' : ''}">${lang.toUpperCase()}</button>`,
    )
    button.addEventListener('click', () => {
      ctx.session.updateSettings({ language: lang })
      ctx.rerender()
    })
    languageBox.append(button)
  }

  // Playgroup selector
  const select = view.querySelector<HTMLSelectElement>('.playgroup-select')!
  select.append(el('<option value="">No playgroup</option>'))
  for (const group of playgroups) {
    const option = el<HTMLOptionElement>(
      `<option value="${group.id}">${escapeHtml(group.name)}</option>`,
    )
    option.selected = group.id === settings.activePlaygroupId
    select.append(option)
  }
  select.addEventListener('change', () => {
    ctx.session.updateSettings({ activePlaygroupId: select.value || null })
    ctx.rerender()
  })

  // Player name + gender (defaults used when a drawn speech needs them)
  const nameInput = view.querySelector<HTMLInputElement>('.name-input')!
  nameInput.addEventListener('change', () => {
    ctx.session.updateSettings({ playerName: nameInput.value })
  })
  const genderBox = view.querySelector('[data-role="gender"]')!
  for (const { value, label } of GENDERS) {
    const button = el<HTMLButtonElement>(
      `<button class="${value === settings.gender ? 'active' : ''}">${label}</button>`,
    )
    button.addEventListener('click', () => {
      ctx.session.updateSettings({ playerName: nameInput.value, gender: value })
      ctx.rerender()
    })
    genderBox.append(button)
  }

  // Category buttons
  const list = view.querySelector('.category-list')!
  const categories = ctx.content.getCategories()
  if (categories.length === 0) {
    list.append(el('<p class="hint">No categories yet — add one in the Library tab.</p>'))
  }
  for (const category of categories) {
    const { available, total } = ctx.content.countAvailable(
      category.id,
      settings.language,
      usedGroupIds,
    )
    const button = el<HTMLButtonElement>(`
      <button class="category-button">
        <span class="category-name">${escapeHtml(category.name)}</span>
        <span class="category-count">${available} / ${total}</span>
      </button>
    `)
    button.addEventListener('click', () => draw(ctx, category.id))
    list.append(button)
  }

  container.append(view)
}

// --- Reading screen: the drawn speech, large and readable ---

function renderReading(container: HTMLElement, ctx: AppContext): void {
  const categoryId = state.categoryId!
  const category = ctx.content.getCategory(categoryId)
  const settings = ctx.session.getSettings()
  const speech = state.speechId !== null ? ctx.content.getSpeech(state.speechId) : undefined
  const hasPlaygroup = ctx.session.getActivePlaygroup() !== null

  const view = el(`
    <div class="reading">
      <header class="reading-header">
        <button class="ghost back-button">‹ Back</button>
        <span class="reading-category">${escapeHtml(category?.name ?? '')}</span>
      </header>
    </div>
  `)
  view.querySelector('.back-button')!.addEventListener('click', () => {
    state.mode = 'pick'
    state.speechId = null
    ctx.rerender()
  })

  if (speech === undefined) {
    // Exhausted: only already-heard stories remain for this playgroup.
    const groupName = ctx.session.getActivePlaygroup()?.name ?? 'this playgroup'
    const notice = el(`
      <div class="exhausted">
        <p>${escapeHtml(groupName)} has heard every ${settings.language.toUpperCase()} speech in this category.</p>
        <button class="primary" data-role="repeat">Draw anyway (repeat)</button>
        <p class="hint">You can also reset this playgroup's memory in the Groups tab, or add new speeches in the Library.</p>
      </div>
    `)
    notice.querySelector('[data-role="repeat"]')!.addEventListener('click', () => {
      const repeat = ctx.content.drawAllowingRepeats(categoryId, settings.language)
      if (repeat !== null) {
        state.speechId = repeat.id
        state.isRepeat = true
        ctx.rerender()
      }
    })
    view.append(notice)
    container.append(view)
    return
  }

  const article = el(`<article class="speech-text"></article>`)
  const renderText = () => {
    const current = ctx.session.getSettings()
    article.innerHTML = speechToHtml(
      resolvePlaceholders(speech.text, {
        name: current.playerName,
        gender: current.gender,
      }),
    )
  }
  renderText()

  // Compact name/gender controls, only when the speech asks for them.
  if (/\$name|\{[^{}|\n]*\|/i.test(speech.text)) {
    const controls = el(`
      <div class="control-row compact">
        <input class="name-input" type="text" placeholder="Player name ($Name)"
               value="${escapeHtml(settings.playerName)}">
        <div class="segmented" data-role="gender"></div>
      </div>
    `)
    const nameInput = controls.querySelector<HTMLInputElement>('.name-input')!
    nameInput.addEventListener('input', () => {
      ctx.session.updateSettings({ playerName: nameInput.value })
      renderText()
    })
    const genderBox = controls.querySelector('[data-role="gender"]')!
    for (const { value, label } of GENDERS) {
      const button = el<HTMLButtonElement>(
        `<button class="${value === ctx.session.getSettings().gender ? 'active' : ''}">${label}</button>`,
      )
      button.addEventListener('click', () => {
        ctx.session.updateSettings({ gender: value })
        genderBox.querySelectorAll('button').forEach((b) => b.classList.remove('active'))
        button.classList.add('active')
        renderText()
      })
      genderBox.append(button)
    }
    view.append(controls)
  }

  view.append(article)

  if (state.isRepeat) {
    view.append(el('<p class="hint">⟳ This speech was already heard by this playgroup.</p>'))
  }

  const actions = el('<div class="reading-actions"></div>')
  const again = el<HTMLButtonElement>('<button>🎲 Draw another</button>')
  again.addEventListener('click', () => {
    skippedSet(categoryId, settings.language).add(speech.id)
    draw(ctx, categoryId)
  })
  actions.append(again)

  if (hasPlaygroup) {
    const mark = el<HTMLButtonElement>(
      state.marked
        ? '<button class="primary" disabled>Marked as heard ✓</button>'
        : '<button class="primary">✓ Mark as heard</button>',
    )
    mark.addEventListener('click', () => {
      ctx.session.markUsed(speech.groupId)
      state.marked = true
      ctx.rerender()
    })
    actions.append(mark)
  } else {
    view.append(el('<p class="hint">No playgroup selected — usage is not tracked.</p>'))
  }
  view.append(actions)
  container.append(view)
}
