import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeminiClient } from '../api/gemini-client.js'
import { GeminiMessage } from '../types/gemini.js'

// Mock the Google Generative AI module
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: vi.fn().mockReturnValue('Mocked AI response'),
        },
      }),
    }),
  })),
}))

describe('GeminiClient', () => {
  let geminiClient: GeminiClient

  beforeEach(() => {
    geminiClient = new GeminiClient({
      apiKey: 'test-api-key',
      model: 'gemini-1.5-flash',
    })
  })

  it('should generate content successfully', async () => {
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: 'Hello, how are you?' }],
      },
    ]

    const result = await geminiClient.generateContent(messages)

    expect(result).toBe('Mocked AI response')
  })

  it('should handle API errors gracefully', async () => {
    // Mock the generateContent to throw an error
    const mockModel = {
      generateContent: vi.fn().mockRejectedValue(new Error('API Error')),
    }

    const mockGenAI = {
      getGenerativeModel: vi.fn().mockReturnValue(mockModel),
    }

    // Replace the internal genAI instance
    ;(geminiClient as any).genAI = mockGenAI

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: 'Hello' }],
      },
    ]

    await expect(geminiClient.generateContent(messages)).rejects.toThrow(
      'Failed to generate content from Gemini API',
    )
  })
})
