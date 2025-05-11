import { describe, it, expect } from 'vitest'
import { formatGreeting } from '../src/utils.js'

describe('Root level tests', () => {
  it('should work with imports from src directory', () => {
    expect(formatGreeting('Root Test')).toBe('Hello, Root Test!')
  })

  it('should pass basic assertions', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
    expect({ name: 'test' }).toEqual({ name: 'test' })
  })
})
