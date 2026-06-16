import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader message="Authenticating..." />;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'Owner') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/renter/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
