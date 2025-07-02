import React, { useEffect } from 'react';
import { saveContexts, clearContexts } from '../utils/localStorage.js';

interface ContextManagerProps {
  contexts: string[];
  onContextsChange: (contexts: string[]) => void;
}

export const ContextManager: React.FC<ContextManagerProps> = ({
  contexts,
  onContextsChange,
}) => {
  // Save contexts to localStorage whenever they change
  useEffect(() => {
    saveContexts(contexts);
  }, [contexts]);

  const addContext = () => {
    const newContexts = [...contexts, ''];
    onContextsChange(newContexts);
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

  const clearAllContexts = () => {
    onContextsChange([]);
    clearContexts();
  };

  return (
    <div className="context-manager">
      <div className="context-manager-header">
        <h3>Context Elements</h3>
        <div className="context-manager-actions">
          <button
            onClick={addContext}
            className="add-context-btn"
            type="button"
          >
            + Add Context
          </button>
          {contexts.length > 0 && (
            <button
              onClick={clearAllContexts}
              className="clear-contexts-btn"
              type="button"
            >
              Clear All
            </button>
          )}
        </div>
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
