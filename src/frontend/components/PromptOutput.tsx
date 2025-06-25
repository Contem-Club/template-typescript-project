import React from 'react';

interface PromptOutputProps {
  prompt: string;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({ prompt }) => {
  return (
    <div className="prompt-output">
      <div className="prompt-output-header">
        <h3>Prompt Output (Last Prompt)</h3>
      </div>
      <div className="prompt-content">
        {prompt ? (
          <pre className="prompt-text">{prompt}</pre>
        ) : (
          <div className="empty-state">
            <p>No prompt generated yet. Add context and send a message to see the generated prompt.</p>
          </div>
        )}
      </div>
    </div>
  );
};
