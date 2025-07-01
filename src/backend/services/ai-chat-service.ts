import { streamText, type CoreMessage } from 'ai'
import { createGoogleAI } from '../config/ai-config.js'
import {
  ConversationCompletionTool,
  ToolUsageGatheringTool,
} from '../tools/index.js'

export interface IAIChatService {
  generateStreamingResponse(
    messages: CoreMessage[],
    systemPrompt: string,
  ): Promise<any>
}

export class AIChatService implements IAIChatService {
  private googleAI

  constructor() {
    this.googleAI = createGoogleAI()
  }

  async generateStreamingResponse(
    messages: CoreMessage[],
    systemPrompt: string,
  ) {
    try {
      const result = streamText({
        model: this.googleAI.model,
        system: systemPrompt,
        messages,
        tools: {
          conversationCompletion: ConversationCompletionTool,
          toolUsageGathering: ToolUsageGatheringTool,
        },
        maxSteps: this.googleAI.config.maxSteps,
        experimental_providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: this.googleAI.config.thinkingBudget,
            },
          },
        },
      })

      return result
    } catch (error) {
      console.error('Error generating streaming response:', error)
      throw new Error('Failed to generate streaming response')
    }
  }
}
