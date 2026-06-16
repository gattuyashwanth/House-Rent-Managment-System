import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa';

const PropertyCard = ({ property, showStatus = false, onEdit, onDelete, isAdmin = false, isOwner = false }) => {
  const imageSrc = property.images && property.images.length > 0
    ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`)
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  const availability = property.availabilityStatus || 'Available';

  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden bg-white">
      <div className="position-relative" style={{ height: '200px' }}>
        <img
          src={imageSrc}
          alt={property.title}
          className="w-100 h-100 object-fit-cover"
          style={{ objectFit: 'cover' }}
        />
        <span
          className={`position-absolute badge ${
            availability === 'Available' ? 'bg-success' : 'bg-danger'
          }`}
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
        >
          {availability}
        </span>
        <span
          className="position-absolute bg-dark text-white px-2 py-1 rounded small"
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem' }}
        >
          {property.propertyType}
        </span>
      </div>
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h5 className="card-title fw-bold text-dark text-truncate mb-0" style={{ maxWidth: '70%', fontSize: '1.1rem' }}>
              {property.title}
            </h5>
            <span className="fw-bold" style={{ color: '#4DA8FF', fontSize: '1.1rem' }}>
              {formatCurrency(property.rentAmount)}/mo
            </span>
          </div>
          <p className="text-muted small mb-2 d-flex align-items-center gap-1">
            <FaMapMarkerAlt /> {property.location}
          </p>
          <p className="text-secondary small mb-3" style={{ fontSize: '0.85rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {property.description}
          </p>
          <div className="d-flex justify-content-between text-muted mb-3 small border-top pt-2">
            <span><FaBed className="me-1" /> {property.bedrooms} Bed</span>
            <span><FaBath className="me-1" /> {property.bathrooms} Bath</span>
            <span><FaRulerCombined className="me-1" /> {property.propertySize || 0} sqft</span>
          </div>
        </div>
        <div>
          {isOwner ? (
            <div className="d-flex gap-2">
              <button onClick={() => onEdit(property)} className="btn btn-outline-primary btn-sm flex-fill">
                Edit
              </button>
              <button onClick={() => onDelete(property._id)} className="btn btn-outline-danger btn-sm flex-fill">
                Delete
              </button>
            </div>
          ) : isAdmin ? (
            <button onClick={() => onDelete(property._id)} className="btn btn-danger btn-sm w-100">
              Delete Listing
            </button>
          ) : (
            <Link to={`/property/${property._id}`} className="btn w-100 fw-semibold text-white" style={{ backgroundColor: '#4DA8FF' }}>
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
