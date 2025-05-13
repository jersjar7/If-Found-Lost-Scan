// src/pages/CodePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CodeEntryForm from '../components/CodeEntryForm';
import FoundItemForm from '../components/FoundItemForm';
import { validateCodeFormat, sanitizeCode } from '../utils/codeFormatUtils';
import { CodeValidationService } from '../services/CodeValidationService';
import { ReportService } from '../services/ReportService';
import type { FoundItemData } from '../components/FoundItemForm';

const CodePage: React.FC = () => {
  // Get code from URL params or query string
  const { code: codeParam } = useParams<{ code?: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const codeQuery = queryParams.get('code');
  
  // Set initial code from params or query
  const initialCode = codeParam || codeQuery || '';
  
  const [code, setCode] = useState(sanitizeCode(initialCode));
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'code-entry' | 'validation' | 'report-form' | 'already-reported'>(
    initialCode ? 'validation' : 'code-entry'
  );
  
  const navigate = useNavigate();
  
  // Validate code on initial load if provided
  useEffect(() => {
    if (initialCode && stage === 'validation') {
      const sanitizedInitialCode = sanitizeCode(initialCode);
      console.log('Initial code detected, validating:', sanitizedInitialCode);
      validateCode(sanitizedInitialCode);
    }
  }, [initialCode]);

  const handleCodeSubmit = (submittedCode: string) => {
    const sanitizedCode = sanitizeCode(submittedCode);
    console.log('Code submitted by user:', sanitizedCode);
    setStage('validation');
    setCode(sanitizedCode);
    validateCode(sanitizedCode);
  };
  
  const validateCode = async (codeToValidate: string) => {
    setIsValidating(true);
    setError(null);
    console.log('Starting validation process for code:', codeToValidate);
    
    try {
      // First, validate the format
      const formatCheck = validateCodeFormat(codeToValidate);
      console.log('Format validation result:', formatCheck);
      
      if (!formatCheck.valid) {
        setError(formatCheck.message);
        setStage('code-entry');
        setIsValidating(false);
        return;
      }
      
      // Then, validate against the database
      console.log('Format valid, checking against database...');
      const result = await CodeValidationService.validateCode(codeToValidate);
      console.log('Database validation result:', result);
      setValidationResult(result);
      
      if (!result.valid) {
        setError(result.message);
        setStage('code-entry');
      } else {
        // Check if this code has been reported already
        console.log('Code is valid, checking for existing reports...');
        const existingReport = await ReportService.checkExistingReport(codeToValidate);
        console.log('Existing report check result:', existingReport);
        
        if (existingReport.exists) {
          console.log('Code has already been reported');
          setStage('already-reported');
        } else {
          console.log('Code is valid and not yet reported, showing form');
          setStage('report-form');
        }
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      // Enhanced error details for debugging
      const errorDetail = err.code 
        ? `${err.code}: ${err.message}`
        : err.message || 'An unknown error occurred';
        
      setError(`Validation failed. ${errorDetail}`);
      setStage('code-entry');
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleReportSubmit = async (data: FoundItemData) => {
    setIsSubmitting(true);
    setError(null);
    console.log('Submitting report for code:', code);
    
    try {
      const reportId = await ReportService.submitReport(data);
      console.log('Report submitted successfully, ID:', reportId);
      // Navigate to success page with the report ID
      navigate(`/success?reportId=${reportId}&code=${code}`);
    } catch (err: any) {
      console.error('Report submission error:', err);
      const errorDetail = err.code 
        ? `${err.code}: ${err.message}`
        : err.message || 'An unknown error occurred';
        
      setError(`Failed to submit report. ${errorDetail}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'code-entry':
        return (
          <div className="code-entry-stage">
            <h1>Enter Lost Item Code</h1>
            <p>Please enter the code from the QR tag you found:</p>
            {error && <div className="error-message">{error}</div>}
            <CodeEntryForm 
              onSubmit={handleCodeSubmit} 
              initialValue={code} 
              isLoading={isValidating}
            />
          </div>
        );
        
      case 'validation':
        return (
          <div className="validation-stage">
            <h1>Validating Code</h1>
            <div className="loader">Loading...</div>
            <p>Please wait while we validate the code: <strong>{code}</strong></p>
          </div>
        );
        
      case 'report-form':
        return (
          <div className="report-form-stage">
            <div className="validation-success">
              <h2>Valid Code Found!</h2>
              <p>This code is registered to our system. Please fill out the form below to report that you've found this item.</p>
              
              {/* Display additional information from validation result if available */}
              {validationResult && (
                <div className="item-details">
                  {validationResult.codeData?.productType && (
                    <p className="product-type-info">
                      Item type: <strong>{validationResult.codeData.productType}</strong>
                    </p>
                  )}
                  {validationResult.batchData?.name && (
                    <p className="batch-info">
                      Batch: <strong>{validationResult.batchData.name}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <FoundItemForm 
              code={code} 
              onSubmit={handleReportSubmit} 
              isLoading={isSubmitting}
            />
          </div>
        );
        
      case 'already-reported':
        return (
          <div className="already-reported-stage">
            <h1>Item Already Reported</h1>
            <p>This item has already been reported as found. The owner has been notified.</p>
            <p>Thank you for your honesty and willingness to help!</p>
            
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/')} 
                className="primary-button"
              >
                Return Home
              </button>
              <button 
                onClick={() => {
                  setStage('report-form');
                  setError(null);
                }} 
                className="secondary-button"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="code-page">
      {renderContent()}
    </div>
  );
};

export default CodePage;