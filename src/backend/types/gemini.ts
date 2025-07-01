export interface GeminiConfig {
  apiKey: string
  model?: string
}

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export interface GeminiRequest {
  contents: GeminiMessage[]
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
      role: string
    }
  }>
}

export interface IGeminiClient {
  generateContent(messages: GeminiMessage[]): Promise<string>
}
