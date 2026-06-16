import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { NAV_LINKS } from '../../utils/constants';

const Navbar = () => {
  const { user, logout, dashboardPath, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-premium sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <FaHome className="text-primary" /> HouseRent
        </Link>
        <button className="navbar-toggler border-0" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto">
            {NAV_LINKS.public.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink className="nav-link" to={link.path} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link to={dashboardPath} className="btn btn-outline-primary btn-sm">
                  {isAdmin ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button className="btn btn-primary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
