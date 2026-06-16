import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHome, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/renter/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm border-0 p-4 rounded-3 animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <FaHome className="fs-1 mb-2" style={{ color: '#4DA8FF' }} />
          <h3 className="fw-bold mb-1">Sign In</h3>
          <p className="text-secondary small mb-0">Welcome back! Please enter your details</p>
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
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold text-secondary mb-0">Password</label>
              <Link to="/forgot-password" style={{ color: '#4DA8FF', fontSize: '0.85rem' }} className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>
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
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn w-100 py-2 fw-semibold text-white mb-3"
            style={{ backgroundColor: '#4DA8FF' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="text-center text-secondary small mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#4DA8FF' }}>
              Register Here
            </Link>
          </p>
        </form>

        <div className="alert alert-secondary mt-4 mb-0 small border-0 py-2">
          <strong>Admin Account Details:</strong><br />
          Email: gattuyashwanth22@gmail.com<br />
          Password: Gattu
        </div>
      </div>
    </div>
  );
};

export default Login;
