import { describe, it, expect, vi } from 'vitest'
import { ConversationCompletionTool } from '../tools/conversation-completion-tool.js'

describe('ConversationCompletionTool', () => {
  it('should have correct description and parameters', () => {
    expect(ConversationCompletionTool.description).toContain(
      'detect when a conversation appears to be naturally finished',
    )
    expect(ConversationCompletionTool.parameters).toBeDefined()
  })

  it('should execute with high confidence completion', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await ConversationCompletionTool.execute({
      reason: 'User said goodbye',
      confidence: 0.9,
      lastUserMessage: 'Thanks, goodbye!',
    })

    expect(result).toContain(
      'Conversation marked as complete with high confidence',
    )
    expect(result).toContain('0.9')
    expect(result).toContain('Thank you for using our chatbot!')

    consoleSpy.mockRestore()
  })

  it('should execute with medium confidence completion', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await ConversationCompletionTool.execute({
      reason: 'User seems satisfied',
      confidence: 0.7,
      lastUserMessage: 'That helps, thanks',
    })

    expect(result).toContain('Conversation possibly complete')
    expect(result).toContain('0.7')
    expect(result).toContain('Is there anything else I can help you with?')

    consoleSpy.mockRestore()
  })

  it('should execute with low confidence completion', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await ConversationCompletionTool.execute({
      reason: 'Uncertain completion signal',
      confidence: 0.3,
      lastUserMessage: 'Ok',
    })

    expect(result).toContain('Low confidence conversation completion detected')
    expect(result).toContain('0.3')
    expect(result).toContain('Continuing conversation')

    consoleSpy.mockRestore()
  })

  it('should log completion data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await ConversationCompletionTool.execute({
      reason: 'Test reason',
      confidence: 0.8,
      lastUserMessage: 'Test message',
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Conversation completion detected:',
      expect.objectContaining({
        reason: 'Test reason',
        confidence: 0.8,
        lastUserMessage: 'Test message',
        timestamp: expect.any(String),
      }),
    )

    consoleSpy.mockRestore()
  })
})
