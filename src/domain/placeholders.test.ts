import { describe, expect, it } from 'vitest'
import { hasUnresolvedName, resolvePlaceholders } from './placeholders.ts'

describe('resolvePlaceholders', () => {
  it('replaces $Name with the player name', () => {
    expect(
      resolvePlaceholders('$Name is dead. Poor $Name.', {
        name: 'Anna',
        gender: 'f',
      }),
    ).toBe('Anna is dead. Poor Anna.')
  })

  it('accepts lowercase $name and trims the input name', () => {
    expect(
      resolvePlaceholders('$name laughs.', { name: '  Bob ', gender: 'm' }),
    ).toBe('Bob laughs.')
  })

  it('leaves $Name untouched when no name is given', () => {
    expect(
      resolvePlaceholders('$Name is dead.', { name: '', gender: 'm' }),
    ).toBe('$Name is dead.')
  })

  it('picks the gender variant m|f|n', () => {
    const text = '{He|She|They} drowned in {his|her|their} own reflection.'
    expect(resolvePlaceholders(text, { name: '', gender: 'm' })).toBe(
      'He drowned in his own reflection.',
    )
    expect(resolvePlaceholders(text, { name: '', gender: 'f' })).toBe(
      'She drowned in her own reflection.',
    )
    expect(resolvePlaceholders(text, { name: '', gender: 'n' })).toBe(
      'They drowned in their own reflection.',
    )
  })

  it('falls back to the first form when neutral is missing', () => {
    expect(resolvePlaceholders('{er|sie} lacht', { name: '', gender: 'n' })).toBe(
      'er lacht',
    )
  })

  it('ignores braces without pipes', () => {
    expect(
      resolvePlaceholders('a {weird} brace', { name: '', gender: 'm' }),
    ).toBe('a {weird} brace')
  })
})

describe('hasUnresolvedName', () => {
  it('detects a remaining $Name token', () => {
    expect(hasUnresolvedName('$Name is dead')).toBe(true)
    expect(hasUnresolvedName('Anna is dead')).toBe(false)
  })
})
