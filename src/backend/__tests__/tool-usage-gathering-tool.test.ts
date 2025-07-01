import { describe, it, expect, vi } from 'vitest'
import { ToolUsageGatheringTool } from '../tools/tool-usage-gathering-tool.js'

describe('ToolUsageGatheringTool', () => {
  it('should have correct description and parameters', () => {
    expect(ToolUsageGatheringTool.description).toContain(
      'gather and store information about tools',
    )
    expect(ToolUsageGatheringTool.parameters).toBeDefined()
  })

  it('should execute with single tool data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const tools = [
      {
        name: 'Cursor',
        category: 'CODE_EDITOR' as const,
        usage: 'For AI-assisted coding',
        frequency: 'DAILY' as const,
        satisfaction: 'VERY_SATISFIED' as const,
        context: 'Uses it for TypeScript development',
      },
    ]

    const result = await ToolUsageGatheringTool.execute({
      tools,
      extractedFromMessage: 'I use Cursor daily for coding and love it',
    })

    expect(result).toContain('Gathered information about 1 tool(s): Cursor')
    expect(result).toContain('Thank you for sharing your tool usage!')

    consoleSpy.mockRestore()
  })

  it('should execute with multiple tools data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const tools = [
      {
        name: 'ChatGPT',
        category: 'AI_ASSISTANT' as const,
        usage: 'For code explanations',
        frequency: 'WEEKLY' as const,
        satisfaction: 'SATISFIED' as const,
        context: 'Helps with debugging',
      },
      {
        name: 'Augment Code',
        category: 'DEVELOPMENT_TOOL' as const,
        usage: 'For code analysis',
        frequency: 'DAILY' as const,
        satisfaction: 'VERY_SATISFIED' as const,
        context: 'Great for understanding codebases',
      },
    ]

    const result = await ToolUsageGatheringTool.execute({
      tools,
      extractedFromMessage: 'I use ChatGPT and Augment Code regularly',
    })

    expect(result).toContain(
      'Gathered information about 2 tool(s): ChatGPT, Augment Code',
    )

    consoleSpy.mockRestore()
  })

  it('should log tool usage data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const tools = [
      {
        name: 'VS Code',
        category: 'CODE_EDITOR' as const,
        usage: 'Primary editor',
        frequency: 'DAILY' as const,
        satisfaction: 'SATISFIED' as const,
        context: 'Main development environment',
      },
    ]

    await ToolUsageGatheringTool.execute({
      tools,
      extractedFromMessage: 'I use VS Code as my main editor',
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Tool usage data gathered:',
      expect.stringContaining('VS Code'),
    )

    consoleSpy.mockRestore()
  })

  it('should handle empty tools array', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await ToolUsageGatheringTool.execute({
      tools: [],
      extractedFromMessage: 'No specific tools mentioned',
    })

    expect(result).toContain('Gathered information about 0 tool(s):')

    consoleSpy.mockRestore()
  })
})
