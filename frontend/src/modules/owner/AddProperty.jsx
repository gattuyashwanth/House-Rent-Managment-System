import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    location: '',
    rentAmount: '',
    propertyType: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    propertySize: '',
    furnishingStatus: 'Unfurnished',
    amenities: '',
    ownerContact: '',
  });

  const [addressFields, setAddressFields] = useState({
    houseNo: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddressChange = (e) => {
    setAddressFields({ ...addressFields, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Indian Phone Validation for ownerContact
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(form.ownerContact.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid 10-digit Indian mobile number for owner contact (e.g. +91 9876543210)');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'address') {
          const combinedAddress = `${addressFields.houseNo}, ${addressFields.street}, ${addressFields.area}, ${addressFields.city}, ${addressFields.state} - ${addressFields.pincode}`;
          formData.append('address', combinedAddress);
        } else {
          formData.append(key, form[key]);
        }
      });

      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/owner/properties', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success('Property listing added successfully!');
        navigate('/owner/my-properties');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add property listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">List a New Property</h2>
        <p className="text-secondary mb-0">Fill in the details to submit your rental listing</p>
      </div>

      <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold text-secondary">Property Title *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Spacious 2 BHK Apartment near Metro"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary">Property Type *</label>
              <select className="form-select" name="propertyType" value={form.propertyType} onChange={handleChange}>
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="PG">PG</option>
                <option value="Commercial Shop">Commercial Shop</option>
                <option value="Office Space">Office Space</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Rent Amount (₹/month) *</label>
              <input
                type="number"
                className="form-control"
                name="rentAmount"
                value={form.rentAmount}
                onChange={handleChange}
                placeholder="e.g. 15000"
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Owner Contact Phone *</label>
              <input
                type="tel"
                className="form-control"
                name="ownerContact"
                value={form.ownerContact}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary">Bedrooms *</label>
              <input
                type="number"
                className="form-control"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                placeholder="e.g. 2"
                min="0"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary">Bathrooms *</label>
              <input
                type="number"
                className="form-control"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                placeholder="e.g. 2"
                min="0"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary">Property Size (sqft) *</label>
              <input
                type="number"
                className="form-control"
                name="propertySize"
                value={form.propertySize}
                onChange={handleChange}
                placeholder="e.g. 1200"
                min="0"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Location / City (For filters) *</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Madhapur, Hyderabad"
                required
              />
            </div>
            <div className="col-12 mt-3">
              <h6 className="fw-bold text-dark mb-3">Address Details (Indian Format)</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">House No / Flat No *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="houseNo"
                    value={addressFields.houseNo}
                    onChange={handleAddressChange}
                    placeholder="e.g. Flat No 203"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Building / Street Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="street"
                    value={addressFields.street}
                    onChange={handleAddressChange}
                    placeholder="e.g. Sai Residency"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Area / Colony *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="area"
                    value={addressFields.area}
                    onChange={handleAddressChange}
                    placeholder="e.g. Madhapur"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={addressFields.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Hyderabad"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={addressFields.state}
                    onChange={handleAddressChange}
                    placeholder="e.g. Telangana"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    value={addressFields.pincode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 500081"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Furnishing Status *</label>
              <select className="form-select" name="furnishingStatus" value={form.furnishingStatus} onChange={handleChange}>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Upload Property Photos (Max 5)</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">Amenities (Comma-separated)</label>
              <input
                type="text"
                className="form-control"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="e.g. Parking, Lift, Power Backup, 24x7 Water Supply, Security, CCTV, Wi-Fi, Gas Connection"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">Property Description *</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the property details, surroundings, terms..."
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn text-white fw-bold px-4"
              style={{ backgroundColor: '#4DA8FF' }}
              disabled={loading}
            >
              {loading ? 'Submitting Listing...' : 'Add Property'}
            </button>
            <button type="button" onClick={() => navigate('/owner/dashboard')} className="btn btn-outline-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
