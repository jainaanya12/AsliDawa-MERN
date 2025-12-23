// frontend/src/components/Layout.js
import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Outlet renders the child route
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          // Add a subtle background to the main content area
          backgroundColor: '#f4f6f8' 
        }}
      >
        {/* Outlet is where your pages (HomePage, SearchPage) will be rendered */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;