// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="primary-button">
            Go Home
          </Link>
          <Link to="/code" className="secondary-button">
            Enter Code
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;