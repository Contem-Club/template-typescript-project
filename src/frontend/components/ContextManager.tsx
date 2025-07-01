import React from 'react';

interface ContextManagerProps {
  contexts: string[];
  onContextsChange: (contexts: string[]) => void;
}

export const ContextManager: React.FC<ContextManagerProps> = ({
  contexts,
  onContextsChange,
}) => {
  const addContext = () => {
    onContextsChange([...contexts, '']);
  };

  const removeContext = (index: number) => {
    const newContexts = contexts.filter((_, i) => i !== index);
    onContextsChange(newContexts);
  };

  const updateContext = (index: number, value: string) => {
    const newContexts = [...contexts];
    newContexts[index] = value;
    onContextsChange(newContexts);
  };

  return (
    <div className="context-manager">
      <div className="context-manager-header">
        <h3>Context Elements</h3>
        <button 
          onClick={addContext}
          className="add-context-btn"
          type="button"
        >
          + Add Context
        </button>
      </div>
      
      <div className="context-list">
        {contexts.length === 0 ? (
          <div className="no-contexts">
            <p>No context elements yet. Click "Add Context" to get started.</p>
          </div>
        ) : (
          contexts.map((context, index) => (
            <div key={index} className="context-item">
              <div className="context-item-header">
                <label htmlFor={`context-${index}`}>
                  Context {index + 1}
                </label>
                <button
                  onClick={() => removeContext(index)}
                  className="remove-context-btn"
                  type="button"
                  aria-label={`Remove context ${index + 1}`}
                >
                  ×
                </button>
              </div>
              <textarea
                id={`context-${index}`}
                value={context}
                onChange={(e) => updateContext(index, e.target.value)}
                placeholder={`Enter context ${index + 1}...`}
                className="context-input"
                rows={3}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
