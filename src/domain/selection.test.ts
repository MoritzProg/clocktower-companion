import { describe, expect, it } from 'vitest'
import { availableSpeeches, drawSpeech, drawUsedSpeech } from './selection.ts'
import type { Speech } from './types.ts'

function speech(id: string, groupId: string, language: 'en' | 'de' = 'en'): Speech {
  return { id, groupId, categoryId: 'exec', language, text: id }
}

const speeches: Speech[] = [
  speech('a-en', 'a'),
  speech('a-de', 'a', 'de'),
  speech('b-en', 'b'),
  speech('c-de', 'c', 'de'),
]

describe('availableSpeeches', () => {
  it('filters by category and language', () => {
    const result = availableSpeeches(speeches, {
      categoryId: 'exec',
      language: 'en',
      usedGroupIds: new Set(),
    })
    expect(result.map((s) => s.id)).toEqual(['a-en', 'b-en'])
  })

  it('excludes used translation groups across languages', () => {
    const result = availableSpeeches(speeches, {
      categoryId: 'exec',
      language: 'de',
      usedGroupIds: new Set(['a']), // used the English version
    })
    expect(result.map((s) => s.id)).toEqual(['c-de'])
  })
})

describe('drawSpeech', () => {
  it('never draws a used group', () => {
    const { speech: drawn, exhausted } = drawSpeech(speeches, {
      categoryId: 'exec',
      language: 'en',
      usedGroupIds: new Set(['a']),
    })
    expect(drawn?.id).toBe('b-en')
    expect(exhausted).toBe(false)
  })

  it('reports exhaustion when every group is used', () => {
    const { speech: drawn, exhausted } = drawSpeech(speeches, {
      categoryId: 'exec',
      language: 'en',
      usedGroupIds: new Set(['a', 'b']),
    })
    expect(drawn).toBeNull()
    expect(exhausted).toBe(true)
  })

  it('ignores the skip list once everything unused is skipped', () => {
    const { speech: drawn } = drawSpeech(speeches, {
      categoryId: 'exec',
      language: 'en',
      usedGroupIds: new Set(['a']),
      skippedSpeechIds: new Set(['b-en']),
    })
    expect(drawn?.id).toBe('b-en')
  })
})

describe('drawUsedSpeech', () => {
  it('draws among all speeches of the category/language', () => {
    const drawn = drawUsedSpeech(speeches, { categoryId: 'exec', language: 'de' })
    expect(['a-de', 'c-de']).toContain(drawn?.id)
  })
})
