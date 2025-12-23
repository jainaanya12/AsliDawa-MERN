// frontend/src/pages/RegisterPage.js
import React, { useState, useContext } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  MenuItem,
  InputLabel,
  FormControl,
  Select
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const MotionPaper = motion(Paper);

// --- Password Regex ---
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordErrorMsg = 'Password must be at least 8 characters and contain one uppercase, one lowercase, one number, and one special character.';

const RegisterPage = () => {
  // --- 1. GET THE FULL 'user' OBJECT FROM CONTEXT ---
  const { register, isAuthenticated, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Client-side validation ---
    if (!username || !email || !password || !dateOfBirth || !gender || !contactNumber) {
        setError('All fields are required.');
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
        setError('Contact number must be 10 digits.');
        return;
    }
    if (!passwordRegex.test(password)) {
      setError(passwordErrorMsg);
      return;
    }

    try {
      const result = await register({
        username,
        email,
        password,
        dateOfBirth: dateOfBirth.toISOString(),
        gender,
        contactNumber,
      });

      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        // Redirect is handled by the 'isAuthenticated' check below
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed. Please check your details.');
    }
  };

  // --- 2. THIS IS THE NEW REDIRECT LOGIC ---
  if (isAuthenticated && user) {
    // If ADMIN, go to dashboard. Otherwise, go to search.
    // Note: A new registration will *always* be a USER, but this
    // code also prevents a logged-in Admin from visiting /register
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
      <Container component="main" maxWidth="sm">
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
            Create Your Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* --- All Form Fields --- */}
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email Address"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              helperText={passwordErrorMsg}
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(newValue) => setDateOfBirth(newValue)}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            fullWidth 
                            margin="normal" 
                            required 
                            sx={{ mb: 2 }}
                        />
                    )}
                />
            </LocalizationProvider>

            <FormControl fullWidth margin="normal" required sx={{ mb: 2 }}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value=""><em>Select Gender</em></MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Contact Number"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              type="tel"
              inputProps={{ maxLength: 10 }}
              sx={{ mb: 3 }}
            />
            {/* --- End of Form Fields --- */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
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
              Register
            </Button>
            <Box textAlign="center" marginTop="1rem">
              <Typography variant="body2" color="text.secondary">
                Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>Sign In</Link>
              </Typography>
            </Box>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default RegisterPage;