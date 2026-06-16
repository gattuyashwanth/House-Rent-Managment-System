import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      toast.error('Failed to load bookings log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      (b.propertyId?.title && b.propertyId.title.toLowerCase().includes(search.toLowerCase())) ||
      (b.ownerId?.name && b.ownerId.name.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    if (status === 'Approved') return <span className="badge bg-success">Approved</span>;
    if (status === 'Rejected') return <span className="badge bg-danger">Rejected</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  if (loading) return <Loader message="Fetching bookings logs..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Rentals Bookings Log</h2>
          <p className="text-secondary mb-0">Total of {bookings.length} booking transactions logged</p>
        </div>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-white border-end-0 text-secondary">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0 text-dark"
            placeholder="Search by tenant, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {filteredBookings.length === 0 ? (
            <p className="text-muted text-center py-5 mb-0">No bookings logged matching search criteria.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="table-light text-secondary">
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Tenant Details</th>
                    <th className="px-4 py-3">Landlord Details</th>
                    <th className="px-4 py-3">Booking Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="px-4 py-3">
                        <div className="fw-semibold text-dark">{b.propertyId?.title || 'Deleted Property'}</div>
                        <small className="text-muted">{b.propertyId?.location || '-'}</small>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-dark fw-semibold">{b.userName}</div>
                        <small className="text-secondary">{b.phone}</small>
                      </td>
                      <td className="px-4 py-3 text-secondary">
                        <div className="text-dark fw-semibold">{b.ownerId?.name || '-'}</div>
                        <small className="text-secondary">{b.ownerId?.phone || '-'}</small>
                      </td>
                      <td className="px-4 py-3 text-secondary small">
                        <FaCalendarAlt className="me-1" />
                        {new Date(b.bookingDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(b.bookingStatus)}</td>
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

export default AllBookings;
