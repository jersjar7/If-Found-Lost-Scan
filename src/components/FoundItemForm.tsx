// src/components/FoundItemForm.tsx
import React, { useState } from 'react';

interface FoundItemFormProps {
  code: string;
  onSubmit: (data: FoundItemData) => Promise<void>;
  isLoading?: boolean;
}

export interface FoundItemData {
  finderName: string;
  finderEmail: string;
  finderPhone?: string;
  locationFound: string;
  foundDate: string;
  message?: string;
  code: string;
}

const FoundItemForm: React.FC<FoundItemFormProps> = ({ 
  code, 
  onSubmit, 
  isLoading = false 
}) => {
  // Initialize form state
  const [formData, setFormData] = useState<Omit<FoundItemData, 'code'>>({
    finderName: '',
    finderEmail: '',
    finderPhone: '',
    locationFound: '',
    foundDate: new Date().toISOString().split('T')[0], // Default to today
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.finderName.trim()) {
      newErrors.finderName = 'Name is required';
    }
    
    if (!formData.finderEmail.trim()) {
      newErrors.finderEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.finderEmail)) {
      newErrors.finderEmail = 'Please enter a valid email address';
    }
    
    if (!formData.locationFound.trim()) {
      newErrors.locationFound = 'Location is required';
    }
    
    if (!formData.foundDate) {
      newErrors.foundDate = 'Date found is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      // Submit the form data with the code
      await onSubmit({
        ...formData,
        code
      });
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setSubmissionError(err.message || 'Failed to submit the form. Please try again.');
    }
  };

  return (
    <div className="found-item-form-container">
      <div className="form-header">
        <h2>Report Found Item</h2>
        <p className="code-display">Code: <span>{code}</span></p>
      </div>
      
      {submissionError && (
        <div className="error-banner">
          {submissionError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="found-item-form">
        <div className="form-section">
          <h3>Your Information</h3>
          <p className="section-help">We'll share this with the owner so they can contact you.</p>
          
          <div className="form-group">
            <label htmlFor="finderName">Your Name *</label>
            <input
              id="finderName"
              name="finderName"
              type="text"
              value={formData.finderName}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            {errors.finderName && <span className="error-message">{errors.finderName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="finderEmail">Email Address *</label>
            <input
              id="finderEmail"
              name="finderEmail"
              type="email"
              value={formData.finderEmail}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            {errors.finderEmail && <span className="error-message">{errors.finderEmail}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="finderPhone">Phone Number (Optional)</label>
            <input
              id="finderPhone"
              name="finderPhone"
              type="tel"
              value={formData.finderPhone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Optional"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Item Details</h3>
          
          <div className="form-group">
            <label htmlFor="locationFound">Where did you find it? *</label>
            <input
              id="locationFound"
              name="locationFound"
              type="text"
              value={formData.locationFound}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., Central Park, NYC"
              required
            />
            {errors.locationFound && <span className="error-message">{errors.locationFound}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="foundDate">When did you find it? *</label>
            <input
              id="foundDate"
              name="foundDate"
              type="date"
              value={formData.foundDate}
              onChange={handleChange}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]} // Cannot be in the future
              required
            />
            {errors.foundDate && <span className="error-message">{errors.foundDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Additional information (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              placeholder="Add any details that might help the owner identify their item"
            />
          </div>
        </div>
        
        <div className="privacy-notice">
          <p>Your contact information will only be shared with the verified owner of this item.</p>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="primary-button"
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoundItemForm;