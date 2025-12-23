// frontend/src/components/AdminRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    // Show a spinner while context is loading
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 1. Check if logged in
  // 2. Check if user data is loaded
  // 3. Check if role is ADMIN
  if (isAuthenticated && user && user.role === 'ADMIN') {
    return children; // If all checks pass, show the admin page
  }
  
  // If any check fails, redirect to the home page
  return <Navigate to="/" replace />;
};

export default AdminRoute;