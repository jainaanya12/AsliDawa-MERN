// frontend/src/pages/admin/ManageUsers.js
import React, { useEffect, useState, useContext } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../../context/AuthContext'; // Import AuthContext

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user: adminUser } = useContext(AuthContext); // Get the logged-in admin's info

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This is permanent.')) {
      try {
        setSuccess('');
        setError('');
        const res = await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
        setSuccess(res.data.msg);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        setError(err.response?.data?.msg || 'Could not delete user');
      }
    }
  };

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
        Manage Users
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: '15px' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: user.role === 'ADMIN' ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete User">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                        // Disable deleting your own account
                        disabled={user._id === adminUser._id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageUsers;