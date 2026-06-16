import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaClipboardList, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import axios from 'axios';

const OwnerHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ averageRent: 0, monthlyBookings: 0, available: 0, occupancyRate: 0, totalRevenue: 0 });
  const [recentRequests, setRecentRequests] = useState([]);

  const formatINR = (val) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  useEffect(() => {
    const fetchOwnerDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [resProps, resBookings] = await Promise.all([
          axios.get('http://localhost:5000/api/owner/properties', { headers }),
          axios.get('http://localhost:5000/api/owner/bookings', { headers }),
        ]);

        if (resProps.data.success && resBookings.data.success) {
          const props = resProps.data.data;
          const bookings = resBookings.data.data;

          const total = props.length;
          const available = props.filter((p) => p.availabilityStatus === 'Available').length;
          const booked = props.filter((p) => p.availabilityStatus === 'Booked').length;

          // Average Rent
          const totalRent = props.reduce((acc, p) => acc + (p.rentAmount || 0), 0);
          const averageRent = total > 0 ? Math.round(totalRent / total) : 0;

          // Occupancy Rate
          const occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;

          // Total Revenue (booked properties rent sum)
          const totalRevenue = props
            .filter((p) => p.availabilityStatus === 'Booked')
            .reduce((acc, p) => acc + (p.rentAmount || 0), 0);

          // Monthly Bookings (created in the current month)
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
          const monthlyBookings = bookings.filter((b) => {
            const bDate = new Date(b.createdAt);
            return bDate.getFullYear() === currentYear && bDate.getMonth() === currentMonth;
          }).length;

          setStats({ averageRent, monthlyBookings, available, occupancyRate, totalRevenue });
          setRecentRequests(bookings.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching owner dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerDashboard();
  }, []);

  if (loading) return <Loader message="Loading Landlord Dashboard..." />;

  const isApproved = user && user.status === 'Approved';

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Owner Dashboard</h2>
          <p className="text-secondary mb-0">Manage listings, edit details, and process rentals</p>
        </div>
        {isApproved && (
          <Link to="/owner/add-property" className="btn text-white fw-semibold" style={{ backgroundColor: '#4DA8FF' }}>
            <FaPlus className="me-1" /> Add Property
          </Link>
        )}
      </div>

      {!isApproved && (
        <div className="alert alert-warning shadow-sm rounded-3 border-0 py-3 mb-4 animate-fade-in">
          <h5 className="fw-bold alert-heading mb-1">Account Pending Approval</h5>
          <p className="mb-0 small">
            Your landlord profile is currently undergoing verification. Admin must review and approve your account before you can start listing properties.
          </p>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-5">
        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Average Rent</h6>
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>{formatINR(stats.averageRent)}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Monthly Bookings</h6>
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>{stats.monthlyBookings}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Available Properties</h6>
            <h4 className="fw-bold mb-0 text-success" style={{ fontSize: '1.25rem' }}>{stats.available}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Occupancy Rate</h6>
            <h4 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.25rem' }}>{stats.occupancyRate}%</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Total Revenue</h6>
            <h4 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.25rem' }}>{formatINR(stats.totalRevenue)}</h4>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white mb-4 animate-fade-in">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Recent Booking Requests</h5>
          <Link to="/owner/bookings" className="text-decoration-none small fw-semibold" style={{ color: '#4DA8FF' }}>
            Manage All
          </Link>
        </div>
        <div className="card-body p-4">
          {recentRequests.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">No booking requests received yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="border-0">Tenant Name</th>
                    <th className="border-0">Property</th>
                    <th className="border-0">Tenant Phone</th>
                    <th className="border-0">Date Preferred</th>
                    <th className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.userName}</td>
                      <td>{b.propertyId?.title || 'Deleted Property'}</td>
                      <td>{b.phone}</td>
                      <td>{new Date(b.bookingDate).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.bookingStatus === 'Approved'
                              ? 'bg-success'
                              : b.bookingStatus === 'Rejected'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
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

export default OwnerHome;
