import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaCamera } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.profileImage
      ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`)
      : ''
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Indian Phone Validation
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid 10-digit Indian mobile number (e.g. +91 9876543210)');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      if (form.password) formData.append('password', form.password);
      if (file) formData.append('profileImage', file);

      const token = localStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success('Profile updated successfully!');
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Profile</h2>
        <p className="text-secondary mb-0">Manage your profile details and security settings</p>
      </div>

      <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mx-auto" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative" style={{ width: '100px', height: '100px' }}>
              {preview ? (
                <img
                  src={preview}
                  alt={form.name}
                  className="rounded-circle w-100 h-100 object-fit-cover border"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-muted w-100 h-100"
                >
                  <FaUser style={{ fontSize: '2.5rem' }} />
                </div>
              )}
              <label
                htmlFor="avatar-input"
                className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow"
                style={{
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaCamera />
              </label>
              <input
                id="avatar-input"
                type="file"
                className="d-none"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="form-text small text-secondary mt-2">Click camera to upload avatar photo</div>
          </div>

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold text-secondary">Full Name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Email Address</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Phone Number</label>
              <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold text-secondary">New Password (Leave blank to keep current)</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn text-white w-100 py-2 fw-bold mt-4"
            style={{ backgroundColor: '#4DA8FF' }}
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
