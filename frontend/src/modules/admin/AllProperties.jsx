import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import PropertyCard from '../../components/PropertyCard';
import { toast } from 'react-toastify';
import { FaSearch, FaBuilding } from 'react-icons/fa';
import axios from 'axios';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setProperties(data.data);
      }
    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this property listing from the platform?')) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.delete(`http://localhost:5000/api/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success('Listing deleted successfully');
        setProperties((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error('Delete action failed');
    }
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      (p.ownerId?.name && p.ownerId.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loader message="Fetching listings directory..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Listings Directory</h2>
          <p className="text-secondary mb-0">Monitor and delete property listings on the platform</p>
        </div>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-white border-end-0 text-secondary">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0 text-dark"
            placeholder="Search by location, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-3">
          <FaBuilding className="fs-1 text-muted mb-3" />
          <h5>No Property Listings Found</h5>
          <p className="text-secondary">Start listing properties to populate the database directory.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProperties.map((p) => (
            <div key={p._id} className="col-md-6 col-lg-4">
              <PropertyCard property={p} isAdmin={true} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProperties;
