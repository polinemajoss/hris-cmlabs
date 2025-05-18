import axios from 'axios';

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: "application/json",
  },
});

export default axiosInstance;
