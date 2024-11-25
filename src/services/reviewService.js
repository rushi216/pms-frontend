import axiosInstance from '../api/axios';

export const getReviews = async (filters = {}) => {
    const { quarter, year, userId } = filters;
    const params = new URLSearchParams();
    
    if (quarter) params.append('quarter', quarter);
    if (year) params.append('year', year);
    if (userId) params.append('userId', userId);
    
    const response = await axiosInstance.get(`/api/Review?${params}`);
    return response.data;
};

export const getReview = async (id) => {
    const response = await axiosInstance.get(`/api/Review/${id}`);
    return response.data;
};

export const createReview = async (reviewData) => {
    const response = await axiosInstance.post('/api/Review', reviewData);
    return response.data;
};

export const updateReview = async (id, reviewData) => {
    await axiosInstance.put(`/api/Review/${id}`, reviewData);
};

export const deleteReview = async (id) => {
    await axiosInstance.delete(`/api/Review/${id}`);
};
