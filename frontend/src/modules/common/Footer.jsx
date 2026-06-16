import React from 'react';
import { FaHome } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto border-top">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaHome className="fs-3" style={{ color: '#4DA8FF' }} />
              <span className="fw-bold fs-4">RentEase</span>
            </div>
            <p className="text-secondary small">
              Providing premium property solutions. Your perfect home search ends here.
            </p>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-2">Find a Rental</li>
              <li className="mb-2">List Your Property</li>
              <li className="mb-2">How it Works</li>
              <li className="mb-2">Terms of Service</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">Contact Support</h5>
            <p className="text-secondary small mb-1">Email: support@rentease.com</p>
            <p className="text-secondary small mb-1">Phone: +1 (555) 019-2834</p>
            <p className="text-secondary small">Address: 100 Real Estate Ave, Suite 500</p>
          </div>
        </div>
        <hr className="bg-secondary my-4" />
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="text-secondary small">&copy; {new Date().getFullYear()} RentEase Inc. All rights reserved.</span>
          <span className="text-secondary small">Designed with Passion.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
