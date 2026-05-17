import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "https://backend-production-7d05.up.railway.app/api" 
        || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach token automatically for every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Global response handler
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;