import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAIConfig, createGoogleAI } from '../config/ai-config.js'

describe('AI Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getAIConfig', () => {
    it('should return config with required environment variables', () => {
      process.env.GEMINI_API_KEY = 'test-api-key'
      process.env.GEMINI_MODEL = 'gemini-1.5-flash'
      process.env.AI_MAX_STEPS = '3'
      process.env.AI_THINKING_BUDGET = '1024'

      const config = getAIConfig()

      expect(config).toEqual({
        apiKey: 'test-api-key',
        model: 'gemini-1.5-flash',
        maxSteps: 3,
        thinkingBudget: 1024,
      })
    })

    it('should use default values when optional env vars are not set', () => {
      process.env.GEMINI_API_KEY = 'test-api-key'
      delete process.env.GEMINI_MODEL
      delete process.env.AI_MAX_STEPS
      delete process.env.AI_THINKING_BUDGET

      const config = getAIConfig()

      expect(config).toEqual({
        apiKey: 'test-api-key',
        model: 'gemini-1.5-flash',
        maxSteps: 5,
        thinkingBudget: 2048,
      })
    })

    it('should throw error when GEMINI_API_KEY is not set', () => {
      delete process.env.GEMINI_API_KEY

      expect(() => getAIConfig()).toThrow(
        'GEMINI_API_KEY environment variable is required',
      )
    })

    it('should parse numeric environment variables correctly', () => {
      process.env.GEMINI_API_KEY = 'test-api-key'
      process.env.AI_MAX_STEPS = '10'
      process.env.AI_THINKING_BUDGET = '4096'

      const config = getAIConfig()

      expect(config.maxSteps).toBe(10)
      expect(config.thinkingBudget).toBe(4096)
    })
  })

  describe('createGoogleAI', () => {
    it('should create Google AI instance with correct configuration', () => {
      process.env.GEMINI_API_KEY = 'test-api-key'
      process.env.GEMINI_MODEL = 'gemini-1.5-pro'

      const googleAI = createGoogleAI()

      expect(googleAI.google).toBeDefined()
      expect(googleAI.model).toBeDefined()
      expect(googleAI.config).toBeDefined()
      expect(googleAI.config.apiKey).toBe('test-api-key')
      expect(googleAI.config.model).toBe('gemini-1.5-pro')
    })
  })
})
