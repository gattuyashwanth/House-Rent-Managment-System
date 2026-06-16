import React, { useState, useEffect } from 'react';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProp, setEditingProp] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editFiles, setEditFiles] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/owner/properties', {
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
    if (!window.confirm('Are you sure you want to permanently delete this property and all associated bookings?')) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.delete(`http://localhost:5000/api/owner/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message || 'Property listing deleted');
        setProperties((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const startEdit = (property) => {
    setEditingProp(property);
    setEditForm({
      title: property.title,
      description: property.description,
      address: property.address,
      location: property.location,
      rentAmount: property.rentAmount,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      propertySize: property.propertySize,
      furnishingStatus: property.furnishingStatus,
      amenities: property.amenities ? property.amenities.join(', ') : '',
      ownerContact: property.ownerContact || '',
      availabilityStatus: property.availabilityStatus || 'Available',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    setEditFiles(e.target.files);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Indian Phone Validation
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (editForm.ownerContact && !phoneRegex.test(editForm.ownerContact.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid 10-digit Indian mobile number for contact (e.g. +91 9876543210)');
      return;
    }

    setEditLoading(true);

    try {
      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        formData.append(key, editForm[key]);
      });

      for (let i = 0; i < editFiles.length; i++) {
        formData.append('images', editFiles[i]);
      }

      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:5000/api/owner/properties/${editingProp._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        toast.success('Property details updated successfully!');
        setEditingProp(null);
        fetchProperties();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <Loader message="Fetching your listings..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Rental Listings</h2>
          <p className="text-secondary mb-0">Review, modify, or delete listed properties</p>
        </div>
        <Link to="/owner/add-property" className="btn text-white fw-semibold" style={{ backgroundColor: '#4DA8FF' }}>
          <FaPlus className="me-1" /> Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-3">
          <FaBuilding className="fs-1 text-muted mb-3" />
          <h5>No Properties Listed Yet</h5>
          <p className="text-secondary mb-3">Add properties to receive booking requests from renters.</p>
          <Link to="/owner/add-property" className="btn text-white fw-semibold" style={{ backgroundColor: '#4DA8FF' }}>
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {properties.map((p) => (
            <div key={p._id} className="col-md-6 col-lg-4">
              <PropertyCard property={p} isOwner={true} onEdit={startEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {editingProp && (
        <div
          className="modal show d-block animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, overflowY: 'auto' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
              <div className="modal-header border-0 pt-4 px-4 pb-0">
                <h5 className="modal-title fw-bold">Edit Property Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingProp(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold text-secondary">Property Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={editForm.title || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Property Type *</label>
                      <select
                        className="form-select"
                        name="propertyType"
                        value={editForm.propertyType || ''}
                        onChange={handleEditChange}
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Villa">Villa</option>
                        <option value="PG">PG</option>
                        <option value="Commercial Shop">Commercial Shop</option>
                        <option value="Office Space">Office Space</option>
                        <option value="Hostel">Hostel</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Rent (₹/month) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="rentAmount"
                        value={editForm.rentAmount || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Contact Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="ownerContact"
                        value={editForm.ownerContact || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Availability Status *</label>
                      <select
                        className="form-select"
                        name="availabilityStatus"
                        value={editForm.availabilityStatus || ''}
                        onChange={handleEditChange}
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Bedrooms *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="bedrooms"
                        value={editForm.bedrooms || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Bathrooms *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="bathrooms"
                        value={editForm.bathrooms || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Size (sqft) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="propertySize"
                        value={editForm.propertySize || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Location / City *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={editForm.location || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={editForm.address || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Furnishing Status *</label>
                      <select
                        className="form-select"
                        name="furnishingStatus"
                        value={editForm.furnishingStatus || ''}
                        onChange={handleEditChange}
                      >
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Upload New Photos (Overrides previous)</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleEditFileChange}
                        multiple
                        accept="image/*"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Amenities (Comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="amenities"
                        value={editForm.amenities || ''}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Property Description *</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={editForm.description || ''}
                        onChange={handleEditChange}
                        rows="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4 justify-content-end">
                    <button type="button" onClick={() => setEditingProp(null)} className="btn btn-outline-secondary">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn text-white fw-bold"
                      style={{ backgroundColor: '#4DA8FF' }}
                      disabled={editLoading}
                    >
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
