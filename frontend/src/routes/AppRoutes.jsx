import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../modules/common/Navbar';
import Footer from '../modules/common/Footer';
import ProtectedRoute from './ProtectedRoute';

// Common
import Home from '../modules/common/Home';
import Login from '../modules/common/Login';
import Register from '../modules/common/Register';
import ForgotPassword from '../modules/common/ForgotPassword';

// Renter
import RenterHome from '../modules/renter/RenterHome';
import RenterProperties from '../modules/renter/AllProperties';
import PropertyDetails from '../modules/renter/PropertyDetails';
import BookingHistory from '../modules/renter/BookingHistory';
import RenterProfile from '../modules/renter/Profile';

// Owner
import OwnerHome from '../modules/owner/OwnerHome';
import AddProperty from '../modules/owner/AddProperty';
import OwnerProperties from '../modules/owner/AllProperties';
import OwnerBookings from '../modules/owner/AllBookings';
import OwnerProfile from '../modules/owner/Profile';

// Admin
import AdminHome from '../modules/admin/AdminHome';
import AdminUsers from '../modules/admin/AllUsers';
import OwnerApprovals from '../modules/admin/OwnerApprovals';
import AdminProperties from '../modules/admin/AllProperties';
import AdminBookings from '../modules/admin/AllBookings';
import AdminProfile from '../modules/admin/Profile';

const AppRoutes = () => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="flex-grow-1" style={{ backgroundColor: '#F5F7FA' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Renter Routes */}
          <Route path="/renter/dashboard" element={<ProtectedRoute role="Renter"><RenterHome /></ProtectedRoute>} />
          <Route path="/renter/properties" element={<ProtectedRoute role="Renter"><RenterProperties /></ProtectedRoute>} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/renter/bookings" element={<ProtectedRoute role="Renter"><BookingHistory /></ProtectedRoute>} />
          <Route path="/renter/profile" element={<ProtectedRoute role="Renter"><RenterProfile /></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute role="Owner"><OwnerHome /></ProtectedRoute>} />
          <Route path="/owner/add-property" element={<ProtectedRoute role="Owner"><AddProperty /></ProtectedRoute>} />
          <Route path="/owner/my-properties" element={<ProtectedRoute role="Owner"><OwnerProperties /></ProtectedRoute>} />
          <Route path="/owner/bookings" element={<ProtectedRoute role="Owner"><OwnerBookings /></ProtectedRoute>} />
          <Route path="/owner/profile" element={<ProtectedRoute role="Owner"><OwnerProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><AdminHome /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="Admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/owners" element={<ProtectedRoute role="Admin"><OwnerApprovals /></ProtectedRoute>} />
          <Route path="/admin/approvals" element={<ProtectedRoute role="Admin"><OwnerApprovals /></ProtectedRoute>} />
          <Route path="/admin/properties" element={<ProtectedRoute role="Admin"><AdminProperties /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="Admin"><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute role="Admin"><AdminProfile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes;
