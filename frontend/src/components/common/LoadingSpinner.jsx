import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => (
  <div className={`loading-overlay ${fullPage ? 'min-vh-100' : ''}`}>
    <div className="loading-spinner" />
    <p className="text-muted mb-0 animate-fade">{message}</p>
  </div>
);

export default LoadingSpinner;
