import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input-header">
        <h3>Chat Input</h3>
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Complete Phase 1 to enable chat..." : "Type your message here..."}
            disabled={isLoading || disabled}
            rows={3}
            className="message-input"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className="send-button"
          >
            {isLoading ? 'Sending...' : disabled ? 'Chat Disabled' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};
