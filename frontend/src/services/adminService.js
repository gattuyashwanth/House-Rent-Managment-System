import API from './api';

export const adminService = {
  getStats: () => API.get('/admin/stats'),
  getOwners: () => API.get('/admin/users'),
  getProperties: (params) => API.get('/admin/properties', { params }),
  getPendingProperties: () => API.get('/admin/pending-properties'),
  deleteOwner: (id) => API.delete(`/admin/users/${id}`),
};

export default adminService;
