import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Bypass-Tunnel-Reminder': 'true' // Required to bypass localtunnel's splash screen
  }
});

export default api;
