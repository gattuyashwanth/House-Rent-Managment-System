import React from 'react';

const SearchFilter = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mb-4">
      <h5 className="fw-bold mb-3" style={{ color: '#1A1A1A' }}>Filter Listings</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label small fw-semibold text-secondary">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={filters.location || ''}
            onChange={handleChange}
            placeholder="e.g. Hyderabad, New York"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-semibold text-secondary">Min Rent (₹)</label>
          <input
            type="number"
            className="form-control"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-semibold text-secondary">Max Rent (₹)</label>
          <input
            type="number"
            className="form-control"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="50000"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-semibold text-secondary">Property Type</label>
          <select
            className="form-select"
            name="propertyType"
            value={filters.propertyType || ''}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Independent House">Independent House</option>
            <option value="Villa">Villa</option>
            <option value="PG">PG</option>
            <option value="Commercial Shop">Commercial Shop</option>
            <option value="Office Space">Office Space</option>
            <option value="Hostel">Hostel</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-semibold text-secondary">Bedrooms</label>
          <select
            className="form-select"
            name="bedrooms"
            value={filters.bedrooms || ''}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-semibold text-secondary">Bathrooms</label>
          <select
            className="form-select"
            name="bathrooms"
            value={filters.bathrooms || ''}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3+ Baths</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-semibold text-secondary">Furnishing Status</label>
          <select
            className="form-select"
            name="furnishingStatus"
            value={filters.furnishingStatus || ''}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold text-secondary">Search Keyword</label>
          <input
            type="text"
            className="form-control"
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="Search by title or description..."
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button onClick={onReset} className="btn btn-outline-secondary w-100 fw-semibold">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
