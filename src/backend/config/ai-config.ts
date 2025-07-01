import { createGoogleGenerativeAI } from '@ai-sdk/google'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export interface AIConfig {
  apiKey: string
  model: string
  maxSteps: number
  thinkingBudget: number
}

export function getAIConfig(): AIConfig {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required')
  }

  return {
    apiKey,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    maxSteps: parseInt(process.env.AI_MAX_STEPS || '5', 10),
    thinkingBudget: parseInt(process.env.AI_THINKING_BUDGET || '2048', 10),
  }
}

export function createGoogleAI() {
  const config = getAIConfig()

  const google = createGoogleGenerativeAI({
    apiKey: config.apiKey,
  })

  return {
    google,
    model: google(config.model),
    config,
  }
}
