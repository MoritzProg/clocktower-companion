import type { Language, Speech } from '../domain/types.ts'
import type { AppContext } from './context.ts'
import { el, escapeHtml, toast } from './dom.ts'

interface ManageState {
  mode: 'list' | 'form'
  /** null while creating a new speech */
  editingId: string | null
  filterCategoryId: string // 'all' or a category id
  filterLanguage: 'all' | Language
}

const state: ManageState = {
  mode: 'list',
  editingId: null,
  filterCategoryId: 'all',
  filterLanguage: 'all',
}

export function renderManageView(container: HTMLElement, ctx: AppContext): void {
  if (state.mode === 'form') renderForm(container, ctx)
  else renderList(container, ctx)
}

// --- List: filterable speech collection + category management ---

function renderList(container: HTMLElement, ctx: AppContext): void {
  const categories = ctx.content.getCategories()
  const view = el(`
    <div class="manage">
      <header class="view-header">
        <h2>Library</h2>
        <button class="primary" data-role="new">+ New speech</button>
      </header>
      <div class="control-row">
        <select data-role="filter-category"></select>
        <select data-role="filter-language">
          <option value="all">All languages</option>
          <option value="en">English</option>
          <option value="de">German</option>
        </select>
      </div>
      <div class="speech-list"></div>
      <section class="category-manager">
        <h3>Categories</h3>
        <div class="category-rows"></div>
        <div class="control-row">
          <input type="text" data-role="new-category" placeholder="New category name">
          <button data-role="add-category">Add</button>
        </div>
        <p class="hint">"Asks for player" shows the name/gender inputs when drawing.</p>
      </section>
    </div>
  `)

  view.querySelector('[data-role="new"]')!.addEventListener('click', () => {
    state.mode = 'form'
    state.editingId = null
    ctx.rerender()
  })

  // Filters
  const categoryFilter = view.querySelector<HTMLSelectElement>('[data-role="filter-category"]')!
  categoryFilter.append(el('<option value="all">All categories</option>'))
  for (const category of categories) {
    categoryFilter.append(
      el(`<option value="${category.id}">${escapeHtml(category.name)}</option>`),
    )
  }
  categoryFilter.value = state.filterCategoryId
  if (categoryFilter.value === '') categoryFilter.value = 'all' // filtered category was deleted
  categoryFilter.addEventListener('change', () => {
    state.filterCategoryId = categoryFilter.value
    ctx.rerender()
  })
  const languageFilter = view.querySelector<HTMLSelectElement>('[data-role="filter-language"]')!
  languageFilter.value = state.filterLanguage
  languageFilter.addEventListener('change', () => {
    state.filterLanguage = languageFilter.value as ManageState['filterLanguage']
    ctx.rerender()
  })

  // Speech cards
  const list = view.querySelector('.speech-list')!
  const speeches = ctx.content
    .getSpeeches()
    .filter(
      (s) =>
        (state.filterCategoryId === 'all' || s.categoryId === state.filterCategoryId) &&
        (state.filterLanguage === 'all' || s.language === state.filterLanguage),
    )
  if (speeches.length === 0) {
    list.append(el('<p class="hint">No speeches match this filter.</p>'))
  }
  for (const speech of speeches) {
    const category = ctx.content.getCategory(speech.categoryId)
    const linked = ctx.content.getGroup(speech.groupId).length > 1
    const preview = speech.text.replaceAll('\n', ' ').slice(0, 110)
    const card = el(`
      <button class="speech-card">
        <span class="tags">
          <span class="tag">${escapeHtml(category?.name ?? '?')}</span>
          <span class="tag">${speech.language.toUpperCase()}</span>
          ${linked ? '<span class="tag" title="Has a version in the other language">🔗</span>' : ''}
        </span>
        <span class="preview">${escapeHtml(preview)}${speech.text.length > 110 ? '…' : ''}</span>
      </button>
    `)
    card.addEventListener('click', () => {
      state.mode = 'form'
      state.editingId = speech.id
      ctx.rerender()
    })
    list.append(card)
  }

  // Category manager
  const rows = view.querySelector('.category-rows')!
  for (const category of categories) {
    const row = el(`
      <div class="category-row">
        <input type="text" value="${escapeHtml(category.name)}" title="Rename category">
        <label><input type="checkbox" ${category.usesPlayerName ? 'checked' : ''}> asks for player</label>
        <button class="ghost danger" title="Delete category">✕</button>
      </div>
    `)
    const [nameInput, checkbox] = row.querySelectorAll('input')
    nameInput.addEventListener('change', () => {
      ctx.content.updateCategory(category.id, { name: nameInput.value.trim() })
      ctx.rerender()
    })
    checkbox.addEventListener('change', () => {
      ctx.content.updateCategory(category.id, { usesPlayerName: checkbox.checked })
    })
    row.querySelector('button')!.addEventListener('click', () => {
      const count = ctx.content.countSpeechesInCategory(category.id)
      const message =
        count > 0
          ? `Delete "${category.name}" and its ${count} speeches?`
          : `Delete "${category.name}"?`
      if (confirm(message)) {
        ctx.content.deleteCategory(category.id)
        ctx.rerender()
      }
    })
    rows.append(row)
  }
  const newCategoryInput = view.querySelector<HTMLInputElement>('[data-role="new-category"]')!
  view.querySelector('[data-role="add-category"]')!.addEventListener('click', () => {
    const name = newCategoryInput.value.trim()
    if (name === '') return
    ctx.content.addCategory(name, true)
    ctx.rerender()
  })

  container.append(view)
}

// --- Form: create or edit a speech ---

function renderForm(container: HTMLElement, ctx: AppContext): void {
  const editing: Speech | undefined =
    state.editingId !== null ? ctx.content.getSpeech(state.editingId) : undefined
  const isNew = editing === undefined
  const categories = ctx.content.getCategories()
  const defaultCategoryId =
    editing?.categoryId ??
    (state.filterCategoryId !== 'all' ? state.filterCategoryId : categories[0]?.id ?? '')

  const view = el(`
    <div class="manage">
      <header class="view-header">
        <button class="ghost" data-role="cancel">‹ Back</button>
        <h2>${isNew ? 'New speech' : 'Edit speech'}</h2>
      </header>
      <div class="control-row">
        <select data-role="category"></select>
        <select data-role="language">
          <option value="en">English</option>
          <option value="de">German</option>
        </select>
      </div>
      ${isNew ? '<select data-role="translation-of"></select>' : ''}
      <textarea data-role="text" rows="12"
        placeholder="Speech text.&#10;&#10;Placeholders: $Name for the player, {he|she|they} for gender variants.&#10;${isNew ? 'Paste several speeches at once by separating them with a line containing only ---' : ''}"></textarea>
      <div class="reading-actions">
        <button data-role="ai-prompt" title="Copies a writing prompt for any AI chatbot">🪄 Copy AI prompt</button>
        ${isNew ? '' : '<button class="ghost danger" data-role="delete">Delete</button>'}
        <button class="primary" data-role="save">Save</button>
      </div>
      <p class="hint">The AI prompt includes style examples from your collection — paste it into any chatbot, then paste the results back here.</p>
    </div>
  `)

  const categorySelect = view.querySelector<HTMLSelectElement>('[data-role="category"]')!
  for (const category of categories) {
    categorySelect.append(
      el(`<option value="${category.id}">${escapeHtml(category.name)}</option>`),
    )
  }
  categorySelect.value = defaultCategoryId
  const languageSelect = view.querySelector<HTMLSelectElement>('[data-role="language"]')!
  languageSelect.value = editing?.language ?? ctx.session.getSettings().language
  const textArea = view.querySelector<HTMLTextAreaElement>('[data-role="text"]')!
  textArea.value = editing?.text ?? ''

  // "Translation of" links a new speech to an existing story in the other
  // language, so playgroups never hear the same story twice across languages.
  const translationSelect = view.querySelector<HTMLSelectElement>('[data-role="translation-of"]')
  const refreshTranslationOptions = () => {
    if (!translationSelect) return
    const candidates = ctx.content.translationCandidates(
      categorySelect.value,
      languageSelect.value as Language,
    )
    translationSelect.innerHTML = ''
    translationSelect.append(el('<option value="">Standalone (not a translation)</option>'))
    for (const candidate of candidates) {
      const preview = candidate.text.replaceAll('\n', ' ').slice(0, 60)
      translationSelect.append(
        el(
          `<option value="${candidate.groupId}">Translation of: ${escapeHtml(preview)}…</option>`,
        ),
      )
    }
  }
  refreshTranslationOptions()
  categorySelect.addEventListener('change', refreshTranslationOptions)
  languageSelect.addEventListener('change', refreshTranslationOptions)

  const close = () => {
    state.mode = 'list'
    state.editingId = null
    ctx.rerender()
  }
  view.querySelector('[data-role="cancel"]')!.addEventListener('click', close)

  view.querySelector('[data-role="ai-prompt"]')!.addEventListener('click', async () => {
    const prompt = ctx.content.buildAiPrompt(
      categorySelect.value,
      languageSelect.value as Language,
    )
    await navigator.clipboard.writeText(prompt)
    toast('AI writing prompt copied to clipboard')
  })

  view.querySelector('[data-role="save"]')!.addEventListener('click', () => {
    const text = textArea.value.trim()
    if (text === '' || categorySelect.value === '') return
    const language = languageSelect.value as Language
    if (isNew) {
      // Allow pasting several speeches at once, separated by --- lines.
      const parts = text.split(/^\s*---\s*$/m).map((p) => p.trim()).filter((p) => p !== '')
      const groupId = translationSelect?.value || undefined
      for (const part of parts) {
        ctx.content.addSpeech({
          categoryId: categorySelect.value,
          language,
          text: part,
          // A translation link only makes sense for a single speech.
          groupId: parts.length === 1 ? groupId : undefined,
        })
      }
      toast(parts.length > 1 ? `${parts.length} speeches added` : 'Speech added')
    } else {
      ctx.content.updateSpeech(editing.id, {
        categoryId: categorySelect.value,
        language,
        text,
      })
      toast('Speech saved')
    }
    close()
  })

  view.querySelector('[data-role="delete"]')?.addEventListener('click', () => {
    if (editing !== undefined && confirm('Delete this speech?')) {
      ctx.content.deleteSpeech(editing.id)
      close()
    }
  })

  container.append(view)
}
