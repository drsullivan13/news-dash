import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://news-dash-api.vercel.app' 
    : '',
});

export default api; 