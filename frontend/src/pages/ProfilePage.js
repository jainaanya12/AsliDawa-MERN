// frontend/src/pages/ProfilePage.js
import React, { useContext, useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

// --- Import Icons ---
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';

const MotionPaper = motion(Paper);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// --- Password Regex ---
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordErrorMsg = 'Password must be at least 8 characters and contain one uppercase, one lowercase, one number, and one special character.';

const ProfilePage = () => {
  const { user, loading, changePassword } = useContext(AuthContext);

  // --- State for Password Modal ---
  const [open, setOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  if (loading || !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  // --- Password Modal Handlers ---
  const { oldPassword, newPassword, confirmPassword } = passwordData;

  const handleClickOpen = () => {
    setOpen(true);
    setModalError('');
    setModalSuccess('');
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onPasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!passwordRegex.test(newPassword)) {
      setModalError(passwordErrorMsg);
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError('New passwords do not match');
      return;
    }

    const result = await changePassword(oldPassword, newPassword);

    if (result.success) {
      setModalSuccess(result.msg);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } else {
      setModalError(result.error);
    }
  };
  
  const formattedDOB = new Date(user.dateOfBirth).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Container maxWidth="sm" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
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
            My Profile
          </Typography>
          
          {/* --- All Edit Mode Logic is Removed --- */}
          <Box>
            <List sx={{ mt: 3 }}>
              {/* --- Username --- */}
              <ListItem>
                <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Username" secondary={user.username} />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              {/* --- Email (Not Editable) --- */}
              <ListItem>
                <ListItemIcon><EmailIcon color="action" /></ListItemIcon>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
              <Divider variant="inset" component="li" />

              {/* --- Contact Number --- */}
              <ListItem>
                <ListItemIcon><PhoneIcon color="action" /></ListItemIcon>
                <ListItemText primary="Contact Number" secondary={user.contactNumber} />
              </ListItem>
              <Divider variant="inset" component="li" />

              {/* --- Date of Birth --- */}
              <ListItem>
                <ListItemIcon><CakeIcon color="action" /></ListItemIcon>
                <ListItemText primary="Date of Birth" secondary={formattedDOB} />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              {/* --- Gender --- */}
              <ListItem>
                <ListItemIcon><WcIcon color="action" /></ListItemIcon>
                <ListItemText primary="Gender" secondary={user.gender} />
              </ListItem>
            </List>
            
            {/* --- Button Section (Edit Button Removed) --- */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleClickOpen}>
                Change Password
              </Button>
            </Box>
          </Box>
          
        </MotionPaper>
      </Container>

      {/* --- Password Change Modal (Unchanged) --- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Your Password</DialogTitle>
        <Box component="form" onSubmit={handlePasswordSubmit}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              To change your password, please enter your old password and a new password.
            </DialogContentText>
            {modalError && <Alert severity="error" sx={{ mb: 2 }}>{modalError}</Alert>}
            {modalSuccess && <Alert severity="success" sx={{ mb: 2 }}>{modalSuccess}</Alert>}
            
            <TextField
              autoFocus
              margin="dense"
              name="oldPassword"
              label="Old Password"
              type="password"
              fullWidth
              variant="outlined"
              value={oldPassword}
              onChange={onPasswordChange}
              required
            />
            <TextField
              margin="dense"
              name="newPassword"
              label="New Password"
              helperText={passwordErrorMsg}
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={onPasswordChange}
              required
            />
            <TextField
              margin="dense"
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={onPasswordChange}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: '0 24px 24px' }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Update Password</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default ProfilePage;