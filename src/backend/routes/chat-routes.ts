import { Router, Request, Response } from 'express'
import { IPromptService } from '../services/prompt-service.js'
import { IChatService } from '../services/chat-service.js'
import {
  CreatePromptRequest,
  CreatePromptResponse,
  GenerateResponseRequest,
  GenerateResponseResponse,
} from '../types/chat.js'

export class ChatRoutes {
  private router: Router

  constructor(
    private promptService: IPromptService,
    private chatService: IChatService,
  ) {
    this.router = Router()
    this.setupRoutes()
  }

  private setupRoutes(): void {
    this.router.post('/create-prompt', this.createPrompt.bind(this))
    this.router.post('/generate-response', this.generateResponse.bind(this))
  }

  private async createPrompt(req: Request, res: Response): Promise<void> {
    try {
      const { context }: CreatePromptRequest = req.body

      if (context === undefined || context === null) {
        res
          .status(400)
          .json({ error: 'Context field is required (can be empty string)' })
        return
      }

      const prompt = this.promptService.createPrompt(context)

      const response: CreatePromptResponse = { prompt }
      res.json(response)
    } catch (error) {
      console.error('Error creating prompt:', error)
      res.status(500).json({ error: 'Failed to create prompt' })
    }
  }

  private async generateResponse(req: Request, res: Response): Promise<void> {
    try {
      const { chatHistory, prompt }: GenerateResponseRequest = req.body

      if (!chatHistory || !prompt) {
        res.status(400).json({ error: 'Chat history and prompt are required' })
        return
      }

      // Get the last user message
      const lastUserMessage = chatHistory[chatHistory.length - 1]
      if (!lastUserMessage || lastUserMessage.role !== 'user') {
        res.status(400).json({ error: 'Last message must be from user' })
        return
      }

      // Generate response using chat service
      const responseMessage = await this.chatService.generateResponse(
        chatHistory.slice(0, -1), // All messages except the last one
        prompt,
        lastUserMessage.content,
      )

      const response: GenerateResponseResponse = { message: responseMessage }
      res.json(response)
    } catch (error) {
      console.error('Error generating response:', error)
      res.status(500).json({ error: 'Failed to generate response' })
    }
  }

  getRouter(): Router {
    return this.router
  }
}
