import { describe, it, expect } from 'vitest'
import { add, subtract, formatGreeting } from '../utils.js'

describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(-1, 1)).toBe(0)
    expect(add(0, 0)).toBe(0)
  })

  it('should subtract numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2)
    expect(subtract(1, 1)).toBe(0)
    expect(subtract(0, 5)).toBe(-5)
  })
})

describe('String functions', () => {
  it('should format greeting correctly', () => {
    expect(formatGreeting('John')).toBe('Hello, John!')
    expect(formatGreeting('')).toBe('Hello, !')
  })
})
