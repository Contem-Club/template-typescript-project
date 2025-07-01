import React from 'react';

interface SystemPromptTemplateProps {
  template: string;
  onTemplateChange: (template: string) => void;
  contextCount: number;
}

export const SystemPromptTemplate: React.FC<SystemPromptTemplateProps> = ({
  template,
  onTemplateChange,
  contextCount,
}) => {
  const getPlaceholderHelp = () => {
    const placeholders = ['{contexts} - All contexts combined'];
    
    if (contextCount > 0) {
      for (let i = 1; i <= contextCount; i++) {
        placeholders.push(`{context${i}} - Context ${i} only`);
      }
    }
    
    return placeholders;
  };

  const getDefaultTemplate = () => {
    if (contextCount === 0) {
      return 'You are a helpful AI assistant. Please provide helpful, accurate, and informative responses to user questions.';
    }
    
    return `You are a helpful AI assistant. Use the following context to provide accurate and relevant responses.

{contexts}

Please respond to user queries based on the provided context. If the context doesn't contain relevant information, acknowledge this and provide a general helpful response.`;
  };

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById('system-prompt-template') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newTemplate = template.substring(0, start) + placeholder + template.substring(end);
      onTemplateChange(newTemplate);
      
      // Set cursor position after the inserted placeholder
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  };

  const useDefaultTemplate = () => {
    onTemplateChange(getDefaultTemplate());
  };

  return (
    <div className="system-prompt-template">
      <div className="template-header">
        <h3>System Prompt Template</h3>
        <button 
          onClick={useDefaultTemplate}
          className="use-default-btn"
          type="button"
        >
          Use Default Template
        </button>
      </div>
      
      <div className="template-content">
        <div className="template-input-section">
          <textarea
            id="system-prompt-template"
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            placeholder="Enter your system prompt template here. Use placeholders like {contexts} or {context1}, {context2}, etc."
            className="template-input"
            rows={8}
          />
        </div>
        
        <div className="placeholder-help">
          <h4>Available Placeholders:</h4>
          <div className="placeholder-list">
            {getPlaceholderHelp().map((placeholder, index) => {
              const placeholderText = placeholder.split(' - ')[0];
              const description = placeholder.split(' - ')[1];
              
              return (
                <div key={index} className="placeholder-item">
                  <button
                    onClick={() => insertPlaceholder(placeholderText)}
                    className="placeholder-btn"
                    type="button"
                  >
                    {placeholderText}
                  </button>
                  <span className="placeholder-description">- {description}</span>
                </div>
              );
            })}
          </div>
          
          {contextCount === 0 && (
            <p className="placeholder-note">
              Add context elements to see individual context placeholders.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
