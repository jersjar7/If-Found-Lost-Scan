// src/pages/SuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SuccessPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const reportId = queryParams.get('reportId');
  const code = queryParams.get('code');

  useEffect(() => {
    const loadReportData = async () => {
      if (!reportId) {
        setLoading(false);
        return;
      }
      
      try {
        const reportRef = doc(db, 'foundReports', reportId);
        const reportDoc = await getDoc(reportRef);
        
        if (reportDoc.exists()) {
          setReportData(reportDoc.data());
        }
      } catch (err: any) {
        console.error('Error loading report data:', err);
        setError('Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };
    
    loadReportData();
  }, [reportId]);

  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="success-page loading">
        <div className="loader">Loading...</div>
        <p>Loading your report details...</p>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <path 
            fill="currentColor" 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
          />
        </svg>
      </div>
      
      <h1>Thank You!</h1>
      
      <div className="success-message">
        <p>Your report has been successfully submitted.</p>
        
        {code && (
          <p className="code-reference">Code: <strong>{code}</strong></p>
        )}
        
        <p>The owner has been notified and will be in touch soon.</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="success-details">
        <h2>What happens next?</h2>
        <ol>
          <li>The owner will receive a notification about your report</li>
          <li>They will review the details you've provided</li>
          <li>If they confirm it's their item, they'll contact you using the information you provided</li>
        </ol>
      </div>
      
      <div className="privacy-notice">
        <p>Your contact information will only be shared with the verified owner of this item.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={handleReturnHome} 
          className="primary-button"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;