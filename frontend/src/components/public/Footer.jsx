import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer-premium">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <h5 className="d-flex align-items-center gap-2"><FaHome /> HouseRent</h5>
          <p className="small">Your trusted platform for finding and listing premium rental properties. Connecting owners with the perfect tenants since 2014.</p>
          <div className="d-flex gap-3 mt-3">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#!" className="fs-5"><Icon /></a>
            ))}
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <h5>Quick Links</h5>
          <ul className="list-unstyled small">
            <li className="mb-2"><Link to="/">Home</Link></li>
            <li className="mb-2"><Link to="/properties">Properties</Link></li>
            <li className="mb-2"><Link to="/about">About Us</Link></li>
            <li className="mb-2"><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="col-6 col-lg-2">
          <h5>For Owners</h5>
          <ul className="list-unstyled small">
            <li className="mb-2"><Link to="/register">Register</Link></li>
            <li className="mb-2"><Link to="/login">Login</Link></li>
            <li className="mb-2"><Link to="/owner/add-property">List Property</Link></li>
          </ul>
        </div>
        <div className="col-lg-4">
          <h5>Contact Info</h5>
          <ul className="list-unstyled small">
            <li className="mb-2">📍 123 Real Estate Ave, New York, NY</li>
            <li className="mb-2">📞 +1 (555) 123-4567</li>
            <li className="mb-2">✉️ info@houserent.com</li>
          </ul>
        </div>
      </div>
      <hr className="my-4 opacity-25" />
      <p className="text-center small mb-0">&copy; {new Date().getFullYear()} HouseRent Management System. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
