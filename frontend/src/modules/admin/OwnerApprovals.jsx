import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaSearch, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import axios from 'axios';

const OwnerApprovals = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/owners', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOwners(data.data);
      }
    } catch (err) {
      toast.error('Failed to load owners directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:5000/api/admin/owners/${id}/${action}`;
      const res = await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success(action === 'approve' ? 'Landlord approved!' : 'Landlord status set to pending.');
        fetchOwners();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update owner status');
    }
  };

  const filteredOwners = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
  );

  if (loading) return <Loader message="Fetching owners list..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Landlord Approvals</h2>
          <p className="text-secondary mb-0">Approve or reject property owner profiles for listing permissions</p>
        </div>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-white border-end-0 text-secondary">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0 text-dark"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {filteredOwners.length === 0 ? (
            <p className="text-muted text-center py-5 mb-0">No owners registered yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="table-light text-secondary">
                    <th className="px-4 py-3">Landlord Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.map((o) => (
                    <tr key={o._id}>
                      <td className="px-4 py-3 fw-semibold text-dark">{o.name}</td>
                      <td className="px-4 py-3 text-secondary">{o.email}</td>
                      <td className="px-4 py-3 text-secondary">{o.phone}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge ${
                            o.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        {o.status === 'Pending' ? (
                          <button
                            onClick={() => handleAction(o._id, 'approve')}
                            className="btn btn-success btn-sm fw-semibold d-inline-flex align-items-center gap-1"
                          >
                            <FaUserCheck /> Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(o._id, 'reject')}
                            className="btn btn-outline-danger btn-sm fw-semibold d-inline-flex align-items-center gap-1"
                          >
                            <FaUserTimes /> Reject / Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerApprovals;
