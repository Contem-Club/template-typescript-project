export interface IPromptService {
  createPrompt(context: string): string;
}

export class PromptService implements IPromptService {
  private readonly systemPromptWithContext: string;
  private readonly systemPromptWithoutContext: string;

  constructor() {
    this.systemPromptWithContext = `You are a helpful AI assistant. Use the following context to provide accurate and relevant responses.

Context: {CONTEXT}

Please respond to user queries based on the provided context. If the context doesn't contain relevant information, acknowledge this and provide a general helpful response.`;

    this.systemPromptWithoutContext = `You are a helpful AI assistant. Please respond to user queries in a helpful, accurate, and engaging manner. Provide clear and informative responses based on your knowledge.`;
  }

  createPrompt(context: string): string {
    const trimmedContext = context.trim();

    if (trimmedContext === '') {
      return this.systemPromptWithoutContext;
    }

    return this.systemPromptWithContext.replace('{CONTEXT}', trimmedContext);
  }
}
