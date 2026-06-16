import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { FaBookOpen, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/user/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch booking history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'Approved') return <span className="badge bg-success px-3 py-2">Approved</span>;
    if (status === 'Rejected') return <span className="badge bg-danger px-3 py-2">Rejected</span>;
    return <span className="badge bg-warning text-dark px-3 py-2">Pending Review</span>;
  };

  if (loading) return <Loader message="Fetching your booking requests..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Booking History</h2>
        <p className="text-secondary mb-0">Track and monitor your property booking request statuses</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-3">
          <FaBookOpen className="fs-1 text-muted mb-3" />
          <h5>No Booking History Found</h5>
          <p className="text-secondary mb-3">You haven't requested any property bookings yet.</p>
          <Link to="/renter/properties" className="btn text-white fw-semibold" style={{ backgroundColor: '#4DA8FF' }}>
            Find Properties
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const property = booking.propertyId || {};
            const owner = booking.ownerId || {};
            const imageSrc = property.images && property.images.length > 0
              ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`)
              : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

            return (
              <div key={booking._id} className="col-12">
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white p-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3" style={{ height: '140px' }}>
                      <img
                        src={imageSrc}
                        alt={property.title || 'Property'}
                        className="w-100 h-100 rounded object-fit-cover"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <span className="badge bg-dark mb-2">{property.propertyType || 'Property'}</span>
                      <h5 className="fw-bold text-dark mb-1">{property.title || 'Deleted Property'}</h5>
                      <p className="text-muted small mb-2">{property.location || '-'}</p>
                      <div className="d-flex flex-wrap gap-3 text-secondary small mb-2">
                        <span><strong>Owner:</strong> {owner.name || 'N/A'}</span>
                        <span><strong>Contact:</strong> {owner.phone || 'N/A'}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1 text-secondary small">
                        <FaCalendarAlt /> Requested Move-in: {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div className="col-md-3 text-md-end d-flex flex-column justify-content-center align-items-md-end gap-2">
                      <span className="fw-bold fs-5 text-dark">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.rentAmount || 0)}/mo
                      </span>
                      {getStatusBadge(booking.bookingStatus)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
