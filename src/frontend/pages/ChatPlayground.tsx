import React, { useState } from 'react';
import { ChatWindow } from '../components/ChatWindow.js';
import { ChatInput } from '../components/ChatInput.js';
import { ChatContext } from '../components/ChatContext.js';
import { PromptOutput } from '../components/PromptOutput.js';
import { ChatMessage } from '../types/chat.js';
import { ApiService } from '../services/api-service.js';
import { v4 as uuidv4 } from 'uuid';

export const ChatPlayground: React.FC = () => {
  const [context, setContext] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiService = new ApiService();

  const handleContextChange = (newContext: string) => {
    setContext(newContext);
  };

  const handleSendMessage = async (messageContent: string) => {
    try {
      setIsLoading(true);

      // Step 1: Create prompt with context and display it
      const prompt = await apiService.createPrompt(context);
      setCurrentPrompt(prompt);

      // Step 2: Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Step 3: Stream response from AI with the generated system prompt
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          systemPrompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // Add empty assistant message that we'll update as we stream
      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Parse the streaming data
            const data = line.slice(2);
            assistantMessage.content += data;

            // Update the assistant message in real-time
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: assistantMessage.content }
                  : msg
              )
            );
          }
        }
      }

      setIsLoading(false);

    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
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
            <ChatWindow messages={messages} />
          </div>
          <div className="chat-input-container">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
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
