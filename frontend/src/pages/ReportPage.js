// frontend/src/pages/ReportPage.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

// --- Import Icons ---
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

const API_URL = 'http://localhost:5000/api/medicines';
const MotionPaper = motion(Paper);

// --- Animation Variants ---
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleCabinet, loading: userLoading } = useContext(AuthContext);
  
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      setError('');
      setShowSubstitutes(false);
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setMedicine(res.data);
      } catch (err) {
        setError('Could not find a report for this medicine.');
        console.error(err);
      }
      setLoading(false);
    };
    fetchMedicine();
  }, [id]);

  const handleSelectSubstitute = async (substituteName) => {
    setSubLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/byname?name=${encodeURIComponent(substituteName)}`);
      const newId = res.data._id;
      navigate(`/report/${newId}`);
    } catch (err) {
      setError(`Details for "${substituteName}" could not be found.`);
    }
    setSubLoading(false);
  };

  // Helper to render lists from pipe-separated data
  const renderListInCell = (data) => {
    if (!data || data.length === 0) return 'N/A';
    // Render as a string with bullet points for the table cell
    return data.map(item => `• ${item}`).join('\n');
  };

  const isSaved = user?.medicineCabinet?.some(med => med._id === id);

  const handleToggleCabinet = async () => {
    await toggleCabinet(id);
  };

  if (loading || userLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!medicine) {
    return null;
  }

  // --- Main Render ---
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      
      {/* --- Save to Cabinet Button --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button
          variant={isSaved ? "contained" : "outlined"}
          color={isSaved ? "success" : "primary"}
          onClick={handleToggleCabinet}
          startIcon={isSaved ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
        >
          {isSaved ? "Saved in Cabinet" : "Save to Cabinet"}
        </Button>
      </Box>

      {/* --- Status Card --- */}
      <MotionPaper 
        elevation={4} 
        style={{ 
          padding: '1.5rem', 
          backgroundColor: medicine.is_discontinued ? '#fff0f0' : '#f0fff0',
          borderRadius: '15px',
          marginBottom: '2rem'
        }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {medicine.name}
        </Typography>
        <Typography variant="h6" gutterBottom>
          <strong>Manufacturer:</strong> {medicine.manufacturer_name}
        </Typography>
        <Typography 
          variant="h5" 
          style={{ 
            color: medicine.is_discontinued ? 'red' : 'green', 
            fontWeight: 'bold',
            marginTop: '1rem' 
          }}
        >
          Status: {medicine.is_discontinued 
            ? '🔴 Counterfeit / Discontinued' 
            : '✅ Genuine'}
        </Typography>
      </MotionPaper>

      {/* --- Detailed Report Table (Only if Genuine) --- */}
      {!medicine.is_discontinued && (
        <MotionPaper 
          elevation={4} 
          style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '15px' }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography variant="h5" gutterBottom>Detailed Report</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
            <Table>
              <TableBody>
                {/* We alternate row colors for readability */}
                <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell>{medicine.price || 'N/A'}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: '#fff' } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Pack Size</TableCell>
                  <TableCell>{medicine.pack_size_label || 'N/A'}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Composition</TableCell>
                  <TableCell>
                    {medicine.short_composition1}
                    {medicine.short_composition2 ? ` + ${medicine.short_composition2}` : ''}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: '#fff' } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Uses</TableCell>
                  {/* Use pre-wrap to respect the newline characters from our helper */}
                  <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                    {renderListInCell(medicine.uses)}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Side Effects</TableCell>
                  <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                    {renderListInCell(medicine.side_effects)}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: '#fff' } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Habit Forming</TableCell>
                  <TableCell>{medicine.habit_forming || 'N/A'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* --- Substitutes Button --- */}
          {medicine.substitutes && medicine.substitutes.length > 0 && !showSubstitutes && (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setShowSubstitutes(true)}
            >
              Show Substitutes
            </Button>
          )}
        </MotionPaper>
      )}

      {/* --- Substitutes List --- */}
      {showSubstitutes && (
        <MotionPaper 
          elevation={4} 
          style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '15px' }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h5">Available Substitutes</Typography>
            <Button variant="outlined" size="small" onClick={() => setShowSubstitutes(false)}>
              Hide
            </Button>
          </Box>
          {subLoading && <CircularProgress size={24} />}
          <List>
            {medicine.substitutes.length > 0 ? (
              medicine.substitutes.map((sub, index) => (
                <ListItem 
                  key={index} 
                  divider 
                  button 
                  onClick={() => handleSelectSubstitute(sub)}
                  disabled={subLoading}
                >
                  <ListItemText primary={sub} />
                </ListItem>
              ))
            ) : (
              <Typography>No substitutes listed for this medicine.</Typography>
            )}
          </List>
        </MotionPaper>
      )}
    </Container>
  );
};

export default ReportPage;