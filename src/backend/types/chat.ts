export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatHistory {
  messages: ChatMessage[]
}

export interface CreatePromptRequest {
  context: string
}

export interface CreatePromptResponse {
  prompt: string
}

export interface GenerateResponseRequest {
  chatHistory: ChatMessage[]
  prompt: string
}

export interface GenerateResponseResponse {
  message: ChatMessage
}
