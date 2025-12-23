// frontend/src/pages/CabinetPage.js
import React, { useContext } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const MotionPaper = motion(Paper);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const CabinetPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading || !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <MotionPaper
        elevation={4}
        sx={{ padding: { xs: '1.5rem', sm: '2.5rem' }, borderRadius: '15px' }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          align="center" 
          sx={{ fontWeight: 'bold', color: '#333' }}
        >
          My Medicine Cabinet
        </Typography>
        
        {user.medicineCabinet.length === 0 ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            Your medicine cabinet is empty. You can add medicines by finding them on the search page and clicking "Save to Cabinet".
          </Alert>
        ) : (
          <List sx={{ mt: 2 }}>
            {user.medicineCabinet.map((med) => (
              <ListItem key={med._id} disablePadding>
                <ListItemButton component={RouterLink} to={`/report/${med._id}`}>
                  <ListItemText
                    primary={med.name}
                    secondary={med.manufacturer_name}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </MotionPaper>
    </Container>
  );
};

export default CabinetPage;