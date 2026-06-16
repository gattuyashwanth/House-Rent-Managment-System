import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaClipboardCheck, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/owner/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      toast.error('Failed to load received bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:5000/api/owner/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(`Booking request ${status.toLowerCase()} successfully!`);
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') return <span className="badge bg-success px-3 py-2">Approved</span>;
    if (status === 'Rejected') return <span className="badge bg-danger px-3 py-2">Rejected</span>;
    return <span className="badge bg-warning text-dark px-3 py-2">Pending Review</span>;
  };

  if (loading) return <Loader message="Fetching bookings..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Booking Requests Received</h2>
        <p className="text-secondary mb-0">Approve or reject booking requests from tenants</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-3">
          <FaClipboardCheck className="fs-1 text-muted mb-3" />
          <h5>No Booking Requests Yet</h5>
          <p className="text-secondary mb-0">You will see requests here when tenants apply for your properties.</p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const property = booking.propertyId || {};
            const imageSrc = property.images && property.images.length > 0
              ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`)
              : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

            return (
              <div key={booking._id} className="col-12 animate-fade-in">
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white p-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-2" style={{ height: '110px' }}>
                      <img
                        src={imageSrc}
                        alt={property.title || 'Property'}
                        className="w-100 h-100 rounded object-fit-cover"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-5">
                      <span className="badge bg-secondary mb-1 text-capitalize">{property.propertyType}</span>
                      <h5 className="fw-bold text-dark mb-1">{property.title || 'Deleted Property'}</h5>
                      <p className="text-muted small mb-2">{property.location}</p>
                      <div className="d-flex align-items-center gap-1 text-secondary small">
                        <FaCalendarAlt /> Preferred Move-in: {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <h6 className="fw-bold text-dark mb-1">Tenant Details:</h6>
                      <p className="text-secondary small mb-1">Name: {booking.userName}</p>
                      <p className="text-secondary small mb-0 d-flex align-items-center gap-1">
                        <FaPhone className="fs-7" /> {booking.phone}
                      </p>
                    </div>
                    <div className="col-md-2 text-md-end d-flex flex-column gap-2 justify-content-center align-items-md-end">
                      <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.rentAmount || 0)}/mo
                      </span>
                      {booking.bookingStatus === 'Pending' ? (
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleAction(booking._id, 'Approved')}
                            className="btn btn-success btn-sm fw-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(booking._id, 'Rejected')}
                            className="btn btn-outline-danger btn-sm fw-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        getStatusBadge(booking.bookingStatus)
                      )}
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

export default AllBookings;
