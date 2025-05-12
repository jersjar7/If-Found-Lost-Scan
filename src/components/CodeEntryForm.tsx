// src/components/CodeEntryForm.tsx
import React, { useState } from 'react';

interface CodeEntryFormProps {
  onSubmit: (code: string) => void;
  initialValue?: string;
  isLoading?: boolean;
}

const CodeEntryForm: React.FC<CodeEntryFormProps> = ({ 
  onSubmit, 
  initialValue = '', 
  isLoading = false 
}) => {
  const [code, setCode] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize code
    const sanitizedCode = code.trim().toUpperCase();
    
    if (!sanitizedCode) {
      setError('Please enter a code');
      return;
    }
    
    // Basic format validation (e.g., IFL-XXXXX)
    const codeRegex = /^[A-Z0-9]+-[A-Z0-9]+$/;
    if (!codeRegex.test(sanitizedCode)) {
      setError('Invalid code format. Expected something like "IFL-ABC123"');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Submit the code
    onSubmit(sanitizedCode);
  };

  return (
    <div className="code-entry-container">
      <form onSubmit={handleSubmit} className="code-entry-form">
        <div className="form-group">
          <label htmlFor="code-input">Enter the code from the QR tag:</label>
          <input
            id="code-input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g., IFL-ABC123"
            disabled={isLoading}
            className="code-input"
            autoComplete="off"
            autoCapitalize="characters"
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading} 
          className="primary-button"
        >
          {isLoading ? 'Checking...' : 'Continue'}
        </button>
      </form>
      
      <div className="code-entry-help">
        <p>The code should be in the format "IFL-XXXXX" and can be found on the QR tag attached to the item.</p>
        <p>If you're having trouble, check the code carefully - it's case-sensitive and includes the dash.</p>
      </div>
    </div>
  );
};

export default CodeEntryForm;