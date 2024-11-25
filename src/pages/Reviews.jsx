import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getReviews, deleteReview } from '../services/reviewService';

const Reviews = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState('all');
  const [quarter, setQuarter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const years = ['all', new Date().getFullYear(), new Date().getFullYear() - 1];
  const quarters = ['all', 1, 2, 3, 4];

  useEffect(() => {
    fetchReviews();
  }, [year, quarter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters, excluding 'all' values
      const queryParams = {};
      if (year !== 'all') {
        queryParams.year = year;
      }
      if (quarter !== 'all') {
        queryParams.quarter = quarter;
      }

      const data = await getReviews(queryParams);
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field) => (event) => {
    if (field === 'year') {
      setYear(event.target.value);
    } else {
      setQuarter(event.target.value);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setError(null);
      await deleteReview(reviewToDelete.id);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete review');
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
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Performance Reviews
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/reviews/add')}
          >
            Add Review
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom>Year</Typography>
              <Select
                value={year}
                onChange={handleFilterChange('year')}
                size="small"
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y === 'all' ? 'All Years' : y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom>Quarter</Typography>
              <Select
                value={quarter}
                onChange={handleFilterChange('quarter')}
                size="small"
              >
                {quarters.map((q) => (
                  <MenuItem key={q} value={q}>
                    {q === 'all' ? 'All Quarters' : `Q${q}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {reviews.map((review) => (
          <Card key={review.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">
                    Review for {review.forUser.name} - {review.year} Q{review.quarter}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    By {review.fromUser.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/reviews/edit/${review.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(review)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              
              {['q1', 'q2', 'q3'].map((q, index) => (
                <Box key={q} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {review[q]}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {review[`a${index + 1}`]}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reviews;
