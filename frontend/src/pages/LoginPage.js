// frontend/src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert 
} from '@mui/material';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const MotionPaper = motion(Paper);

const LoginPage = () => {
  // --- 1. GET THE FULL 'user' OBJECT FROM CONTEXT ---
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(loginIdentifier, password); 
    if (!result.success) {
      setError(result.error);
    }
    // On success, the 'isAuthenticated' and 'user' states
    // will update, triggering the redirect below.
  };

  // --- 2. THIS IS THE NEW REDIRECT LOGIC ---
  // If logged in, check role and redirect
  if (isAuthenticated && user) {
    // If ADMIN, go to dashboard. Otherwise, go to search.
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/search';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
        padding: '2rem 1rem',
      }}
    >
      <Container component="main" maxWidth="xs">
        <MotionPaper
          elevation={10}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          sx={{ padding: { xs: '1.5rem', sm: '2.5rem' }, borderRadius: '15px' }}
        >
          <Typography variant="h4" align="center" gutterBottom
            sx={{ 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '1.5rem' 
            }}
          >
            Welcome Back!
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
            
            <TextField
              label="Username or Email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                }
              }}
            >
              Sign In
            </Button>
            <Box textAlign="center" marginTop="1rem">
              <Typography variant="body2" color="text.secondary">
                Don't have an account? <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>Sign Up</Link>
              </Typography>
            </Box>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default LoginPage;