import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { FaUsers, FaUserTie, FaBuilding, FaBook, FaCheckCircle, FaUserClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatINR = (val) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  if (loading) return <Loader message="Fetching admin metrics..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Admin Dashboard Overview</h2>
        <p className="text-secondary mb-0">Platform analytics and resource monitors</p>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4 animate-fade-in">
        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Average Rent</h6>
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>{formatINR(stats.averageRent)}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Monthly Bookings</h6>
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>{stats.monthlyBookings}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Available Properties</h6>
            <h4 className="fw-bold mb-0 text-success" style={{ fontSize: '1.25rem' }}>{stats.availableProperties}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Occupancy Rate</h6>
            <h4 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.25rem' }}>{stats.occupancyRate}%</h4>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
            <h6 className="text-secondary small fw-semibold mb-2">Total Revenue</h6>
            <h4 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.25rem' }}>{formatINR(stats.totalRevenue)}</h4>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-light rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaUsers className="fs-5" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Total Tenants</h6>
                <h5 className="fw-bold mb-0">{stats.totalUsers}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-light rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaUserTie className="fs-5" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Total Landlords</h6>
                <h5 className="fw-bold mb-0">{stats.totalOwners}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-light rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaBuilding className="fs-5" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Total Properties</h6>
                <h5 className="fw-bold mb-0">{stats.totalProperties}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-light rounded-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
              >
                <FaBook className="fs-5" />
              </div>
              <div>
                <h6 className="text-secondary small fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Total Bookings</h6>
                <h5 className="fw-bold mb-0">{stats.totalBookings}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <h5 className="fw-bold mb-3">Owner Verification Status</h5>
            <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
              <span className="text-secondary"><FaUserClock className="me-2 text-warning" /> Pending Approvals</span>
              <span className="fw-bold text-dark">{stats.pendingOwners}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary"><FaCheckCircle className="me-2 text-success" /> Approved Landlords</span>
              <span className="fw-bold text-dark">{stats.approvedOwners}</span>
            </div>
            <Link to="/admin/approvals" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: '#4DA8FF' }}>
              Manage Registrations
            </Link>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <h5 className="fw-bold mb-3">Listings Availability Overview</h5>
            <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
              <span className="text-secondary"><FaBuilding className="me-2 text-success" /> Available Listings</span>
              <span className="fw-bold text-dark">{stats.availableProperties}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary"><FaCheckCircle className="me-2 text-primary" /> Booked Properties</span>
              <span className="fw-bold text-dark">{stats.bookedProperties}</span>
            </div>
            <Link to="/admin/properties" className="btn btn-outline-secondary w-100 fw-semibold">
              Browse Listings Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
