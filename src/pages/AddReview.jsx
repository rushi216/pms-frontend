import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { createReview } from '../services/reviewService';
import { getReportees } from '../services/userService';

const defaultQuestions = {
  q1: "What were your achievements?",
  q2: "What are your goals?",
  q3: "Any challenges?"
};

const AddReview = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportees, setReportees] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    year: new Date().getFullYear(),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    q1: defaultQuestions.q1,
    a1: '',
    q2: defaultQuestions.q2,
    a2: '',
    q3: defaultQuestions.q3,
    a3: ''
  });

  useEffect(() => {
    fetchReportees();
  }, []);

  const fetchReportees = async () => {
    try {
      const response = await getReportees();
      // Use currentReportees array from the response
      const reporteesArray = response?.currentReportees || [];
      setReportees(reporteesArray);
    } catch (err) {
      console.error('Error fetching reportees:', err);
      setError('Failed to fetch reportees');
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      setError('Please select a team member');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await createReview(formData);
      navigate('/reviews');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Create New Review
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Team Member</InputLabel>
              <Select
                value={formData.userId}
                label="Team Member"
                onChange={handleChange('userId')}
              >
                {reportees && reportees.length > 0 ? (
                  reportees.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No team members found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Year"
              value={formData.year}
              onChange={handleChange('year')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Quarter</InputLabel>
              <Select
                value={formData.quarter}
                label="Quarter"
                onChange={handleChange('quarter')}
              >
                {[1, 2, 3, 4].map(q => (
                  <MenuItem key={q} value={q}>Q{q}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {[1, 2, 3].map((num) => (
          <Box key={num} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label={`Question ${num}`}
              value={formData[`q${num}`]}
              onChange={handleChange(`q${num}`)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label={`Answer ${num}`}
              value={formData[`a${num}`]}
              onChange={handleChange(`a${num}`)}
              multiline
              rows={3}
              required
            />
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/reviews')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Create Review
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddReview;
