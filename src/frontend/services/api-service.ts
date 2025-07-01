import { ChatMessage } from '../types/chat.js';

const API_BASE_URL = 'http://localhost:3001/api';

export interface CreatePromptRequest {
  context: string;
}

export interface CreatePromptResponse {
  prompt: string;
}

// Legacy API service for backward compatibility
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
    const response = await this.request<CreatePromptResponse>('/ai/create-prompt', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.prompt;
  }
}
