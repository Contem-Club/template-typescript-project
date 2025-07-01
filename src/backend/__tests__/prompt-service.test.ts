import { describe, it, expect } from 'vitest'
import { PromptService } from '../services/prompt-service.js'

describe('PromptService', () => {
  it('should create a prompt with context', () => {
    const promptService = new PromptService()
    const context = 'This is test context about cats'

    const result = promptService.createPrompt(context)

    expect(result).toContain(context)
    expect(result).toContain('You are a helpful AI assistant')
    expect(result).not.toContain('{CONTEXT}')
  })

  it('should handle empty context', () => {
    const promptService = new PromptService()
    const context = ''

    const result = promptService.createPrompt(context)

    expect(result).toContain('You are a helpful AI assistant')
    expect(result).not.toContain('{CONTEXT}')
    expect(result).not.toContain('Context:')
    expect(result).toContain(
      'Please respond to user queries in a helpful, accurate, and engaging manner',
    )
  })

  it('should trim whitespace from context', () => {
    const promptService = new PromptService()
    const context = '  This is test context with whitespace  '

    const result = promptService.createPrompt(context)

    expect(result).toContain('This is test context with whitespace')
    expect(result).not.toContain('  This is test context with whitespace  ')
  })

  it('should handle whitespace-only context as empty', () => {
    const promptService = new PromptService()
    const context = '   \n\t   '

    const result = promptService.createPrompt(context)

    expect(result).toContain('You are a helpful AI assistant')
    expect(result).not.toContain('{CONTEXT}')
    expect(result).not.toContain('Context:')
    expect(result).toContain(
      'Please respond to user queries in a helpful, accurate, and engaging manner',
    )
  })
})
