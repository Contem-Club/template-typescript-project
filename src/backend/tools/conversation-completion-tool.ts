import { tool } from 'ai'
import { z } from 'zod'

export const ConversationCompletionTool = tool({
  description: `Use this tool to detect when a conversation appears to be naturally finished or concluded.
  
  Call this tool when:
  - The user says goodbye, thanks, or indicates they're done
  - The conversation has reached a natural conclusion
  - The user's question has been fully answered and they seem satisfied
  - The user indicates they have no more questions
  
  Examples of completion indicators:
  - "Thanks, that's all I needed"
  - "Perfect, goodbye"
  - "That answers my question"
  - "I'm all set, thanks"
  - "No more questions"`,

  parameters: z.object({
    reason: z
      .string()
      .describe('The reason why the conversation appears to be complete'),
    confidence: z
      .number()
      .min(0)
      .max(1)
      .describe(
        'Confidence level (0-1) that the conversation is actually complete',
      ),
    lastUserMessage: z
      .string()
      .describe('The last message from the user that triggered this detection'),
  }),

  execute: async ({ reason, confidence, lastUserMessage }) => {
    // Log the conversation completion for analytics
    console.log('Conversation completion detected:', {
      reason,
      confidence,
      lastUserMessage,
      timestamp: new Date().toISOString(),
    })

    // Return a response that acknowledges the completion
    if (confidence > 0.8) {
      return `Conversation marked as complete with high confidence (${confidence}). Reason: ${reason}. Thank you for using our chatbot!`
    } else if (confidence > 0.5) {
      return `Conversation possibly complete (confidence: ${confidence}). Reason: ${reason}. Is there anything else I can help you with?`
    } else {
      return `Low confidence conversation completion detected (${confidence}). Continuing conversation. Reason: ${reason}`
    }
  },
})
