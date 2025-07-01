import { ChatMessage } from '../types/chat.js'
import { IGeminiClient, GeminiMessage } from '../types/gemini.js'
import { v4 as uuidv4 } from 'uuid'

export interface IChatService {
  generateResponse(
    chatHistory: ChatMessage[],
    systemPrompt: string,
    userMessage: string,
  ): Promise<ChatMessage>
}

export class ChatService implements IChatService {
  constructor(private geminiClient: IGeminiClient) {}

  async generateResponse(
    chatHistory: ChatMessage[],
    systemPrompt: string,
    userMessage: string,
  ): Promise<ChatMessage> {
    try {
      // Convert chat history to Gemini format
      const geminiMessages: GeminiMessage[] = []

      // Add system prompt as the first message
      geminiMessages.push({
        role: 'user',
        parts: [{ text: systemPrompt }],
      })

      // Add chat history
      for (const message of chatHistory) {
        geminiMessages.push({
          role: message.role === 'user' ? 'user' : 'model',
          parts: [{ text: message.content }],
        })
      }

      // Add the new user message
      geminiMessages.push({
        role: 'user',
        parts: [{ text: userMessage }],
      })

      // Generate response from Gemini
      const responseText =
        await this.geminiClient.generateContent(geminiMessages)

      // Create response message
      const responseMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      }

      return responseMessage
    } catch (error) {
      console.error('Error generating chat response:', error)
      throw new Error('Failed to generate chat response')
    }
  }
}
