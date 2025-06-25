import React, { useState } from 'react';
import { ChatWindow } from '../components/ChatWindow.js';
import { ChatInput } from '../components/ChatInput.js';
import { ChatContext } from '../components/ChatContext.js';
import { PromptOutput } from '../components/PromptOutput.js';
import { ChatMessage, ChatState } from '../types/chat.js';
import { ApiService } from '../services/api-service.js';
import { v4 as uuidv4 } from 'uuid';

export const ChatPlayground: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    context: '',
    currentPrompt: '',
    isLoading: false,
  });

  const apiService = new ApiService();

  const handleContextChange = (context: string) => {
    setChatState(prev => ({ ...prev, context }));
  };

  const handleSendMessage = async (messageContent: string) => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true }));

      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
      };

      // Add user message to chat
      const updatedMessages = [...chatState.messages, userMessage];
      setChatState(prev => ({ 
        ...prev, 
        messages: updatedMessages 
      }));

      // Step 1: Create prompt with context
      const prompt = await apiService.createPrompt(chatState.context);
      setChatState(prev => ({ 
        ...prev, 
        currentPrompt: prompt 
      }));

      // Step 2: Generate response using the prompt and chat history
      const assistantMessage = await apiService.generateResponse(updatedMessages, prompt);

      // Add assistant message to chat
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
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
            <ChatWindow messages={chatState.messages} />
          </div>
          <div className="chat-input-container">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={chatState.isLoading} 
            />
          </div>
        </div>
        
        <div className="chat-sidebar">
          <div className="chat-context-container">
            <ChatContext 
              context={chatState.context}
              onContextChange={handleContextChange}
            />
          </div>
          <div className="prompt-output-container">
            <PromptOutput prompt={chatState.currentPrompt} />
          </div>
        </div>
      </div>
    </div>
  );
};
