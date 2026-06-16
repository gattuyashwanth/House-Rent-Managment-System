import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'Admin') return '/admin/dashboard';
    if (user.role === 'Owner') return '/owner/dashboard';
    return '/renter/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to={getDashboardLink()}>
          <FaHome className="fs-3" style={{ color: '#4DA8FF' }} />
          <span style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            Rent<span style={{ color: '#4DA8FF' }}>Ease</span>
          </span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && user.role === 'Renter' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/renter/properties">
                    Find Properties
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/renter/bookings">
                    Booking History
                  </Link>
                </li>
              </>
            )}
            {user && user.role === 'Owner' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/owner/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/owner/my-properties">
                    My Listings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/owner/bookings">
                    Booking Requests
                  </Link>
                </li>
              </>
            )}
            {user && user.role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/admin/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/admin/owners">
                    Owners
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/admin/properties">
                    Properties
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary px-3" to="/admin/bookings">
                    Bookings
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <Link
                  to={
                    user.role === 'Admin'
                      ? '/admin/profile'
                      : user.role === 'Owner'
                      ? '/owner/profile'
                      : '/renter/profile'
                  }
                  className="d-flex align-items-center gap-2 text-decoration-none text-secondary fw-semibold"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                      alt={user.name}
                      className="rounded-circle object-fit-cover"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                    >
                      <FaUser />
                    </div>
                  )}
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-link text-decoration-none text-secondary fw-semibold">
                  Sign In
                </Link>
                <Link to="/register" className="btn fw-semibold text-white px-4" style={{ backgroundColor: '#4DA8FF' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
