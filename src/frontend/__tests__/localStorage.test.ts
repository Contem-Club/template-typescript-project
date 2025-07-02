import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveContexts,
  loadContexts,
  saveSystemPromptTemplate,
  loadSystemPromptTemplate,
  clearAllChatPlaygroundData,
  clearContexts,
  clearSystemPromptTemplate,
} from '../utils/localStorage.js';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock global localStorage for Node.js environment
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('localStorage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('contexts', () => {
    it('should save contexts to localStorage', () => {
      const contexts = ['context1', 'context2'];
      saveContexts(contexts);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'chat-playground-contexts',
        JSON.stringify(contexts)
      );
    });

    it('should load contexts from localStorage', () => {
      const contexts = ['context1', 'context2'];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(contexts));
      
      const result = loadContexts();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('chat-playground-contexts');
      expect(result).toEqual(contexts);
    });

    it('should return empty array when no contexts in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadContexts();
      
      expect(result).toEqual([]);
    });

    it('should clear contexts from localStorage', () => {
      clearContexts();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('chat-playground-contexts');
    });
  });

  describe('system prompt template', () => {
    it('should save template to localStorage', () => {
      const template = 'Test template with {contexts}';
      saveSystemPromptTemplate(template);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'chat-playground-system-prompt-template',
        JSON.stringify(template)
      );
    });

    it('should load template from localStorage', () => {
      const template = 'Test template with {contexts}';
      localStorageMock.getItem.mockReturnValue(JSON.stringify(template));
      
      const result = loadSystemPromptTemplate();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('chat-playground-system-prompt-template');
      expect(result).toEqual(template);
    });

    it('should return empty string when no template in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadSystemPromptTemplate();
      
      expect(result).toBe('');
    });

    it('should clear template from localStorage', () => {
      clearSystemPromptTemplate();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('chat-playground-system-prompt-template');
    });
  });

  describe('clear all data', () => {
    it('should clear all chat playground data', () => {
      clearAllChatPlaygroundData();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('chat-playground-contexts');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('chat-playground-system-prompt-template');
    });
  });

  describe('error handling', () => {
    it('should handle JSON parse errors gracefully when loading contexts', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = loadContexts();
      
      expect(result).toEqual([]);
    });

    it('should handle JSON parse errors gracefully when loading template', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = loadSystemPromptTemplate();
      
      expect(result).toBe('');
    });
  });
});
