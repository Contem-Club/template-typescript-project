import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { GeminiClient } from './api/gemini-client.js'
import { PromptService } from './services/prompt-service.js'
import { ChatService } from './services/chat-service.js'
import { AIChatService } from './services/ai-chat-service.js'
import { ChatRoutes } from './routes/chat-routes.js'
import { AIChatRoutes } from './routes/ai-chat-routes.js'

// Load environment variables
dotenv.config()

export class Server {
  private app: express.Application
  private port: number

  constructor() {
    this.app = express()
    this.port = parseInt(process.env.PORT || '3001', 10)
    this.setupMiddleware()
    this.setupServices()
    this.setupRoutes()
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet())

    // CORS middleware
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.FRONTEND_URL,
    ].filter((origin): origin is string => Boolean(origin))

    this.app.use(
      cors({
        origin: allowedOrigins,
        credentials: true,
      }),
    )

    // Logging middleware
    this.app.use(morgan('combined'))

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))
  }

  private setupServices(): void {
    // Validate required environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required')
    }

    // Initialize services
    const geminiClient = new GeminiClient({
      apiKey: geminiApiKey,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    })

    const promptService = new PromptService()
    const chatService = new ChatService(geminiClient)
    const aiChatService = new AIChatService()

    // Setup routes
    const chatRoutes = new ChatRoutes(promptService, chatService)
    const aiChatRoutes = new AIChatRoutes(promptService, aiChatService)

    // Keep legacy routes for backward compatibility
    this.app.use('/api/chat', chatRoutes.getRouter())
    // Add new AI-powered routes
    this.app.use('/api/ai', aiChatRoutes.getRouter())
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '2.0.0', // AI SDK integration with tools
        features: [
          'empty-context-support',
          'ai-sdk-integration',
          'conversation-completion-tool',
          'tool-usage-gathering',
        ],
      })
    })

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' })
    })

    // Error handler
    this.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        console.error('Unhandled error:', err)
        res.status(500).json({ error: 'Internal server error' })
      },
    )
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`)
      console.log(`Health check: http://localhost:${this.port}/health`)
    })
  }

  public getApp(): express.Application {
    return this.app
  }
}
