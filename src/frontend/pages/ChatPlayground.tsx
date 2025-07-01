import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatWindow } from '../components/ChatWindow.js';
import { ChatInput } from '../components/ChatInput.js';
import { ChatContext } from '../components/ChatContext.js';
import { PromptOutput } from '../components/PromptOutput.js';
import { ChatMessage } from '../types/chat.js';
import { ApiService } from '../services/api-service.js';

export const ChatPlayground: React.FC = () => {
  const [context, setContext] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

  const apiService = new ApiService();

  // Use the AI SDK's useChat hook for streaming chat
  const chat = useChat({
    api: '/api/ai/chat',
    body: {
      systemPrompt: currentPrompt,
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const handleContextChange = (newContext: string) => {
    setContext(newContext);
  };

  const handleSendMessage = async (messageContent: string) => {
    try {
      // Step 1: Create prompt with context
      const prompt = await apiService.createPrompt(context);
      setCurrentPrompt(prompt);

      // Step 2: Send message using the AI SDK
      // The useChat hook will handle the streaming and message management
      chat.append({
        role: 'user',
        content: messageContent,
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-playground">
      <div className="chat-playground-header">
        <h1>Chatbot Playground</h1>
        <p>A simple chatbot interface with context-aware prompting</p>
      </div>
      
      <div className="chat-layout">
        <div className="chat-main">
          <div className="chat-window-container">
            <ChatWindow messages={chat.messages.map(msg => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.createdAt || Date.now()),
            }))} />
          </div>
          <div className="chat-input-container">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={chat.isLoading}
            />
          </div>
        </div>

        <div className="chat-sidebar">
          <div className="chat-context-container">
            <ChatContext
              context={context}
              onContextChange={handleContextChange}
            />
          </div>
          <div className="prompt-output-container">
            <PromptOutput prompt={currentPrompt} />
          </div>
        </div>
      </div>
    </div>
  );
};
