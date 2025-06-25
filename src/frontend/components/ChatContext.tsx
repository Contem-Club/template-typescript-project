import React from 'react';

interface ChatContextProps {
  context: string;
  onContextChange: (context: string) => void;
}

export const ChatContext: React.FC<ChatContextProps> = ({ context, onContextChange }) => {
  return (
    <div className="chat-context">
      <div className="chat-context-header">
        <h3>Chat Context</h3>
      </div>
      <div className="context-input-container">
        <textarea
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          placeholder="Enter context information that will be used to generate prompts..."
          rows={8}
          className="context-input"
        />
        <div className="context-help">
          <p>
            This context will be included in the system prompt to help the AI provide 
            more relevant and accurate responses.
          </p>
        </div>
      </div>
    </div>
  );
};
