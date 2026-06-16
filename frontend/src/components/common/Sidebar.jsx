import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaTachometerAlt, FaUsers, FaBuilding, FaChartBar,
  FaCog, FaSignOutAlt, FaPlus, FaUser,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  dashboard: FaTachometerAlt,
  owners: FaUsers,
  properties: FaBuilding,
  reports: FaChartBar,
  settings: FaCog,
  add: FaPlus,
  profile: FaUser,
};

const Sidebar = ({ links, title, brandPath, open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Link to={brandPath} className="sidebar-brand" onClick={() => setOpen(false)}>
          <FaHome className="text-primary" /> {title}
        </Link>
        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = iconMap[link.icon] || FaTachometerAlt;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-link ${active ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon /> {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="small text-white mb-2 px-1">{user?.name}</div>
          <button className="sidebar-link w-100 border-0 bg-transparent text-start" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
