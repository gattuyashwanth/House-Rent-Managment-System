import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '200px' }}>
      <div className="spinner-border" role="status" style={{ color: '#4DA8FF', width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-secondary fw-semibold">{message}</p>
    </div>
  );
};

export default Loader;
