import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { getReportees, getCurrentUser } from '../services/userService';

const Team = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [reportees, setReportees] = useState({ currentReportees: [], previousReportees: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, reporteesData] = await Promise.all([
          getCurrentUser(),
          getReportees()
        ]);
        setCurrentUser(userData);
        setReportees(reporteesData);
      } catch (err) {
        setError(err.message || 'Failed to fetch team data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Current User Card */}
      {currentUser && (
        <Card sx={{ mb: 4, bgcolor: '#f0f7ff' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#1976d2' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{currentUser.name}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Current Reportees Table */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Current Team Members
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Manager</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportees.currentReportees.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    {member.name}
                  </Box>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  {member.currentManager?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Previous Reportees Table */}
      {reportees.previousReportees?.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Previous Team Members
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Previous Manager</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportees.previousReportees.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        {member.name}
                      </Box>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member.currentManager?.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default Team;
