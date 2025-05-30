import React from 'react';
import './LandingFooter.css';

function LandingFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">
        <p>&copy; {currentYear} StockWatch. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}

export default LandingFooter;