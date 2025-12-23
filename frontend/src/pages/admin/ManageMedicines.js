// frontend/src/pages/admin/ManageMedicines.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const ManageMedicines = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);

  // Blank form for a new medicine
  const blankMed = {
    name: '',
    price: 0,
    is_discontinued: false,
    manufacturer_name: '',
    type: 'allopathy',
    pack_size_label: '',
    short_composition1: '',
    short_composition2: '',
    uses: '',
    side_effects: '',
    substitutes: '',
    habit_forming: 'No'
  };

  // Helper to re-format array data for editing in a TextField
  const formatArrayForEdit = (arr) => arr ? arr.join('|') : '';
  
  // Search for medicines
  const handleSearch = async () => {
    if (!search) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      // We use the public search route to find medicines
      const res = await axios.get(`http://localhost:5000/api/medicines/search?name=${search}`);
      setResults(res.data.medicines);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not find medicines');
    }
    setLoading(false);
  };

  // --- Modal Functions ---
  const handleOpenAdd = () => {
    setCurrentMed(blankMed);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (med) => {
    setCurrentMed({
      ...med,
      // Convert arrays to pipe-separated strings for the form
      uses: formatArrayForEdit(med.uses),
      side_effects: formatArrayForEdit(med.side_effects),
      substitutes: formatArrayForEdit(med.substitutes),
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setCurrentMed(null);
  };

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentMed({
      ...currentMed,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleModalSave = async () => {
    // Helper to convert pipe-separated strings back to arrays
    const parsePipeSeparated = (str) => str ? str.split('|').map(item => item.trim()) : [];

    const medDataToSave = {
      ...currentMed,
      uses: parsePipeSeparated(currentMed.uses),
      side_effects: parsePipeSeparated(currentMed.side_effects),
      substitutes: parsePipeSeparated(currentMed.substitutes),
      price: parseFloat(currentMed.price) || 0
    };

    try {
      setSuccess('');
      setError('');
      if (isEditMode) {
        // --- Update Existing Medicine ---
        await axios.put(`http://localhost:5000/api/admin/medicines/${currentMed._id}`, medDataToSave);
        setSuccess('Medicine updated successfully!');
      } else {
        // --- Add New Medicine ---
        await axios.post('http://localhost:5000/api/admin/medicines', medDataToSave);
        setSuccess('Medicine added successfully!');
      }
      handleClose();
      handleSearch(); // Refresh search results
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not save medicine');
    }
  };

  // --- Delete Function ---
  const handleDelete = async (medId) => {
    if (window.confirm('Are you sure you want to permanently delete this medicine?')) {
      try {
        setSuccess('');
        setError('');
        await axios.delete(`http://localhost:5000/api/admin/medicines/${medId}`);
        setSuccess('Medicine deleted successfully!');
        handleSearch(); // Refresh search results
      } catch (err) {
        setError(err.response?.data?.msg || 'Could not delete medicine');
      }
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Manage Medicines
        </Typography>

        {/* --- Search Bar --- */}
        <MotionPaper elevation={3} sx={{ p: 2, borderRadius: '15px', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Search for a medicine to edit or delete..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="contained" onClick={handleSearch} sx={{ height: '56px' }}>
              Search
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleOpenAdd} 
              startIcon={<AddIcon />}
              sx={{ height: '56px', width: '200px' }}
            >
              Add New
            </Button>
          </Box>
        </MotionPaper>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* --- Search Results --- */}
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {results.map((med) => (
              <Paper key={med._id} sx={{ mb: 1, borderRadius: '10px' }}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton edge="end" color="primary" onClick={() => handleOpenEdit(med)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton edge="end" color="error" onClick={() => handleDelete(med._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={med.name}
                    secondary={med.manufacturer_name}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Container>

      {/* --- Add/Edit Modal --- */}
      <Dialog open={modalOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
        <DialogContent>
          {currentMed && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label="Name" name="name" value={currentMed.name} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Price" name="price" type="number" value={currentMed.price} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Manufacturer" name="manufacturer_name" value={currentMed.manufacturer_name} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Pack Size" name="pack_size_label" value={currentMed.pack_size_label} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Composition 1" name="short_composition1" value={currentMed.short_composition1} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Composition 2" name="short_composition2" value={currentMed.short_composition2} onChange={handleModalChange} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField fullWidth label="Uses (separate with | )" name="uses" value={currentMed.uses} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Side Effects (separate with | )" name="side_effects" value={currentMed.side_effects} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Substitutes (separate with | )" name="substitutes" value={currentMed.substitutes} onChange={handleModalChange} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Habit Forming" name="habit_forming" value={currentMed.habit_forming} onChange={handleModalChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentMed.is_discontinued}
                      onChange={handleModalChange}
                      name="is_discontinued"
                      color="warning"
                    />
                  }
                  label="Mark as Counterfeit / Banned"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleModalSave} variant="contained" color="primary">
            {isEditMode ? 'Save Changes' : 'Add Medicine'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageMedicines;