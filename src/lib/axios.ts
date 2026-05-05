import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend
});

// attach token automatically
api.interceptors.request.use((config:any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;