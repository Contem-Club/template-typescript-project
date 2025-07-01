import { describe, it, expect } from 'vitest'
import { PromptService } from '../services/prompt-service.js'

describe('PromptService Template Functionality', () => {
  const promptService = new PromptService()

  describe('createPromptFromTemplate', () => {
    it('should replace {contexts} placeholder with all contexts', () => {
      const request = {
        contexts: ['Context 1 content', 'Context 2 content'],
        template: 'System prompt with {contexts} here.',
      }

      const result = promptService.createPromptFromTemplate(request)

      expect(result).toContain('Context 1: Context 1 content')
      expect(result).toContain('Context 2: Context 2 content')
      expect(result).not.toContain('{contexts}')
    })

    it('should replace individual context placeholders', () => {
      const request = {
        contexts: ['First context', 'Second context'],
        template: 'Use {context1} and {context2} separately.',
      }

      const result = promptService.createPromptFromTemplate(request)

      expect(result).toContain('First context')
      expect(result).toContain('Second context')
      expect(result).not.toContain('{context1}')
      expect(result).not.toContain('{context2}')
    })

    it('should handle empty contexts array', () => {
      const request = {
        contexts: [],
        template: 'Template with {contexts} placeholder.',
      }

      const result = promptService.createPromptFromTemplate(request)

      expect(result).toBe('Template with  placeholder.')
    })

    it('should handle template without placeholders', () => {
      const request = {
        contexts: ['Some context'],
        template: 'Simple template without placeholders.',
      }

      const result = promptService.createPromptFromTemplate(request)

      expect(result).toBe('Simple template without placeholders.')
    })

    it('should filter out empty contexts', () => {
      const request = {
        contexts: ['Valid context', '', '  ', 'Another valid context'],
        template: 'Template with {contexts}.',
      }

      const result = promptService.createPromptFromTemplate(request)

      expect(result).toContain('Context 1: Valid context')
      expect(result).toContain('Context 2: Another valid context')
      expect(result).not.toContain('Context 3:')
    })

    it('should handle mixed placeholders', () => {
      const request = {
        contexts: ['First', 'Second', 'Third'],
        template:
          'All: {contexts}\nFirst only: {context1}\nSecond only: {context2}',
      }

      const result = promptService.createPromptFromTemplate(request)

      expect(result).toContain('Context 1: First')
      expect(result).toContain('Context 2: Second')
      expect(result).toContain('Context 3: Third')
      expect(result).toContain('First only: First')
      expect(result).toContain('Second only: Second')
    })
  })
})
