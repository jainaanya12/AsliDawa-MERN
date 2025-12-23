// frontend/src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SideMenu from './SideMenu';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // For Back/Forward
  
  // State for the drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ color: '#333', mr: 2, display: { xs: 'none', sm: 'block' } }}>
        Hello, {user && user.username}
      </Typography>
      <Button
        onClick={logout} // Use logout function from context
        variant="outlined"
        sx={{ borderColor: '#6dd5ed', color: '#2193b0' }}
      >
        Logout
      </Button>
    </Box>
  );

  const guestLinks = (
    <Box>
      <Button 
        component={RouterLink} 
        to="/login"
        variant="outlined"
        sx={{ mr: 1.5, borderColor: '#6dd5ed', color: '#2193b0' }}
      >
        Login
      </Button>
      <Button 
        component={RouterLink} 
        to="/register"
        variant="contained"
        sx={{ 
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
        }}
      >
        Sign Up
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={1} 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)', 
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Show Menu Icon only when logged in */}
            {isAuthenticated && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1, color: '#2193b0' }}
                onClick={() => setIsDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Back/Forward Buttons */}
            <IconButton onClick={() => navigate(-1)} sx={{ color: '#aaa' }}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={() => navigate(1)} sx={{ color: '#aaa', mr: 2 }}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* App Title/Logo */}
          <Typography 
            variant="h5" 
            noWrap
            component={RouterLink} 
            to="/"
            sx={{
              fontWeight: 'bold',
              color: '#2193b0',
              textDecoration: 'none',
              // Use flexGrow and positioning to center the title
              position: { xs: 'absolute', sm: 'static' },
              left: { xs: '50%', sm: 'auto' },
              transform: { xs: 'translateX(-50%)', sm: 'none' },
              flexGrow: { sm: 1 },
              textAlign: { sm: 'left' }
            }}
          >
            AsliDawa
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ color: '#555' }}
            >
              Counterfeit Medicine Detection
            </Typography>
          </Typography>

          {/* Render links conditionally */}
          {isAuthenticated ? authLinks : guestLinks}

        </Toolbar>
      </AppBar>
      
      {/* Render the SideMenu component */}
      <SideMenu 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
};

export default Navbar;