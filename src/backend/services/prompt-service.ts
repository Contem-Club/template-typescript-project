export interface PromptCreationRequest {
  contexts: string[];
  template: string;
}

export interface IPromptService {
  createPrompt(context: string): string;
  createPromptFromTemplate(request: PromptCreationRequest): string;
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

  createPromptFromTemplate(request: PromptCreationRequest): string {
    const { contexts, template } = request;

    if (!template.trim()) {
      // Default template if none provided
      if (contexts.length > 0) {
        const contextText = contexts
          .filter(ctx => ctx.trim())
          .map((ctx, index) => `Context ${index + 1}: ${ctx.trim()}`)
          .join('\n\n');

        return `You are a helpful AI assistant. Use the following context to provide accurate and relevant responses.

${contextText}

Please respond to user queries based on the provided context. If the context doesn't contain relevant information, acknowledge this and provide a general helpful response.`;
      } else {
        return this.systemPromptWithoutContext;
      }
    }

    // Process template with placeholders
    let processedTemplate = template;

    // Replace {contexts} with all contexts joined
    const filteredContexts = contexts.filter(ctx => ctx.trim());
    const allContexts = filteredContexts
      .map((ctx, index) => `Context ${index + 1}: ${ctx.trim()}`)
      .join('\n\n');
    processedTemplate = processedTemplate.replace(/\{contexts\}/g, allContexts);

    // Replace individual context placeholders {context1}, {context2}, etc.
    filteredContexts.forEach((context, index) => {
      const placeholder = `{context${index + 1}}`;
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), context.trim());
    });

    return processedTemplate;
  }
}
