import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('budget_token'));
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Configure axios to always send the token
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const loadUser = async () => {
      // Guarantee the loading screen is visible for at least 1.5 s
      const minDelay = new Promise(res => setTimeout(res, 1500));

      if (!token) {
        await minDelay;
        setLoading(false);
        return;
      }
      try {
        const [{ data }] = await Promise.all([
          axios.get('/api/auth/me'),
          minDelay,
        ]);
        setUser(data.user);
      } catch (err) {
        await minDelay;
        setToken(null);
        localStorage.removeItem('budget_token');
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('budget_token', data.token);
  };

  const register = async (name, email, password) => {
    await axios.post('/api/auth/register', { name, email, password });
    // Intentionally NOT setting token here so the user is forced to login manually!
  };

  const loginWithGoogle = async (googleToken) => {
    const { data } = await axios.post('/api/auth/google', { token: googleToken });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('budget_token', data.token);
  };

  const updateGoogleSheet = async (googleSheetId) => {
    const { data } = await axios.put('/api/auth/sheet', { googleSheetId });
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('budget_token');
    queryClient.clear(); // Wipe all cached data for the previous user!
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, updateGoogleSheet, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
