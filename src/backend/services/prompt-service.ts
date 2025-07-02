export interface PromptCreationRequest {
  contexts: string[]
  template: string
}

export interface IPromptService {
  createPrompt(context: string): string
  createPromptFromTemplate(request: PromptCreationRequest): string
}

export class PromptService implements IPromptService {
  private readonly systemPromptWithContext: string
  private readonly systemPromptWithoutContext: string
  private readonly defaultPrompt: string
  private readonly defaultPromptWithContext: string

  constructor() {
    this.systemPromptWithContext = `You are a helpful AI assistant. Use the following context to provide accurate and relevant responses.

Context: {CONTEXT}

Please respond to user queries based on the provided context. If the context doesn't contain relevant information, acknowledge this and provide a general helpful response.`

    this.defaultPrompt = `
Your goal is to gather information from users on AI usage within their company.
Ask the user to provide the following information:
1. AI Products/Tools Used: (e.g., Cursor, ChatGPT, Microsoft Copilot) — inquire
about their primary function and users.
2. Underlying AI Models/Frameworks: (e.g., GPT-4, Claude, PyTorch, CrewAI) —
ask if they're used directly or embedded, and the reasons for their selection.
3. Implemented AI Use Cases: (e.g., Support automation, Expense management)
— seek details on the business problem solved, the impact achieved, and the
benefiting departments.
4. Units/Departments Using AI: (e.g., HR, IT, Marketing) — determine the nature
of AI support and the level of adoption within each.
After the initial user message, ask for additional details and try to cover all the topics above.
Do now overwhelm the user with questions. Keep it conversational and ask one question at a time.
It's always a good idea to ask for examples and specific details.
`

    this.defaultPromptWithContext =
      this.defaultPrompt +
      `
Other employees from the same company have provideded the information below. Verify that information
by asking back and try to use this information to push the user into giving more details.
Do not disclose personal details on the other employes.

Example:
If the context is:
User: I am Mark and work in HR. We often use ChatGPT to summarize resumes and also are evaluating
a new AI SaaS software to automate our onboarding process.
Then you should use this information like this:
AI Assistant: Other employees mentioned the use of ChatGPT. Do you use this as well?
Or
AI Assistant: HR seems to be evaluating a SaaS solution for on-boarding. Do you know about similar initiatives in your department?

ACTUAL CONTEXTS:
{contexts}
`

    this.systemPromptWithoutContext = this.defaultPrompt
  }

  createPrompt(context: string): string {
    const trimmedContext = context.trim()

    if (trimmedContext === '') {
      return this.systemPromptWithoutContext
    }

    return this.systemPromptWithContext.replace('{CONTEXT}', trimmedContext)
  }

  createPromptFromTemplate(request: PromptCreationRequest): string {
    const { contexts, template } = request

    if (!template.trim()) {
      // Default template if none provided
      if (contexts.length > 0) {
        const contextText = contexts
          .filter((ctx) => ctx.trim())
          .map((ctx, index) => `Context ${index + 1}: ${ctx.trim()}`)
          .join('\n\n')

        return this.defaultPromptWithContext.replace(
          /\{contexts\}/g,
          contextText,
        )
      } else {
        return this.defaultPrompt
      }
    }

    // Process template with placeholders
    let processedTemplate = template

    // Replace {contexts} with all contexts joined
    const filteredContexts = contexts.filter((ctx) => ctx.trim())
    const allContexts = filteredContexts
      .map((ctx, index) => `Context ${index + 1}: ${ctx.trim()}`)
      .join('\n\n')
    processedTemplate = processedTemplate.replace(/\{contexts\}/g, allContexts)

    // Replace individual context placeholders {context1}, {context2}, etc.
    filteredContexts.forEach((context, index) => {
      const placeholder = `{context${index + 1}}`
      processedTemplate = processedTemplate.replace(
        new RegExp(placeholder, 'g'),
        context.trim(),
      )
    })

    return processedTemplate
  }
}
