import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('annsetu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('annsetu_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('annsetu_user', JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Failed to verify token:', err);
    }
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('annsetu_token', data.token);
      localStorage.setItem('annsetu_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } finally {
      setLoading(false);
    }
  }

  async function demoLogin(role = 'farmer') {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Demo login failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('annsetu_token', data.token);
      localStorage.setItem('annsetu_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } finally {
      setLoading(false);
    }
  }

  async function register(userData) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('annsetu_token', data.token);
      localStorage.setItem('annsetu_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('annsetu_token');
    localStorage.removeItem('annsetu_user');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
