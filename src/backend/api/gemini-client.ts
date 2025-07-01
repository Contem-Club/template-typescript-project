import { GoogleGenerativeAI } from '@google/generative-ai'
import { IGeminiClient, GeminiConfig, GeminiMessage } from '../types/gemini.js'

export class GeminiClient implements IGeminiClient {
  private genAI: GoogleGenerativeAI
  private model: string

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey)
    this.model = config.model || 'gemini-1.5-flash'
  }

  async generateContent(messages: GeminiMessage[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model })

      // Convert our message format to Gemini's expected format
      const contents = messages.map((msg) => ({
        role: msg.role,
        parts: msg.parts,
      }))

      const result = await model.generateContent({
        contents,
      })

      const response = await result.response
      const text = response.text()

      return text
    } catch (error) {
      console.error('Error generating content with Gemini:', error)
      throw new Error('Failed to generate content from Gemini API')
    }
  }
}
