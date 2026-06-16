import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDashboardPath = (role) => {
    if (role === 'Admin') return '/admin/dashboard';
    if (role === 'Owner') return '/owner/dashboard';
    return '/renter/dashboard';
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        authService.getMe()
          .then(({ data }) => {
            if (data.success) {
              localStorage.setItem('user', JSON.stringify(data.data));
              setUser(data.data);
            }
          })
          .catch(() => logout());
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    }
  };

  const register = async (formData) => {
    const { data } = await authService.register(formData);
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    }
  };

  const dashboardPath = user ? getDashboardPath(user.role) : '/login';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, dashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
