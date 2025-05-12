// src/pages/ScanPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { sanitizeCode, extractCodeFromUrl } from '../utils/codeFormatUtils';

const ScanPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const navigate = useNavigate();

  const handleCodeDetected = (detectedCode: string) => {
    setIsScanningEnabled(false);
    
    try {
      // Extract code if it's a URL
      let code = detectedCode;
      
      // If it's a URL, try to extract the code
      if (detectedCode.includes('http')) {
        const extractedCode = extractCodeFromUrl(detectedCode);
        if (extractedCode) {
          code = extractedCode;
        }
      }
      
      // Sanitize the code
      const sanitizedCode = sanitizeCode(code);
      
      // Navigate to the code page
      navigate(`/code/${sanitizedCode}`);
    } catch (err: any) {
      console.error('Error processing code:', err);
      setError('Could not process the scanned code. Please try again or enter the code manually.');
      setIsScanningEnabled(true);
    }
  };

  const handleManualEntry = () => {
    navigate('/code');
  };

  return (
    <div className="scan-page">
      <div className="scan-page-header">
        <h1>Scan QR Code</h1>
        <p>Position the QR code within the scanning area</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="scanner-container">
        {isScanningEnabled && (
          <QRScanner onCodeDetected={handleCodeDetected} />
        )}
      </div>
      
      <div className="scan-page-footer">
        <p>Having trouble scanning?</p>
        <button 
          onClick={handleManualEntry}
          className="secondary-button"
        >
          Enter Code Manually
        </button>
      </div>
    </div>
  );
};

export default ScanPage;