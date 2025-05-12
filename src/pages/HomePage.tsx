// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>IfFoundLost</h1>
        <p className="tagline">Reconnecting people with their lost items</p>
        
        <div className="hero-actions">
          <Link to="/scan" className="primary-button action-button">
            Scan QR Code
          </Link>
          <Link to="/code" className="secondary-button action-button">
            Enter Code Manually
          </Link>
        </div>
      </div>
      
      <div className="info-section">
        <h2>Found an item with our QR code?</h2>
        
        <div className="info-steps">
          <div className="info-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Scan the QR Code</h3>
              <p>Use your phone's camera to scan the QR code attached to the item</p>
            </div>
          </div>
          
          <div className="info-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Fill Out the Form</h3>
              <p>Provide some basic information about where and when you found the item</p>
            </div>
          </div>
          
          <div className="info-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Owner Gets Notified</h3>
              <p>The owner will be notified immediately and can contact you to arrange return</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How does this work?</h3>
            <p>Our QR codes are registered to specific owners. When you scan a code and submit the form, we'll notify the owner that their item has been found.</p>
          </div>
          
          <div className="faq-item">
            <h3>Is my information secure?</h3>
            <p>Yes! We only share your contact information with the verified owner of the lost item. We never share your information with third parties.</p>
          </div>
          
          <div className="faq-item">
            <h3>What if the code doesn't scan?</h3>
            <p>You can always enter the code manually. Each tag has a unique code printed on it (e.g., IFL-ABC123).</p>
          </div>
          
          <div className="faq-item">
            <h3>How do I get my own tags?</h3>
            <p>You can purchase IfFoundLost tags on our main website to protect your valuable items.</p>
          </div>
        </div>
        
        <div className="faq-cta">
          <a href="https://www.iffoundlost.com" target="_blank" rel="noopener noreferrer" className="text-link">
            Visit our main website to learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;