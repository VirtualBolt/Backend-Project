import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Laravel Backend API URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration/401
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If 401 unauthorized, log out the user (custom event or reload)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwt_token');
            // We usually redirect here via frontend router or window.location
        }
        return Promise.reject(error);
    }
);

export default api;
