import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            
            if (status === 401) {
                // Token expired or invalid
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else if (status === 403) {
                console.error('Permission denied:', data);
                // Add more detailed error information
                error.message = data?.message || 'You do not have permission to access this resource';
            } else if (status === 500) {
                console.error('Server error:', data);
                // Add more detailed error information
                error.message = data?.message || 'Internal server error occurred';
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
            error.message = 'No response from server';
        } else {
            // Error in request configuration
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 