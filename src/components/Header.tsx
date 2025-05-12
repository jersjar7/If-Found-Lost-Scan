// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false }) => {
  return (
    <header className="site-header">
      <div className="header-container">
        {showBackButton && (
          <button onClick={() => window.history.back()} className="back-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
        )}
        
        <Link to="/" className="logo-link">
          <div className="logo">
            <span className="logo-text">IfFoundLost</span>
          </div>
        </Link>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li>
              <Link to="/scan" className="nav-link">
                Scan
              </Link>
            </li>
            <li>
              <Link to="/code" className="nav-link">
                Enter Code
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;