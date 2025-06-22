import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions for chat
export const chatService = {
  // Get all chats for the current user
  getUserChats: () => {
    return api.get('/api/chats/user-chats');
  },
  
  // Get a specific chat by ID
  getChatById: (chatId) => {
    return api.get(`/api/chats/${chatId}`);
  },
  
  // Get messages for a specific chat
  getChatMessages: (chatId) => {
    return api.get(`/api/chats/${chatId}/messages`);
  },
  
  // Initialize a new chat
  initializeChat: (data) => {
    return api.post('/api/chats/initialize', data);
  },
  
  // Send a message
  sendMessage: (chatId, content) => {
    return api.post(`/api/messages`, { chatId, content });
  },
};

export default api;