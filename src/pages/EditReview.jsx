import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { getReview, updateReview } from '../services/reviewService';

const EditReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reviewUser, setReviewUser] = useState(null);

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      setError(null);
      const review = await getReview(id);
      console.log('Review data:', review); // This will show the API response structure
      setFormData({
        userId: review.forUserId,
        year: review.year,
        quarter: review.quarter,
        q1: review.q1,
        a1: review.a1,
        q2: review.q2,
        a2: review.a2,
        q3: review.q3,
        a3: review.a3
      });
      setReviewUser(review.forUser?.name || review.forUserName || 'Unknown User');
    } catch (err) {
      console.error('Error fetching review:', err);
      setError(err.response?.data?.detail || 'Failed to fetch review');
    } finally {
      setLoading(false);
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
    try {
      setSaving(true);
      setError(null);
      // Only send the questions and answers in the update
      const updateData = {
        q1: formData.q1,
        a1: formData.a1,
        q2: formData.q2,
        a2: formData.a2,
        q3: formData.q3,
        a3: formData.a3
      };
      await updateReview(id, updateData);
      navigate('/reviews');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update review');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container>
        <Alert severity="error">Review not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Edit Review
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Team Member"
              value={reviewUser || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Year"
              value={formData.year}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quarter"
              value={`Q${formData.quarter}`}
              disabled
            />
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
            disabled={saving}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditReview;
