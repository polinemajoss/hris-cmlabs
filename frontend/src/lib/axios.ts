// hris-cmlabs/frontend/src/lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api", // Ini sudah benar
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Atau 'accessToken', sesuaikan nama key Anda
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tangani 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau kadaluwarsa, lakukan logout
      localStorage.removeItem("authToken"); // Hapus token
      // Arahkan pengguna ke halaman login
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Sesuaikan path login Anda
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

console.log("Axios Base URL:", axiosInstance.defaults.baseURL);
