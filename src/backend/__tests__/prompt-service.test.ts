import { describe, it, expect } from 'vitest';
import { PromptService } from '../services/prompt-service.js';

describe('PromptService', () => {
  it('should create a prompt with context', () => {
    const promptService = new PromptService();
    const context = 'This is test context about cats';
    
    const result = promptService.createPrompt(context);
    
    expect(result).toContain(context);
    expect(result).toContain('You are a helpful AI assistant');
    expect(result).not.toContain('{CONTEXT}');
  });

  it('should handle empty context', () => {
    const promptService = new PromptService();
    const context = '';
    
    const result = promptService.createPrompt(context);
    
    expect(result).toContain('You are a helpful AI assistant');
    expect(result).not.toContain('{CONTEXT}');
  });

  it('should trim whitespace from context', () => {
    const promptService = new PromptService();
    const context = '  This is test context with whitespace  ';
    
    const result = promptService.createPrompt(context);
    
    expect(result).toContain('This is test context with whitespace');
    expect(result).not.toContain('  This is test context with whitespace  ');
  });
});
