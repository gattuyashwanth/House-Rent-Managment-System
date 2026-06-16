import API from './api';

export const propertyService = {
  getAll: (params) => API.get('/properties', { params }),
  getById: (id) => API.get(`/properties/${id}`),
  getMy: () => API.get('/properties/my'),
  create: (data) => API.post('/properties', data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  approve: (id, status) => API.patch(`/properties/${id}/approve`, { status }),
};

export default propertyService;
