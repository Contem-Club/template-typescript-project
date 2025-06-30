import { Router, Request, Response } from 'express';
import { type CoreMessage } from 'ai';
import { IPromptService } from '../services/prompt-service.js';
import { IAIChatService } from '../services/ai-chat-service.js';

export class AIChatRoutes {
  private router: Router;

  constructor(
    private promptService: IPromptService,
    private aiChatService: IAIChatService
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/create-prompt', this.createPrompt.bind(this));
    this.router.post('/chat', this.streamChat.bind(this));
  }

  private async createPrompt(req: Request, res: Response): Promise<void> {
    try {
      const { context } = req.body;

      if (context === undefined || context === null) {
        res.status(400).json({ error: 'Context field is required (can be empty string)' });
        return;
      }

      const prompt = this.promptService.createPrompt(context);
      res.json({ prompt });
    } catch (error) {
      console.error('Error creating prompt:', error);
      res.status(500).json({ error: 'Failed to create prompt' });
    }
  }

  private async streamChat(req: Request, res: Response): Promise<void> {
    try {
      const { messages, systemPrompt } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Messages array is required' });
        return;
      }

      if (!systemPrompt) {
        res.status(400).json({ error: 'System prompt is required' });
        return;
      }

      // Convert messages to CoreMessage format
      const coreMessages: CoreMessage[] = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Generate streaming response
      const result = await this.aiChatService.generateStreamingResponse(coreMessages, systemPrompt);

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Stream the response
      result.pipeDataStreamToResponse(res);
    } catch (error) {
      console.error('Error in streaming chat:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate streaming response' });
      }
    }
  }

  getRouter(): Router {
    return this.router;
  }
}
