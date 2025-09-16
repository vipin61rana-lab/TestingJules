import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/v1',
});

// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        // Ensure compatibility: if response.data.jwt exists, use it as token
        if (response.data.jwt && !response.data.token) {
            response.data.token = response.data.jwt;
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export const getClaims = async () => {
    try {
        const response = await apiClient.get('/claims');
        return response.data;
    } catch (error) {
        console.error("Error fetching claims:", error);
        throw error;
    }
};

// --- Claim Processing Flow ---

export const saveClientInfo = async (clientData) => {
    try {
        const response = await apiClient.post('/processing/client', clientData);
        return response.data;
    } catch (error) {
        console.error("Error saving client info:", error);
        throw error;
    }
};

export const saveClaimDetails = async (claimId, claimData) => {
    try {
        const response = await apiClient.put(`/processing/claim/${claimId}`, claimData);
        return response.data;
    } catch (error) {
        console.error("Error saving claim details:", error);
        throw error;
    }
};

export const getClaimForReview = async (claimId) => {
    try {
        const response = await apiClient.get(`/processing/claim/${claimId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching claim for review:", error);
        throw error;
    }
};

export const submitClaim = async (claimId) => {
    try {
        const response = await apiClient.post(`/processing/submit/${claimId}`);
        return response.data;
    } catch (error) {
        console.error("Error submitting claim:", error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await apiClient.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/admin/users', userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const createClaim = async (claimData) => {
    try {
        const response = await apiClient.post('/claims', claimData);
        return response.data;
    } catch (error) {
        console.error("Error creating claim:", error);
        throw error;
    }
};

export const updateClaim = async (id, claimData) => {
    try {
        const response = await apiClient.put(`/claims/${id}`, claimData);
        return response.data;
    } catch (error) {
        console.error(`Error updating claim ${id}:`, error);
        throw error;
    }
};

export const deleteClaims = async (ids) => {
    try {
        const response = await apiClient.delete('/claims', { data: ids });
        return response.data;
    } catch (error) {
        console.error("Error deleting claims:", error);
        throw error;
    }
};
