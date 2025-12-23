// frontend/src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import GroupIcon from '@mui/icons-material/Group';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DangerousIcon from '@mui/icons-material/Dangerous';

const MotionPaper = motion(Paper);

// Animation variant for the stat cards
const statCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const StatCard = ({ title, value, icon, color }) => (
  <MotionPaper
    elevation={4}
    sx={{ p: 3, borderRadius: '15px', display: 'flex', alignItems: 'center', height: '100%' }}
    variants={statCardVariants}
  >
    <Box sx={{ mr: 2, p: 2, borderRadius: '50%', backgroundColor: color }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
  </MotionPaper>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // The token is already set in axios headers by AuthContext
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Could not load stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Admin Dashboard
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {stats && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers}
              color="#e3f2fd"
              icon={<GroupIcon sx={{ fontSize: 40, color: '#1e88e5' }} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Total Medicines" 
              value={stats.totalMedicines}
              color="#e8f5e9"
              icon={<MedicalServicesIcon sx={{ fontSize: 40, color: '#43a047' }} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Counterfeit / Banned" 
              value={stats.totalCounterfeit}
              color="#ffebee"
              icon={<DangerousIcon sx={{ fontSize: 40, color: '#e53935' }} />}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AdminDashboard;