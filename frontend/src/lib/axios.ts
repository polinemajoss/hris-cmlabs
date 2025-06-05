// hris-cmlabs/frontend/src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Ini sudah benar
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;

console.log('Axios Base URL:', axiosInstance.defaults.baseURL);