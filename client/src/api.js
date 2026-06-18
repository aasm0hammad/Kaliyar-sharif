import axios from 'axios';

// Production mein VITE_API_URL environment variable use hoga
// Development mein Vite proxy kaam karega ('/api' -> localhost:5000)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

export default api;
