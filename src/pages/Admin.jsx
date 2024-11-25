import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import { Person as PersonIcon, SupervisorAccount as ManagerIcon } from '@mui/icons-material';
import { getAllUsers, assignManager } from '../services/userService';
import axiosInstance from '../api/axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [assigningManager, setAssigningManager] = useState(null);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
    testMeEndpoint();
  }, []);

  const testMeEndpoint = async () => {
    try {
      const response = await axiosInstance.get('/api/user/me');
      console.log('Current user data:', response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setFetchLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleManagerChange = async (userId, managerId) => {
    try {
      setAssigningManager(userId);
      await assignManager(userId, managerId);
      await fetchUsers(); // Refresh the user list
      setSnackbar({
        open: true,
        message: 'Manager assigned successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to assign manager',
        severity: 'error'
      });
      console.error('Error assigning manager:', err);
    } finally {
      setAssigningManager(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (fetchLoading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        User Management
      </Typography>
      
      <TableContainer component={Paper}>
        {fetchLoading && (
          <Box sx={{ width: '100%', position: 'relative' }}>
            <LinearProgress sx={{ position: 'absolute', width: '100%', top: 0 }} />
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Manager</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="User">
                      <IconButton size="small" sx={{ bgcolor: '#f5f5f5', color: 'text.secondary' }}>
                        <PersonIcon />
                      </IconButton>
                    </Tooltip>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={user.currentManager?.id || ''}
                        onChange={(e) => handleManagerChange(user.id, e.target.value)}
                        displayEmpty
                        sx={{ minWidth: 200 }}
                        disabled={assigningManager === user.id || fetchLoading}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {users
                          .filter(manager => manager.id !== user.id)
                          .map(manager => (
                            <MenuItem key={manager.id} value={manager.id}>
                              {manager.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {assigningManager === user.id && (
                      <CircularProgress size={20} />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Admin;
