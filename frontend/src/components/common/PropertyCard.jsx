import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import { formatCurrency, getPropertyImages, capitalize } from '../../utils/helpers';

const PropertyCard = ({ property, showStatus = false }) => {
  const images = getPropertyImages(property);
  const id = property._id;

  return (
    <div className="premium-card property-card-premium h-100 animate-fade-in">
      <Link to={`/property/${id}`}>
        <div className="card-img-wrap">
          <img src={images[0]} alt={property.title} loading="lazy" />
          <span className="price-tag">{formatCurrency(property.price)}/mo</span>
          <span className="type-badge">{capitalize(property.type)}</span>
        </div>
      </Link>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Link to={`/property/${id}`}>
            <h5 className="mb-0 fw-bold">{property.title}</h5>
          </Link>
          {showStatus && property.status && (
            <span className={`badge bg-${property.status === 'approved' ? 'success' : property.status === 'pending' ? 'warning' : 'danger'} text-capitalize`}>
              {property.status}
            </span>
          )}
        </div>
        <p className="text-muted small mb-2 d-flex align-items-center gap-1">
          <FaMapMarkerAlt className="text-primary" /> {property.location}
        </p>
        <p className="text-muted small text-truncate mb-3">{property.description}</p>
        <div className="d-flex gap-3 text-muted small">
          <span><FaBed className="text-primary me-1" />{property.bedrooms}</span>
          <span><FaBath className="text-primary me-1" />{property.bathrooms}</span>
          <span><FaRulerCombined className="text-primary me-1" />{property.area} sqft</span>
        </div>
        <Link to={`/property/${id}`} className="btn btn-primary btn-sm w-100 mt-3">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
