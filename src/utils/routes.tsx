// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import HomePage from '../pages/HomePage';
import ScanPage from '../pages/ScanPage';
import CodePage from '../pages/CodePage';
import SuccessPage from '../pages/SuccessPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />
      
      {/* Scan QR code */}
      <Route path="/scan" element={<ScanPage />} />
      
      {/* Code entry and validation */}
      <Route path="/code" element={<CodePage />} />
      <Route path="/code/:code" element={<CodePage />} />
      
      {/* Success page after reporting */}
      <Route path="/success" element={<SuccessPage />} />
      
      {/* Redirect legacy URLs */}
      <Route path="/report" element={<Navigate to="/code" replace />} />
      <Route path="/scan-qr" element={<Navigate to="/scan" replace />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;