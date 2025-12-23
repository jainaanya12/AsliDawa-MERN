// frontend/src/pages/HomePage.js
import React, { useContext, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  CircularProgress // <-- THIS IS THE FIX
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import AuthContext from '../context/AuthContext';
import medicalAnimation from '../medical-animation.json';

// --- Import Icons ---
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArticleIcon from '@mui/icons-material/Article';

const MotionPaper = motion(Paper);

// --- Animation variant for the steps ---
const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: 'easeOut' 
    } 
  }
};

const HomePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- ADMIN REDIRECT LOGIC ---
  useEffect(() => {
    // If the user is logged in AND is an ADMIN, redirect them
    if (isAuthenticated && user && user.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const buttonStyle = {
    fontSize: '1.1rem',
    padding: '12px 24px',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&:hover': { 
        background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    }
  };

  const ctaButton = isAuthenticated ? (
    <Button 
      component={RouterLink} 
      to="/search" 
      variant="contained" 
      size="large" 
      sx={buttonStyle}
    >
      Start Searching
    </Button>
  ) : (
    <Button 
      component={RouterLink} 
      to="/register" 
      variant="contained" 
      size="large" 
      sx={buttonStyle}
    >
      Get Started
    </Button>
  );

  // --- Don't render if we're an Admin ---
  // This prevents the page from flashing before the redirect
  if (isAuthenticated && user && user.role === 'ADMIN') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* --- 1. HERO SECTION --- */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            padding: '2rem 2rem 4rem 2rem'
          }}
        >
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            
            {/* --- Text Content --- */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Welcome to AsliDawa
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ mb: 4 }}
                >
                  Your trusted partner in verifying genuine medicines. Quickly check
                  for counterfeit drugs and get detailed reports.
                </Typography>
                
                {ctaButton}
                
              </motion.div>
            </Grid>

            {/* --- Lottie Animation --- */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              >
                <Lottie 
                  animationData={medicalAnimation}
                  loop={true} 
                  style={{ maxHeight: 400, width: '100%' }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- 2. "HOW IT WORKS" SECTION --- */}
      <Box sx={{ 
        py: 8,
        width: '100%',
        position: 'relative', 
        zIndex: 2, 
        backgroundColor: '#f4f6f8' 
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ fontWeight: 'bold', mb: 8 }}
          >
            How It Works
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 4, 
            }}
          >
            {/* --- Step 1 --- */}
            <MotionPaper
              elevation={6}
              sx={{ p: 4, borderRadius: '15px', textAlign: 'center', backgroundColor: '#fff' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={stepVariants}
            >
              <SearchIcon sx={{ fontSize: 60, color: '#2193b0' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2 }}>
                1. Search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Type in a medicine name or even an illness you're treating. Our smart search will find what you need.
              </Typography>
            </MotionPaper>

            {/* --- Step 2 --- */}
            <MotionPaper
              elevation={6}
              sx={{ p: 4, borderRadius: '15px', textAlign: 'center', backgroundColor: '#fff' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{ ...stepVariants, visible: { ...stepVariants.visible, transition: { ...stepVariants.visible.transition, delay: 0.2 } } }}
            >
              <VerifiedUserIcon sx={{ fontSize: 60, color: '#FE6B8B' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2 }}>
                2. Verify
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Instantly see if the medicine is "Genuine" or "Counterfeit / Discontinued" based on our official data.
              </Typography>
            </MotionPaper>

            {/* --- Step 3 --- */}
            <MotionPaper
              elevation={6}
              sx={{ p: 4, borderRadius: '15px', textAlign: 'center', backgroundColor: '#fff' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{ ...stepVariants, visible: { ...stepVariants.visible, transition: { ...stepVariants.visible.transition, delay: 0.4 } } }}
            >
              <ArticleIcon sx={{ fontSize: 60, color: '#2193b0' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2 }}>
                3. Get Report
              </Typography>
              <Typography variant="body1" color="text.secondary">
                For genuine medicines, get a full report on uses, side effects, and find cheaper substitutes.
              </Typography>
            </MotionPaper>
          </Box>
        </Container>
      </Box>

      {/* --- 3. FOOTER --- */}
      <Box 
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#333',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
            AsliDawa - A Counterfeit Medicine Detection App
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mt: 1 }}>
            © {new Date().getFullYear()} AsliDawa. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;