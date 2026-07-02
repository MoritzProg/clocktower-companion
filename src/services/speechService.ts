import type { AppRepository } from '../data/repository.ts'
import type { DrawResult } from '../domain/selection.ts'
import {
  availableSpeeches,
  drawSpeech,
  drawUsedSpeech,
} from '../domain/selection.ts'
import type { Category, Language, Speech } from '../domain/types.ts'
import { newId } from '../domain/types.ts'

export interface NewSpeechInput {
  categoryId: string
  language: Language
  text: string
  /** groupId of an existing story to mark this speech as its translation. */
  groupId?: string
}

const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', de: 'German' }

/** Content use-cases: speech/category CRUD, drawing, AI prompt building. */
export class SpeechService {
  private readonly repo: AppRepository

  constructor(repo: AppRepository) {
    this.repo = repo
  }

  // --- Reading ---

  getCategories(): Category[] {
    return this.repo.getCategories()
  }

  getCategory(id: string): Category | undefined {
    return this.repo.getCategories().find((c) => c.id === id)
  }

  getSpeeches(): Speech[] {
    return this.repo.getSpeeches()
  }

  getSpeech(id: string): Speech | undefined {
    return this.repo.getSpeeches().find((s) => s.id === id)
  }

  /** All language versions of a story. */
  getGroup(groupId: string): Speech[] {
    return this.repo.getSpeeches().filter((s) => s.groupId === groupId)
  }

  countAvailable(
    categoryId: string,
    language: Language,
    usedGroupIds: ReadonlySet<string>,
  ): { available: number; total: number } {
    const all = this.repo.getSpeeches()
    const total = all.filter(
      (s) => s.categoryId === categoryId && s.language === language,
    ).length
    const available = availableSpeeches(all, {
      categoryId,
      language,
      usedGroupIds,
    }).length
    return { available, total }
  }

  // --- Drawing ---

  draw(
    categoryId: string,
    language: Language,
    usedGroupIds: ReadonlySet<string>,
    skippedSpeechIds: ReadonlySet<string>,
  ): DrawResult {
    return drawSpeech(this.repo.getSpeeches(), {
      categoryId,
      language,
      usedGroupIds,
      skippedSpeechIds,
    })
  }

  drawAllowingRepeats(categoryId: string, language: Language): Speech | null {
    return drawUsedSpeech(this.repo.getSpeeches(), { categoryId, language })
  }

  // --- Speech CRUD ---

  addSpeech(input: NewSpeechInput): Speech {
    const speech: Speech = {
      id: newId('speech'),
      groupId: input.groupId ?? newId('group'),
      categoryId: input.categoryId,
      language: input.language,
      text: input.text.trim(),
    }
    this.repo.saveSpeeches([...this.repo.getSpeeches(), speech])
    return speech
  }

  updateSpeech(id: string, changes: Partial<Omit<Speech, 'id'>>): void {
    this.repo.saveSpeeches(
      this.repo.getSpeeches().map((s) => (s.id === id ? { ...s, ...changes } : s)),
    )
  }

  deleteSpeech(id: string): void {
    this.repo.saveSpeeches(this.repo.getSpeeches().filter((s) => s.id !== id))
  }

  /** Speeches in the same category and another language — candidates to link a new speech to as a translation. */
  translationCandidates(categoryId: string, language: Language): Speech[] {
    return this.repo
      .getSpeeches()
      .filter((s) => s.categoryId === categoryId && s.language !== language)
  }

  // --- Category CRUD ---

  addCategory(name: string, usesPlayerName: boolean): Category {
    const category: Category = { id: newId('cat'), name: name.trim(), usesPlayerName }
    this.repo.saveCategories([...this.repo.getCategories(), category])
    return category
  }

  updateCategory(id: string, changes: Partial<Omit<Category, 'id'>>): void {
    this.repo.saveCategories(
      this.repo
        .getCategories()
        .map((c) => (c.id === id ? { ...c, ...changes } : c)),
    )
  }

  /** Deletes the category and all of its speeches. */
  deleteCategory(id: string): void {
    this.repo.saveCategories(this.repo.getCategories().filter((c) => c.id !== id))
    this.repo.saveSpeeches(
      this.repo.getSpeeches().filter((s) => s.categoryId !== id),
    )
  }

  countSpeechesInCategory(categoryId: string): number {
    return this.repo.getSpeeches().filter((s) => s.categoryId === categoryId).length
  }

  // --- AI assistance ---

  /**
   * Builds a writing prompt for any AI chatbot: category, style examples
   * from the existing collection, placeholder syntax, target language.
   */
  buildAiPrompt(categoryId: string, language: Language): string {
    const category = this.getCategory(categoryId)
    const categoryName = category?.name ?? categoryId
    const targetsPlayer = category?.usesPlayerName ?? true

    const pool = this.repo
      .getSpeeches()
      .filter((s) => s.categoryId === categoryId && s.language === language)
    const examples = [...pool].sort(() => Math.random() - 0.5).slice(0, 3)

    const lines = [
      'You are helping a storyteller for the social deduction game "Blood on the Clocktower" write short, atmospheric speeches to read aloud during a game. The setting is the gothic town of Ravenswood Bluff.',
      '',
      `Write 3 new speeches in ${LANGUAGE_NAMES[language]} for the category "${categoryName}".`,
      '',
    ]
    if (examples.length > 0) {
      lines.push('Match the tone and length of these examples from my collection:', '')
      for (const example of examples) {
        lines.push('---', example.text)
      }
      lines.push('---', '')
    }
    lines.push('Guidelines:')
    lines.push('- Short enough to read aloud in well under a minute.')
    if (targetsPlayer) {
      lines.push(
        '- Use the placeholder $Name wherever the affected player is named.',
        '- For gendered words use {masculine|feminine|neutral} variants, e.g. {he|she|they} or {his|her|their}.',
      )
    } else {
      lines.push(
        '- These speeches address the whole town, not a single player — do not use $Name.',
      )
    }
    lines.push(
      '- Return only the speeches themselves, separated by a line containing exactly ---',
    )
    return lines.join('\n')
  }
}
