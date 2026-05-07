import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // change to your backend
  //withCredentials: true, 
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  config.headers = {
    ...config.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return config;
});

export default api;