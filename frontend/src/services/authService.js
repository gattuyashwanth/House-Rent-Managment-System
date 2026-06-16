import API from './api';

export const authService = {
  register: (data) => API.post('/user/register', data),
  login: (data) => API.post('/user/login', data),
  getMe: () => API.get('/user/profile'),
};

export default authService;
