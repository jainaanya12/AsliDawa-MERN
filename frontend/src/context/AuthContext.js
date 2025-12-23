// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// This is a helper function to set the token for all axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('http://localhost:5000/api/auth');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  // Register User
  // ... (this function is unchanged)
  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      return { success: false, error: err.response.data.msg || 'Registration failed' };
    }
  };

  // Login User
  // ... (this function is unchanged)
  const login = async (loginIdentifier, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { loginIdentifier, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      return { success: false, error: err.response.data.msg || 'Login failed' };
    }
  };

  // Logout User
  // ... (this function is unchanged)
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    navigate('/login');
  };

  // Delete Account
  // ... (this function is unchanged)
  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is permanent.')) {
      return { success: false, error: 'User cancelled' };
    }
    try {
      await axios.delete('http://localhost:5000/api/auth');
      logout();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response.data.msg || 'Could not delete account' };
    }
  };

  // Change Password
  // ... (this function is unchanged)
  const changePassword = async (oldPassword, newPassword) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ oldPassword, newPassword });
    try {
      const res = await axios.post('http://localhost:5000/api/auth/changepassword', body, config);
      return { success: true, msg: res.data.msg };
    } catch (err) {
      return { success: false, error: err.response.data.msg || 'Server Error' };
    }
  };

  // --- NEW: Toggle Medicine in Cabinet ---
  const toggleCabinet = async (medId) => {
    try {
      // This route returns the new, updated cabinet array
      const res = await axios.put(`http://localhost:5000/api/user/cabinet/${medId}`);
      // Update the user state with the new cabinet
      setUser({ ...user, medicineCabinet: res.data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response.data.msg || 'Server Error' };
    }
  };
const editProfile = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    };
    try {
      // This route returns the updated user object
      const res = await axios.put('http://localhost:5000/api/user/profile', formData, config);
      
      // Update the user state with the new data
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response.data.msg || 'Server Error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
        deleteAccount,
        changePassword,
        toggleCabinet,
        editProfile, // <-- ADD THIS
        loadUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;