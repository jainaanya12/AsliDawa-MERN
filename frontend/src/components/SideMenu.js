// frontend/src/components/SideMenu.js
import React, { useContext } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Import All Icons
import HomeIcon from '@mui/icons-material/Home'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import BiotechIcon from '@mui/icons-material/Biotech';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

const SideMenu = ({ open, onClose }) => {
  const { user, logout, deleteAccount } = useContext(AuthContext);

  const handleDelete = async () => {
    onClose();
    const result = await deleteAccount();
    if (!result.success && result.error !== 'User cancelled') {
      alert(`Error: ${result.error}`);
    }
  };

  // --- NEW: Render different menus based on role ---

  const renderAdminMenu = () => (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/admin/dashboard" onClick={onClose}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/admin/users" onClick={onClose}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/admin/medicines" onClick={onClose}>
            <ListItemIcon><EditLocationAltIcon /></ListItemIcon>
            <ListItemText primary="Manage Medicines" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => {
            onClose();
            logout();
          }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  const renderUserMenu = () => (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/" onClick={onClose}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
      
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/profile" onClick={onClose}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/cabinet" onClick={onClose}>
            <ListItemIcon><MedicalServicesIcon /></ListItemIcon>
            <ListItemText primary="My Medicine Cabinet" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/search" onClick={onClose}>
            <ListItemIcon><SearchIcon /></ListItemIcon>
            <ListItemText primary="Search by Name" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/search?mode=illness" onClick={onClose}>
            <ListItemIcon><BiotechIcon /></ListItemIcon>
            <ListItemText primary="Search by Illness" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => {
            onClose();
            logout();
          }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteForeverIcon color="error" /></ListItemIcon>
            <ListItemText primary="Delete Account" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{ width: 280, p: 2 }}
        role="presentation"
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hello, {user ? user.username : 'User'}
        </Typography>
        <Divider />
        
        {/* --- HERE IS THE LOGIC --- */}
        {user && user.role === 'ADMIN' ? renderAdminMenu() : renderUserMenu()}

      </Box>
    </Drawer>
  );
};

export default SideMenu;