import axiosInstance from '../api/axios';

const API_BASE_URL = 'http://localhost:5200';

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`/api/user`);
        return response.data;
    } catch (error) {   
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const assignManager = async (userId, managerId) => {
    try {
        const response = await axiosInstance.post(`/api/user/assignmanager`, {
            userid: userId,
            managerid: managerId
        });
        return response.data;
    } catch (error) {
        console.error('Error assigning manager:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/api/user/me');
        console.log('Current user data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

export const getReportees = async () => {
    try {
        const response = await axiosInstance.get('/api/user/reportees');
        return response.data;
    } catch (error) {
        console.error('Error fetching reportees:', error);
        throw error;
    }
};