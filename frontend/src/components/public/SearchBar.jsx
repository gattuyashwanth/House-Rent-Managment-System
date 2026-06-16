import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaHome, FaDollarSign } from 'react-icons/fa';
import { PROPERTY_TYPES } from '../../utils/constants';

const SearchBar = ({ variant = 'hero', initial = {} }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    search: initial.search || '',
    location: initial.location || '',
    type: initial.type || '',
    minPrice: initial.minPrice || '',
    maxPrice: initial.maxPrice || '',
  });

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  const wrapperClass = variant === 'hero' ? 'search-box-premium' : 'premium-card p-4';

  return (
    <div className={wrapperClass}>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Keyword</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent"><FaSearch /></span>
              <input type="text" className="form-control" name="search" placeholder="Search properties..." value={filters.search} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Location</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent"><FaMapMarkerAlt /></span>
              <input type="text" className="form-control" name="location" placeholder="City, State" value={filters.location} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Type</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent"><FaHome /></span>
              <select className="form-select" name="type" value={filters.type} onChange={handleChange}>
                <option value="">All Types</option>
                {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Min Price</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent"><FaDollarSign /></span>
              <input type="number" className="form-control" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold">Max Price</label>
            <input type="number" className="form-control" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100 py-2">
              <FaSearch />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
