// localStorage utility functions for chat playground

const STORAGE_KEYS = {
  CONTEXTS: 'chat-playground-contexts',
  SYSTEM_PROMPT_TEMPLATE: 'chat-playground-system-prompt-template',
} as const;

// Generic localStorage functions with error handling
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

// Specific functions for chat playground data
export const saveContexts = (contexts: string[]): void => {
  saveToLocalStorage(STORAGE_KEYS.CONTEXTS, contexts);
};

export const loadContexts = (): string[] => {
  return loadFromLocalStorage(STORAGE_KEYS.CONTEXTS, []);
};

export const saveSystemPromptTemplate = (template: string): void => {
  saveToLocalStorage(STORAGE_KEYS.SYSTEM_PROMPT_TEMPLATE, template);
};

export const loadSystemPromptTemplate = (): string => {
  return loadFromLocalStorage(STORAGE_KEYS.SYSTEM_PROMPT_TEMPLATE, '');
};

export const clearAllChatPlaygroundData = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.CONTEXTS);
  removeFromLocalStorage(STORAGE_KEYS.SYSTEM_PROMPT_TEMPLATE);
};

export const clearContexts = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.CONTEXTS);
};

export const clearSystemPromptTemplate = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.SYSTEM_PROMPT_TEMPLATE);
};
