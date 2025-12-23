// frontend/src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // <-- 1. IMPORT CONTEXT
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  // 2. GET AUTH STATE FROM CONTEXT
  const { isAuthenticated, loading } = useContext(AuthContext); 

  if (loading) {
    // 3. Show a spinner while context is loading user data
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 4. Redirect if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;