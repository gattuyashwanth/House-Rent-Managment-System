import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import SearchFilter from '../../components/SearchFilter';
import Loader from '../../components/Loader';
import axios from 'axios';

const AllProperties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: '',
    propertyType: searchParams.get('propertyType') || '',
    bedrooms: '',
    bathrooms: '',
    furnishingStatus: '',
    search: '',
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const activeFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== '') {
          activeFilters[key] = filters[key];
        }
      });
      const query = new URLSearchParams(activeFilters).toString();

      const { data } = await axios.get(`http://localhost:5000/api/user/properties?${query}`);
      if (data.success) {
        setProperties(data.data);
      }
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      furnishingStatus: '',
      search: '',
    });
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Available Rental Properties</h2>
        <p className="text-secondary mb-0">Apply filters to narrow down your perfect rental home</p>
      </div>

      <SearchFilter filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

      {loading ? (
        <Loader message="Fetching listings..." />
      ) : properties.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-3">
          <h5>No rentals match your search criteria.</h5>
          <p className="text-secondary">Try resetting filters or adjusting search keyword.</p>
          <button onClick={handleReset} className="btn text-white mt-2 fw-semibold" style={{ backgroundColor: '#4DA8FF' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-secondary mb-3 fw-semibold">{properties.length} Listings Found</p>
          <div className="row g-4">
            {properties.map((p) => (
              <div key={p._id} className="col-md-6 col-lg-4">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllProperties;
