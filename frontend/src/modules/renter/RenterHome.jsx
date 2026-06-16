import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaBook, FaUser } from 'react-icons/fa';
import Loader from '../../components/Loader';
import axios from 'axios';

const RenterHome = () => {
  const [stats, setStats] = useState({ available: 0, bookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [resProperties, resBookings] = await Promise.all([
          axios.get('http://localhost:5000/api/user/properties'),
          axios.get('http://localhost:5000/api/user/bookings', { headers }),
        ]);

        if (resProperties.data.success && resBookings.data.success) {
          const availableCount = resProperties.data.data.filter(
            (p) => p.availabilityStatus === 'Available'
          ).length;
          setStats({
            available: availableCount,
            bookings: resBookings.data.count,
          });
          setRecentBookings(resBookings.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching renter stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader message="Loading Tenant Dashboard..." />;

  const getStatusBadge = (status) => {
    if (status === 'Approved') return <span className="badge bg-success">Approved</span>;
    if (status === 'Rejected') return <span className="badge bg-danger">Rejected</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Renter Dashboard</h2>
          <p className="text-secondary mb-0">Track bookings and browse available rentals</p>
        </div>
        <Link to="/renter/properties" className="btn fw-semibold text-white" style={{ backgroundColor: '#4DA8FF' }}>
          Browse Rentals
        </Link>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '56px', height: '56px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaBuilding className="fs-4" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1">Available Properties</h6>
                <h3 className="fw-bold mb-0">{stats.available}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '56px', height: '56px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaBook className="fs-4" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1">My Bookings</h6>
                <h3 className="fw-bold mb-0">{stats.bookings}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '56px', height: '56px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaUser className="fs-4" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1">Saved Properties</h6>
                <h3 className="fw-bold mb-0">0</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Recent Bookings</h5>
          <Link to="/renter/bookings" className="text-decoration-none small fw-semibold" style={{ color: '#4DA8FF' }}>
            View History
          </Link>
        </div>
        <div className="card-body p-4">
          {recentBookings.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p className="mb-0">You have no booking requests yet.</p>
              <Link to="/renter/properties" className="small fw-semibold" style={{ color: '#4DA8FF' }}>
                Find properties to book
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="border-0">Property</th>
                    <th className="border-0">Location</th>
                    <th className="border-0">Rent Amount</th>
                    <th className="border-0">Request Date</th>
                    <th className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.propertyId?.title || 'Unknown Property'}</td>
                      <td>{b.propertyId?.location || '-'}</td>
                      <td className="fw-bold" style={{ color: '#4DA8FF' }}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(b.propertyId?.rentAmount || 0)}/month
                      </td>
                      <td>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{getStatusBadge(b.bookingStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenterHome;
