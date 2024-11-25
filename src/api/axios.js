import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

let msalInstance = null;

export const setMsalInstance = (instance) => {
    msalInstance = instance;
};

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            if (!msalInstance) {
                throw new Error('MSAL instance not initialized');
            }

            const account = msalInstance.getActiveAccount();
            if (!account) {
                throw new Error('No active account! Please sign in');
            }

            const tokenRequest = {
                scopes: ['api://6020b18b-a7ce-40d1-bb3d-34ed3a43e964/access_as_user'],
                account: account
            };

            const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
            config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
            return config;
        } catch (error) {
            if (error.name === 'InteractionRequiredAuthError') {
                await msalInstance.acquireTokenRedirect(tokenRequest);
            }
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && msalInstance) {
            const account = msalInstance.getActiveAccount();
            if (account) {
                await msalInstance.logoutRedirect();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
