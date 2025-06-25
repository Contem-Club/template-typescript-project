import { ChatMessage } from '../types/chat.js';

const API_BASE_URL = 'http://localhost:3001/api';

export interface CreatePromptRequest {
  context: string;
}

export interface CreatePromptResponse {
  prompt: string;
}

export interface GenerateResponseRequest {
  chatHistory: ChatMessage[];
  prompt: string;
}

export interface GenerateResponseResponse {
  message: ChatMessage;
}

export class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createPrompt(context: string): Promise<string> {
    const request: CreatePromptRequest = { context };
    const response = await this.request<CreatePromptResponse>('/chat/create-prompt', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.prompt;
  }

  async generateResponse(chatHistory: ChatMessage[], prompt: string): Promise<ChatMessage> {
    const request: GenerateResponseRequest = { chatHistory, prompt };
    const response = await this.request<GenerateResponseResponse>('/chat/generate-response', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.message;
  }
}
