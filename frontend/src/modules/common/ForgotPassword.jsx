import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHome, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import axios from 'axios';

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: '', phone: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/user/forgot-password', form);
      if (data.success) {
        toast.success(data.message || 'Password reset successfully!');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm border-0 p-4 rounded-3" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <FaHome className="fs-1 mb-2" style={{ color: '#4DA8FF' }} />
          <h3 className="fw-bold mb-1">Reset Password</h3>
          <p className="text-secondary small mb-0">Provide details to change password</p>
        </div>
        <form onSubmit={handleSubmit}>
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
                placeholder="1234567890"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">New Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn w-100 py-2 fw-semibold text-white mb-3"
            style={{ backgroundColor: '#4DA8FF' }}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <div className="text-center">
            <Link to="/login" className="text-decoration-none small fw-semibold" style={{ color: '#4DA8FF' }}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
