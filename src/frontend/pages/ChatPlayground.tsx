import React, { useState, useEffect, useRef } from 'react';
import { ChatWindow } from '../components/ChatWindow.js';
import { ChatInput } from '../components/ChatInput.js';
import { ContextManager } from '../components/ContextManager.js';
import { SystemPromptTemplate } from '../components/SystemPromptTemplate.js';
import { PromptOutput } from '../components/PromptOutput.js';
import { ChatMessage } from '../types/chat.js';
import { ApiService } from '../services/api-service.js';
import { v4 as uuidv4 } from 'uuid';
import { loadContexts, loadSystemPromptTemplate, clearAllChatPlaygroundData } from '../utils/localStorage.js';

export const ChatPlayground: React.FC = () => {
  // Phase 1: System Prompt Creation
  const [contexts, setContexts] = useState<string[]>(() => loadContexts());
  const [systemPromptTemplate, setSystemPromptTemplate] = useState(() => loadSystemPromptTemplate());
  const [finalSystemPrompt, setFinalSystemPrompt] = useState('');
  const [isSystemPromptReady, setIsSystemPromptReady] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isPhaseOneCollapsed, setIsPhaseOneCollapsed] = useState(false);

  // Phase 2: Chat Interaction
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownInitialMessage, setHasShownInitialMessage] = useState(false);

  const apiService = new ApiService();
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Add initial message when system prompt becomes ready and auto-focus chat input
  useEffect(() => {
    if (isSystemPromptReady && !hasShownInitialMessage && messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Please tell us more about what AI tools you use, in what use-cases AI plays an important role already and other important information related to AI and LLM use in your company',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      setHasShownInitialMessage(true);

      // Collapse phase one and auto-focus chat input
      setIsPhaseOneCollapsed(true);
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [isSystemPromptReady, hasShownInitialMessage, messages.length]);

  // Phase 1: System Prompt Creation Handlers
  const handleContextsChange = (newContexts: string[]) => {
    setContexts(newContexts);
    // Reset system prompt when contexts change
    if (isSystemPromptReady) {
      setIsSystemPromptReady(false);
      setFinalSystemPrompt('');
    }
  };

  const handleTemplateChange = (newTemplate: string) => {
    setSystemPromptTemplate(newTemplate);
    // Reset system prompt when template changes
    if (isSystemPromptReady) {
      setIsSystemPromptReady(false);
      setFinalSystemPrompt('');
    }
  };

  const handleGenerateSystemPrompt = async () => {
    try {
      setIsGeneratingPrompt(true);

      const prompt = await apiService.createPromptFromTemplate(contexts, systemPromptTemplate);
      setFinalSystemPrompt(prompt);
      setIsSystemPromptReady(true);

    } catch (error) {
      console.error('Error generating system prompt:', error);
      alert('Failed to generate system prompt. Please try again.');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleResetSystemPrompt = () => {
    setIsSystemPromptReady(false);
    setFinalSystemPrompt('');
    setMessages([]);
    setHasShownInitialMessage(false);
    setContexts([]);
    setSystemPromptTemplate('');
    clearAllChatPlaygroundData();
  };

  // Phase 2: Chat Interaction Handler
  const handleSendMessage = async (messageContent: string) => {
    if (!isSystemPromptReady || !finalSystemPrompt) {
      alert('Please generate a system prompt first.');
      return;
    }

    try {
      setIsLoading(true);

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Stream response from AI with the pre-generated system prompt
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
          systemPrompt: finalSystemPrompt,
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
        <p>Two-phase AI chat: Create system prompt, then chat</p>
      </div>

      {/* Phase 1: System Prompt Creation */}
      <div className="system-prompt-creation">
        <div className="phase-header">
          <h2
            onClick={() => setIsPhaseOneCollapsed(!isPhaseOneCollapsed)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            Phase 1: System Prompt Creation {isPhaseOneCollapsed ? '▶' : '▼'}
          </h2>
          {isSystemPromptReady && (
            <button
              onClick={handleResetSystemPrompt}
              className="reset-btn"
              type="button"
            >
              Reset & Start Over
            </button>
          )}
        </div>

        {!isPhaseOneCollapsed && (
          <>
            <div className="creation-content">
              <div className="creation-left">
                <ContextManager
                  contexts={contexts}
                  onContextsChange={handleContextsChange}
                />
              </div>

              <div className="creation-right">
                <SystemPromptTemplate
                  template={systemPromptTemplate}
                  onTemplateChange={handleTemplateChange}
                  contextCount={contexts.length}
                />

                <div className="generate-section">
                  <button
                    onClick={handleGenerateSystemPrompt}
                    disabled={isGeneratingPrompt || isSystemPromptReady}
                    className="generate-prompt-btn"
                    type="button"
                  >
                    {isGeneratingPrompt ? 'Generating...' :
                     isSystemPromptReady ? 'System Prompt Ready' :
                     'Generate System Prompt'}
                  </button>
                </div>
              </div>
            </div>

            {finalSystemPrompt && (
              <div className="prompt-output-container">
                <PromptOutput prompt={finalSystemPrompt} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Phase 2: Chat Interaction - Only show when system prompt is ready */}
      {isSystemPromptReady && (
        <div className="chat-interaction">
          <div className="phase-header">
            <h2>Phase 2: Chat Interaction</h2>
          </div>

          <div className="chat-main">
            <div className="chat-window-container">
              <ChatWindow messages={messages} />
            </div>
            <div className="chat-input-container">
              <ChatInput
                ref={chatInputRef}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!isSystemPromptReady}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
