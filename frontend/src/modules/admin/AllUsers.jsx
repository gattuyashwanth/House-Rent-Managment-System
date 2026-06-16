import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaSearch, FaUser } from 'react-icons/fa';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      toast.error('Failed to load renters list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  if (loading) return <Loader message="Loading renters list..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Registered Renters</h2>
          <p className="text-secondary mb-0">Total of {users.length} tenants registered on the platform</p>
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
          {filteredUsers.length === 0 ? (
            <p className="text-muted text-center py-5 mb-0">No renters found matching search criteria.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="table-light text-secondary">
                    <th className="px-4 py-3">Renter</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          {u.profileImage ? (
                            <img
                              src={u.profileImage.startsWith('http') ? u.profileImage : `http://localhost:5000${u.profileImage}`}
                              alt={u.name}
                              className="rounded-circle object-fit-cover"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}
                            >
                              <FaUser />
                            </div>
                          )}
                          <span className="fw-semibold text-dark">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-secondary">{u.email}</td>
                      <td className="px-4 py-3 text-secondary">{u.phone}</td>
                      <td className="px-4 py-3 text-secondary small">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
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

export default AllUsers;
