import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHome, FaUser, FaEnvelope, FaPhone, FaLock, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'Renter' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Indian Phone Validation: optional +91/91, followed by 10-digit starting with 6-9
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid 10-digit Indian mobile number (e.g., 9876543210 or with +91 prefix)');
      return;
    }

    setLoading(true);
    try {
      const user = await register(form);
      toast.success(
        user.role === 'Owner'
          ? 'Registration successful! Waiting for admin approval.'
          : 'Registration successful!'
      );
      if (user.role === 'Owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/renter/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm border-0 p-4 rounded-3 animate-fade-in" style={{ width: '100%', maxWidth: '460px' }}>
        <div className="text-center mb-4">
          <FaHome className="fs-1 mb-2" style={{ color: '#4DA8FF' }} />
          <h3 className="fw-bold mb-1">Create Account</h3>
          <p className="text-secondary small mb-0">Join RentEase to find or list properties</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Full Name</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text"><FaPhone /></span>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Password (Min. 6 chars)</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Register As</label>
            <div className="input-group">
              <span className="input-group-text"><FaBuilding /></span>
              <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                <option value="Renter">Renter / Tenant</option>
                <option value="Owner">Owner / Landlord</option>
              </select>
            </div>
            {form.role === 'Owner' && (
              <div className="form-text small text-warning mt-2">
                * Landlord accounts require admin approval before adding property listings.
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn w-100 py-2 fw-semibold text-white mb-3"
            style={{ backgroundColor: '#4DA8FF' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
          <p className="text-center text-secondary small mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#4DA8FF' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
