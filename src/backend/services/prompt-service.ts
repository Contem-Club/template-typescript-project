export interface IPromptService {
  createPrompt(context: string): string;
}

export class PromptService implements IPromptService {
  private readonly systemPrompt: string;

  constructor() {
    this.systemPrompt = `You are a helpful AI assistant. Use the following context to provide accurate and relevant responses.

Context: {CONTEXT}

Please respond to user queries based on the provided context. If the context doesn't contain relevant information, acknowledge this and provide a general helpful response.`;
  }

  createPrompt(context: string): string {
    return this.systemPrompt.replace('{CONTEXT}', context.trim());
  }
}
