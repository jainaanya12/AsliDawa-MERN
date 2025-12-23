// frontend/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api/medicines';

// --- Styled Animation Components ---
const MotionPaper = motion(Paper);
const MotionListItem = motion(ListItem);

// --- Animation Variants ---
// A simple fade-in variant for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

// A variant for the list itself
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1 // Each list item will animate in 0.1s after the last
    }
  }
};

// A variant for the list items
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function SearchPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('name');
  const [suggestion, setSuggestion] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object

  // This effect checks the URL when the page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'illness') {
      setSearchMode('illness');
    } else {
      setSearchMode('name');
    }
  }, [location.search]); // Re-run if the URL query changes

  const handleModeChange = (event, newValue) => {
    setSearchMode(newValue);
    // Update the URL when user clicks a tab
    navigate(newValue === 'illness' ? '/search?mode=illness' : '/search');
  };

  const runSearch = async (searchTerm) => {
    if (searchTerm.trim() === '') return;
    setLoading(true);
    setSearchAttempted(true);
    setSelectedMedicine(null);
    setSuggestion(null);
    setError('');
    setResults([]);
    try {
      let res;
      if (searchMode === 'name') {
        res = await axios.get(`${API_URL}/search?name=${searchTerm}`);
        setResults(res.data.medicines);
        if (res.data.medicines.length === 0) {
          setSuggestion(res.data.suggestion);
        }
      } else {
        res = await axios.get(`${API_URL}/byillness?q=${searchTerm}`);
        setResults(res.data);
      }
    } catch (err) {
      setError('An error occurred while searching.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearchClick = () => {
    runSearch(search);
  };
  
  const handleSuggestionClick = () => {
    const suggestedTerm = suggestion;
    setSearch(suggestedTerm);
    runSearch(suggestedTerm);
  };

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setSuggestion(null);
    setSearch('');
    setResults([]);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      
      {/* --- Main Search Box --- */}
      <MotionPaper 
        elevation={4} 
        sx={{ padding: '2rem', borderRadius: '15px', mb: 3 }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Medicine Verification
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs value={searchMode} onChange={handleModeChange} centered>
            <Tab label="Search by Medicine Name" value="name" />
            <Tab label="Search by Illness" value="illness" />
          </Tabs>
        </Box>

        <Box display="flex" gap="1rem" mb={2}>
          <TextField
            fullWidth
            label={searchMode === 'name' ? 'Enter medicine name...' : 'Enter illness or symptom...'}
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
          />
          {/* --- STYLED BUTTON --- */}
          <Button 
            variant="contained" 
            onClick={handleSearchClick}
            disabled={loading}
            sx={{ 
              height: '56px', 
              width: '120px',
              fontSize: '1rem',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      </MotionPaper>

      {/* --- Animated Results Area --- */}
      <AnimatePresence mode="wait">
        {/* --- Suggestion Box --- */}
        {suggestion && (
          <MotionPaper
            key="suggestion"
            elevation={2} 
            sx={{ marginTop: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '15px' }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography>Did you mean:</Typography>
            <Chip
              label={suggestion}
              onClick={handleSuggestionClick}
              color="primary"
              clickable
            />
          </MotionPaper>
        )}

        {/* --- Search Results List --- */}
        {results.length > 0 && !selectedMedicine && (
          <MotionPaper
            key="results"
            elevation={2} 
            sx={{ marginTop: '1rem', borderRadius: '15px', overflow: 'hidden' }}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <List sx={{ padding: 0 }}>
              {results.map((med) => (
                <MotionListItem 
                  key={med._id} 
                  divider 
                  button 
                  onClick={() => handleSelectMedicine(med)}
                  variants={itemVariants} // Animate each item
                >
                  <ListItemText primary={med.name} secondary={med.manufacturer_name} />
                </MotionListItem>
              ))}
            </List>
          </MotionPaper>
        )}

        {/* --- No Results Message --- */}
        {searchAttempted && results.length === 0 && !loading && !suggestion && !selectedMedicine && (
          <MotionPaper
            key="no-results"
            elevation={2} 
            sx={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '15px' }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography variant="h6" align="center">No results found.</Typography>
            <Typography align="center">Check spelling or try a different term.</Typography>
          </MotionPaper>
        )}
        
        {/* --- Selected Medicine Details Card --- */}
        {selectedMedicine && (
          <MotionPaper
            key="selected-med"
            elevation={4} 
            sx={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              borderRadius: '15px',
              backgroundColor: selectedMedicine.is_discontinued ? '#fff0f0' : '#f0fff0' 
            }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography variant="h5" gutterBottom>{selectedMedicine.name}</Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Manufacturer:</strong> {selectedMedicine.manufacturer_name}
            </Typography>
            <Typography 
              variant="h6" 
              style={{ 
                color: selectedMedicine.is_discontinued ? 'red' : 'green', 
                fontWeight: 'bold',
                marginTop: '1rem' 
              }}
            >
              Status: {selectedMedicine.is_discontinued 
                ? '🔴 Counterfeit / Discontinued' 
                : '✅ Genuine'}
            </Typography>

            {!selectedMedicine.is_discontinued && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate(`/report/${selectedMedicine._id}`)}
              >
                Generate Detailed Report
              </Button>
            )}
          </MotionPaper>
        )}
      </AnimatePresence>

    </Container>
  );
}

export default SearchPage;