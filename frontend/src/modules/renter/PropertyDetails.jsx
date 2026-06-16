import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import axios from 'axios';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/user/properties/${id}`);
        if (data.success) {
          setProperty(data.data);
        }
      } catch (err) {
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please log in as a Renter to book properties.');
      navigate('/login');
      return;
    }

    if (user.role !== 'Renter') {
      toast.error('Only renters can send booking requests.');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/user/bookings',
        { propertyId: property._id, bookingDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success('Booking request sent successfully!');
        navigate('/renter/bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking request failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader message="Fetching property details..." />;
  if (!property) return <div className="container py-5 text-center"><h3>Property not found</h3></div>;

  const owner = property.ownerId || {};
  const imageSrc = property.images && property.images.length > 0
    ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`)
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="container py-5">
      <Link to="/renter/properties" className="btn btn-link ps-0 mb-3 text-decoration-none" style={{ color: '#4DA8FF' }}>
        &larr; Back to Listings
      </Link>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden mb-4 bg-white rounded-3">
            <img src={imageSrc} alt={property.title} className="w-100 object-fit-cover" style={{ maxHeight: '450px', objectFit: 'cover' }} />
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="h2 fw-bold text-dark mb-1">{property.title}</h1>
                  <p className="text-muted mb-0 d-flex align-items-center gap-1 small">
                    <FaMapMarkerAlt /> {property.address}, {property.location}
                  </p>
                </div>
                <span className="badge px-3 py-2 text-capitalize fs-6 text-white" style={{ backgroundColor: '#4DA8FF' }}>
                  {property.propertyType}
                </span>
              </div>

              <h3 className="fw-bold mb-4" style={{ color: '#4DA8FF' }}>
                {formatCurrency(property.rentAmount)}
                <small className="text-muted fs-6 fw-normal">/month</small>
              </h3>

              <h5 className="fw-bold mb-2">Description</h5>
              <p className="text-secondary mb-4" style={{ lineHeight: '1.6' }}>
                {property.description}
              </p>

              <div className="row g-3 mb-4">
                {[
                  { icon: FaBed, label: 'Bedrooms', value: `${property.bedrooms} Bed` },
                  { icon: FaBath, label: 'Bathrooms', value: `${property.bathrooms} Bath` },
                  { icon: FaRulerCombined, label: 'Area Size', value: `${property.propertySize} sqft` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="col-4">
                    <div className="bg-light p-3 rounded-3 text-center border">
                      <Icon className="fs-4 mb-1" style={{ color: '#4DA8FF' }} />
                      <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{value}</div>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>{label}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h5 className="fw-bold mb-2">Furnishing Status</h5>
                <span className="badge bg-secondary px-3 py-2 text-capitalize">{property.furnishingStatus}</span>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h5 className="fw-bold mb-2">Amenities</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span key={a} className="bg-light border px-3 py-1 rounded-pill small text-secondary">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mb-4">
            <h5 className="fw-bold mb-3">Listed By</h5>
            <div className="d-flex align-items-center gap-3 mb-3">
              {owner.profileImage ? (
                <img
                  src={owner.profileImage.startsWith('http') ? owner.profileImage : `http://localhost:5000${owner.profileImage}`}
                  alt={owner.name}
                  className="rounded-circle object-fit-cover"
                  style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px' }}
                >
                  <FaUser className="fs-4" />
                </div>
              )}
              <div>
                <h6 className="fw-bold mb-0">{owner.name || 'Owner'}</h6>
                <small className="text-muted">Verified Landlord</small>
              </div>
            </div>

            {showInfo ? (
              <div className="border-top pt-3 animate-fade-in">
                <p className="small mb-2 d-flex align-items-center gap-2 text-dark">
                  <FaEnvelope className="text-secondary" /> {owner.email}
                </p>
                <p className="small mb-0 d-flex align-items-center gap-2 text-dark">
                  <FaPhone className="text-secondary" /> {property.ownerContact || owner.phone}
                </p>
              </div>
            ) : (
              <button onClick={() => setShowInfo(true)} className="btn btn-outline-secondary w-100 fw-semibold btn-sm">
                <FaInfoCircle className="me-1" /> Get Info / Contact Details
              </button>
            )}
          </div>

          {property.availabilityStatus === 'Available' && (!user || user.role === 'Renter') && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3 animate-fade-in">
              <h5 className="fw-bold mb-3">Book Property</h5>
              <form onSubmit={handleBooking}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Preferred Move-in Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 py-2 fw-bold text-white"
                  style={{ backgroundColor: '#4DA8FF' }}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Sending Request...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          )}

          {property.availabilityStatus === 'Booked' && (
            <div className="alert alert-danger text-center fw-semibold rounded-3 shadow-sm mb-0">
              This property has already been booked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
